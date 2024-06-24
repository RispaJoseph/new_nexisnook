import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import {BASE_URL} from '../utils/constants'
import jwt_decode from 'jwt-decode'
import followUserApi from '../api/followUserApi'

export const register = createAsyncThunk(
    'users/register',
    async({username,email,password}, thunkAPI) =>{
        const body =JSON.stringify({
            username,
            email,
            password
        })
        try{
            const response = await fetch(`${BASE_URL}/register/`, {
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body,
            })

            const data = await response.json()

            if (response.status === 201){
                return data
            } else{
                return thunkAPI.rejectWithValue(data)
            }
        } catch (err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const getUser = createAsyncThunk(
    'users/me',
    async(_,thunkAPI) =>{
        const access_token = localStorage.getItem('access_token')
        try{
            const response = await fetch(`${BASE_URL}/users/me/`,{
                method:'GET',
                headers:{
                    Accept:'application/json',
                    Authorization:`Bearer ${access_token}`,
                },
            })
            const data = await response.json()
            if (response.status === 200){
                return data
            } else{
                return thunkAPI.rejectWithValue(data)
            }
        } catch(err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const login = createAsyncThunk(
    'users/login',
    async({ email,password } , thunkAPI) =>{
        try {
            const response = await axios.post(`${BASE_URL}/token/`,{
                email,
                password
            })

            const data = response.data
            if (response.status === 200) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                const {dispatch} =thunkAPI
                dispatch(getUser())
                return data
            } else {
                return thunkAPI.rejectWithValue(data)
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)


export const logout = createAsyncThunk(
    'users/logout',
    async(_,thunkAPI) =>{
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        return undefined
    }
)

export const resetPostsState = createAsyncThunk(
    'users/resetPostState',
    async(_, {getState}) =>{
        const state = getState().user
        state.posts = []
    }
)

export const checkAuth = createAsyncThunk(
    'users/verify',
    async(_, thunkAPI) =>{
        const accessToken = localStorage.getItem('access_token')
        const body = JSON.stringify({ token: accessToken})
        try{
            const res = await fetch(`${BASE_URL}/token/verify/`, {
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body,
            })
            const data = await res.json()

            if(res.status === 200){
                const { dispatch } = thunkAPI
                dispatch(getUser())
                return data
            } else if (res.status === 401){
                const {dispatch} = thunkAPI
                await dispatch(updateToken())
                const updateTokenResult = thunkAPI.getState().userSlice
                if (updateTokenResult.isAuthenticated) {
                    const { dispatch } = thunkAPI
                    dispatch(getUser())
                    return data
                } else {
                    return thunkAPI.rejectWithValue(updateTokenResult.error)
                }
            } else {
                return thunkAPI.rejectWithValue(data)
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const updateToken = createAsyncThunk(
    'users/refresh',
    async(_,thunkAPI) =>{
        const refreshToken = localStorage.getItem('access_token')
        const body = JSON.stringify({ token : refreshToken})
        try {
            const res = await fetch(`${BASE_URL}/token/refresh/`,{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body,
            })
            const data = await res.json()
            if (res.status === 200) {
                localStorage.setItem('access_token',data.access)
                localStorage.setItem('refresh_token',data.refresh)
                const { dispatch } =thunkAPI
                dispatch(getUser())
                return data
            } else {
                const {dispatch} = thunkAPI
                dispatch(logout())
                return thunkAPI.rejectWithValue(data)
            }
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const followUser = createAsyncThunk(
    'user/followUser',
    async (userId,thunkAPI) => {
        try {
            await followUserApi(userId)
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const unfollowUser = createAsyncThunk(
    'user/unfollowUser',
    async (userId,thunkAPI) =>{
        try {
            await followUserApi(userId)
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

const INITIAL_STATE ={
    user:null,
    isAuthenticated:false,
    loading:false,
    registered:false,
    isSuperuser:false,
    posts:[],
    adminData: null,
    isFollowing:false,
}

const userSlice = createSlice({
    name:'user',
    initialState:INITIAL_STATE,
    reducers:{
        resetRegistered:(state) =>{
            state.registered = false
        },
        resetPostsState: (state) =>{
            state.posts = []
        },
    },

    extraReducers : builder =>{
        builder
        .addCase(register.pending,state =>{
            state.loading = true
        })
        .addCase(register.fulfilled, state =>{
            state.loading = false;
            state.registered = true
        })
        .addCase(register.rejected, state =>{
            state.loading = false
        })


        .addCase(login.pending, state =>{
            state.loading = true
        })
        .addCase(login.fulfilled, (state,action) =>{
            // state.loading = false;
            state.isAuthenticated = true;
            state.isSuperuser = jwt_decode(action.payload.access).is_superuser;
        })
        .addCase(login.rejected, state =>{
            state.loading = false
        })


        .addCase(getUser.pending,state =>{
            state.loading = true
        })
        .addCase(getUser.fulfilled, (state,action) =>{
            state.loading = false;
            state.user = action.payload;
            state.isSuperuser = state.user.is_superuser
        })
        .addCase(getUser.rejected, state =>{
            state.loading = false;
        })


        .addCase(logout.pending, state =>{
            state.loading = true
        })
        .addCase(logout.fulfilled, state =>{
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.isSuperuser = false
        })
        .addCase(logout.rejected, state =>{
            state.loading = false;
        })


        .addCase(checkAuth.pending, state =>{
            state.loading = true
        })
        .addCase(checkAuth.fulfilled, state =>{
            state.loading = false;
            state.isAuthenticated = true
        })
        .addCase(checkAuth.rejected, state =>{
            state.loading = false
        })


        .addCase(updateToken.pending, state =>{
            state.loading = true
        })
        .addCase(updateToken.fulfilled, state =>{
            state.loading = false;
            state.isAuthenticated = true;
        })
        .addCase(updateToken.rejected, state =>{
            state.loading = false
        })

        .addCase(followUser.fulfilled, (state) =>{
            state.isFollowing = true
        })

        .addCase(unfollowUser.fulfilled, (state) =>{
            state.isFollowing = false
        })
    }
})


export const {resetRegistered} = userSlice.actions;

export default  userSlice.reducer
import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import { resetRegistered,login } from "../redux/slice";
import appStores from '../images/appstore.png'
import loginImage1 from '../images/network.png'
import '../assets/css/fonts.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "../components/Loading";

const LoginPage = () => {

    const [error , setError] =useState('')

    const buttonStyle = {
        background:
          'radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), ' +
          'radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), ' +
          'linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)',
      };

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading,isAuthenticated,registered} = useSelector(state => state.user)
    const [formData,setFormData] = useState({
        email:'',
        password:''
    })

    useEffect(() =>{
        if(registered) dispatch(resetRegistered())
    },[registered,dispatch])


    useEffect(() =>{
        if(isAuthenticated) {
            navigate('/home')
        } else {
            navigate('/')
        }
    },[isAuthenticated,navigate])

    const {email,password} = formData

    const onChange = e =>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    

    const handleLogin = async (e) =>{
        e.preventDefault()
        dispatch(login({email,password}))
        .unwrap()
        .then((data) =>{
            console.log('login successfully')
        })
        .catch((error) =>{
            setError('Invalid username or password')
        })
    }

  return (
        <div className="container">
        <div className="row mt-5">
            <h2 className="font-script">NexisNook</h2>
            <div className="col-md-6 mt-2">
            <img src={loginImage1} alt="login Image" className="img-fluid" />
            </div>
            
            <div className="col-md-6 mt-5">
                <div className="d-flex flex-column align-items-center justify-content-center">

                    <form onSubmit={handleLogin} className="mt-4 " style={{width:'60%'}}>
                        <div className="mb-3">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="form-control"
                            placeholder="Email"
                            required
                        />
                        <div className="text-sm mt-3 mb-3 float-right">
                            <Link
                            to={'/forgot-password'}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 text-decoration-none"
                            >
                            Forgot password?
                            </Link>
                        </div>
                        </div>
                        <div className="mb-3">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="form-control"
                            placeholder="Password"
                            required
                        />
                        </div>
                        <button type="submit" className="btn btn-secondary" style={buttonStyle}>Log In</button>
                        {error && <p className="text-danger mt-2">{error}</p>}
                    </form>
                    <p className="mt-3 text-center text-sm text-gray-500">Don't have an account? <Link to={'/register'} className="font-semibold leading-6 ml-2 text-indigo-600 hover:text-indigo-500 text-decoration-none">Sign up</Link></p>
                    <p className="mt-1">Are you Superuser? <Link to={"/admin-login"} className="font-semibold leading-6 ml-2 text-indigo-600 hover:text-indigo-500 text-decoration-none">Login Here</Link></p>
                    {/* <div className="mt-4">
                        <p>Get the app.</p>
                        <img src={appStores} alt="Get the app" className="img-fluid" style={{ width: '300px' }} />
                    </div> */}
                </div>
            </div>
                    
            
        </div>
        </div>
  );
}

export default LoginPage

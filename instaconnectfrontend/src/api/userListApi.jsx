import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'

const userListApi = async () => {
    try {
        const accessToken = localStorage.getItem('access_token')
        const response = await axios.get(`${BASE_URL}/userslist/`, {
            headers: {
                Accept : 'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${accessToken}`
            }
        })
        if (response.status === 200) {
            console.log(response.data)
            toast.success('Fetching data from database',{
                position:'top-center'
            })
            return response.data
        } else {
            console.error('Failed to fetch user details:', response.statusText);
            toast.error('Failed fetching user details.', {
                position: 'top-center',
            });
            return null;
        }
    } catch (error) {
        console.error(error);
        toast.error('Failed fetching user details.', {
        position: 'top-center',
        });
        return null;
    }
}

export default userListApi

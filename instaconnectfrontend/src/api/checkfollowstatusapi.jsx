import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const checkfollowstatusapi = async (email) => {
  try {
    const accessToken = localStorage.getItem('access_token')
    const response = await axios.get(`${BASE_URL}/post/check-follow-status/${email}/`,{
        headers: {
            Accept:'application/json',
            Authorization:`Bearer ${accessToken}`,
        },
    })

    if (response.status === 200 ) {
        console.log('profile in Api',response.data)
        return response.data
    } else {
        console.log('error in profile Api')
        console.log(response.error)
    }
  } catch (error){
    console.log('error in profile Api')
    console.error(error)
    return { error : 'An error occurred'}
  }
}

export default checkfollowstatusapi

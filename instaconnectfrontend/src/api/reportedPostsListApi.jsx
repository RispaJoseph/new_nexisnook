import axios from "axios";
import { BASE_URL } from "../utils/constants";

const reportedPostsListApi = async () => {
    try {
        const accessToken = localStorage.getItem('access_token')
        const response = await axios.get(`${BASE_URL}/reportedposts/`,{
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${accessToken}`
            }
        })

        if (response.status === 200){
            console.log('homepage',response.data)
            return response.data
        } else {
            console.error('Failed to fetch reported posts:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default reportedPostsListApi
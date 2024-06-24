import axios from "axios";
import { BASE_URL } from "../utils/constants";

const reportPostApi = async (postId,fetchData) => {
try{
    let accessToken = localStorage.getItem('access_token');
    
        const response= await axios.post(`${BASE_URL}/post/report/${postId}/`, {}, {
            headers: {
                Accept :'application/json',
                Authorization :`Bearer ${accessToken}`
            },
        });
        if(response.status === 200){
            console.log('post reported');
            if (fetchData) {
                fetchData(); 
              }
              return response.data
        }else{
            console.log(response.error);
        }

    }catch (error){
        console.log(error);
    }

}

export default reportPostApi

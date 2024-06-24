import axios from "axios";
import { BASE_URL } from "../utils/constants";

const likePostApi = async (postId, fetchData) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      let body = {}
      const response = await axios.post(`${BASE_URL}/post/like/${postId}/`,body,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      console.log('Response from likePostApi:', response);

      if (response.status === 200) {
        console.log('Post like toggled successfully');
        if (fetchData) {
          fetchData(); 
        }
      } else {
        console.log('Error toggling post like:',response.error);
      }
    } catch (error) {
      console.error('Error in likePostApi:',error);
    }
  };
  
  export default likePostApi;
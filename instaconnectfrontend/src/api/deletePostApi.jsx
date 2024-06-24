import axios  from "axios";
import { BASE_URL } from "../utils/constants";

const deletePostApi =async(postId,fetchData) =>{
    try{
        const accessToken = localStorage.getItem('access_token')
        const response = await axios.delete(`${BASE_URL}/post/delete-post/${postId}`,{
            headers:{
                Accept:'application/json',
                Authorization:`Bearer ${accessToken}`,
            },
        })
        if(response.status === 200){
            console.log('item deleted !')
            if(fetchData){
                fetchData();
            }
        }else{
            console.log(response.error)
        }
    } catch(error){
        console.log(error)
    }
}

export default deletePostApi
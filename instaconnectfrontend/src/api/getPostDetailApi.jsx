// api cll to get the detail of each sigle post.!
import axiosInstance from '../utils/axiosInstance';

const getPostDetailApi = async (postID, fetchData) => {
 try{
    const response = await axiosInstance({
        url: `/post/post-detail/${postID}`,
        method: "GET",
      });
      if (response.status === 200) {
        console.log("homepage->post details->", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
    } 
};

export default getPostDetailApi

// follow and unfollow user
import axiosInstance from '../utils/axiosInstance';

const followUserApi = async (userId,fetchData) => {
  try {
    const response = await axiosInstance({
      url: `/post/follow-user/${userId}/`,
      method: "POST",
    });
    if (response.status === 200) {
      console.log("toggle followed", response.data);
      if(fetchData){
        fetchData();
      }
    } else {
      console.log(response.error);
    }
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default followUserApi


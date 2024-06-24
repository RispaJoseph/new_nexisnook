import axiosInstance from '../utils/axiosInstance';

const UpdateUserDetailApi = async (formVal,displayPic) => {
    try {
        const formData = new FormData();
        const accessToken = localStorage.getItem('access_token');
        if (formVal.first_name) formData.append('first_name', formVal.first_name);
        if (formVal.last_name) formData.append('last_name', formVal.last_name);
        if (displayPic) formData.append('display_pic', displayPic);
        
        const response = await axiosInstance({
          url: '/user-update/',
          method: "POST",
          data:formData,
          headers: {
            Authorization: `Bearer ${accessToken}`
        }
        });

        if (response.status === 200) {  
          return response.data;
        } else {
          return response.error;
        }
        
      } catch (error) {
        console.error(error);
      }
}


export default UpdateUserDetailApi

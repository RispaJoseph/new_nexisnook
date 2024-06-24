import axiosInstance from '../utils/axiosInstance';


const createCommentApi = async (postID, comment) => {
    try {
        const formData = new FormData();
        formData.append('body', comment);

        const response = await axiosInstance({
          url: `/post/create-comment/${postID}/`,
          method: "POST",
          data:formData,
        });
        if (response.status === 201) {
          return response.data;
        } else {
          console.log(response.error);
        }
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
}

export default createCommentApi

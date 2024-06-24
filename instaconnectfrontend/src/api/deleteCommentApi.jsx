import axiosInstance from '../utils/axiosInstance';


const deleteCommentApi = async (commentID) => {
    try {

        const response = await axiosInstance({
          url: `/post/delete-comment/${commentID}/`,
          method: "DELETE",
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

export default deleteCommentApi

import axiosInstance from "../utils/axiosInstance";

const getChatMessagesApi = async (roomId) => {
    try {
      const response = await axiosInstance({
        url: `/chat/chat-room/${roomId}`,
        method: "GET",
      });
      if (response.status === 200) {
        console.log("get chat messages.!", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

export default getChatMessagesApi


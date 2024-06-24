import axiosInstance from "../utils/axiosInstance";

const postListAllApi = async (userToken) => {
    try {
        const response = await axiosInstance({
            url: '/post/explore',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        })
        if (response.status === 200) {
            console.log('homepage',response.data)
            return response.data
        } else {
            console.log(response.error)
        }
        console.log(response.data)
    } catch (error) {
        console.error(error)
    }
}

export default postListAllApi
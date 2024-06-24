import axios from 'axios'
import {BASE_URL} from '../utils/constants'


const createPostApi = async (content, postImage) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('body', content);
        formData.append('img', postImage);

        const response = await axios.post(`${BASE_URL}/post/create-post/`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log('Response data from createPostApi:', response.data);

          if (response.status === 201) {
            console.log('new post created')
            return response.data;
          } else {
            console.log(response.error);
            return null
          }
    }
    catch(error){
        console.log(error);
        return null
    }
}

export default createPostApi

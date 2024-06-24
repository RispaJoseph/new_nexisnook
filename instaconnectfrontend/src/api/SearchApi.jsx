import axios from "axios"
import { BASE_URL } from "../utils/constants"

const SearchApi = async (inputValue) => {
  try {
    const response =await axios.get(`${BASE_URL}/post/search-request/`,{
        params:{q:inputValue}
    })

    if(response.status === 200) {
        console.log('search data',response.data)
        return response.data
    } else {
        console.log(response.error)
    }
     
  } catch (error) {
    console.log(error)
  }
}

export default SearchApi

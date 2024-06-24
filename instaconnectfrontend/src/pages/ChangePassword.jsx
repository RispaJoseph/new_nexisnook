import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import appStores from '../images/appstore.png'
import loginImage1 from '../images/network.png'
import '../assets/css/fonts.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "../components/Loading";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePassword = () => {

    const [error , setError] =useState('')
    const navigate = useNavigate()
    const buttonStyle = {
        background:
          'radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), ' +
          'radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), ' +
          'radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), ' +
          'linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)',
      };

    const dispatch = useDispatch()
    const {registered,loading} =useSelector(state => state.user)
    const [formData,setFormData] = useState({
        password:'',
        password1:''
    })
    const {password,password1} = formData

    const {userId} = useParams()

    const onchange = (e) =>{
        setFormData({ ...formData, [e.target.name] : e.target.value})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try {
            if(password===password1){
                console.log('the user id is:',userId)
                const response = await axios.post(`${BASE_URL}/change-password/${userId}/`,formData,{
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                    },
                })

                if(response.status === 200){
                    console.log('Password change successfully')
                    navigate('/')
                } else {
                    console.error('Error occured',response.data)
                    setError(response.data.message)
                }
            }else{
                toast.error("Password mis-match")
            }
        } catch (error) {
            console.error('Error occurred', error);
            setError('Error occurred while Changing password');
        }
        
    }

  return (
    <div className="container">
      <div className="row mt-5">
        <h2 className="font-script">NexisNook</h2>
        <div className="col-md-6 mt-2">
          <img src={loginImage1} alt="login Image" className="img-fluid" />
        </div>
        
        <div className="col-md-6 mt-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <form onSubmit={handleSubmit} className="mt-4 " style={{width:'60%'}}>
              <div className="mb-3">
                <input
                  id="password"
                  name="password"
                  placeholder="New Password"
                  type="password"
                  value={password}
                  onChange={onchange}
                  className='form-control'
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  id="password1"
                  name="password1"
                  placeholder="Confirm New Password"
                  type="password"
                  value={password1}
                  onChange={onchange}
                  className='form-control'
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary " style={buttonStyle}>
                Submit
              </button>
            </form>
            {/* <div className="mt-4">
              <p>Get the app.</p>
              <img
                src={appStores}
                alt="Get the app"
                style={{ width: '300px' }}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword

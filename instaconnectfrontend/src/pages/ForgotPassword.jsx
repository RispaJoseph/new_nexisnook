import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appStores from '../images/appstore.png'
import loginImage1 from '../images/network.png'
import '../assets/css/fonts.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "../components/Loading";
import { BASE_URL } from "../utils/constants";

const ForgotPassword = () => {

    const [error , setError] =useState('')
    const [successMessage , setSuccessMessage] = useState('')

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

    const {loading,isAuthenticated,registered} = useSelector(state => state.user)
    const [formData,setFormData] = useState({
        email:'',
    })

    const {email} = formData

    const onChange = e =>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${BASE_URL}/forgot-password/`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
      
          const data = await response.json();
      
          if (response.status === 200) {
            console.log('Email sent successfully');
            setSuccessMessage('Email sent successfully');
            setError('');
          } else {
            console.error('Error occurred', data);
            setError(data.message);
            setSuccessMessage('');
          }
        } catch (error) {
            console.error('Error occurred', error);
            setError('Error occurred while sending email');
            setSuccessMessage(''); 
        }
    };

  return (
    <div className="container">
      <div className="row mt-5">
        <h2 className="font-script">NexisNook</h2>
        <div className="col-md-6 mt-2">
          <img src={loginImage1} alt="login Image" className="img-fluid" />
        </div>
        {loading ? (
            <Loading />
        ):(
        <div className="col-md-6 mt-5">
            <div className="d-flex flex-column align-items-center justify-content-center">

                <form onSubmit={handleSubmit} className="mt-4 " style={{width:'60%'}}>
                    <div className="mb-3">
                    <h6>Enter you Email Here..</h6>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Email"
                        required
                    />
                    </div>
                    
                    <button type="submit" className="btn btn-secondary" style={buttonStyle}>Send</button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    {successMessage && <p className="text-success mt-2">{successMessage}</p>}
                </form>
                   {/* <div className="mt-4">
                    <p>Get the app.</p>
                    <img src={appStores} alt="Get the app" className="img-fluid" style={{ width: '300px' }} />
                </div> */}
            </div>
        </div>
                   
        )}
      </div>
    </div>
  );
}

export default ForgotPassword

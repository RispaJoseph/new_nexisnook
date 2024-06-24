import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate,Link } from 'react-router-dom'
import { resetRegistered,login, getUser } from '../redux/slice'
import {toast} from 'react-toastify'
import appStores from '../images/appstore.png'
import loginImage1 from '../images/network.png'
import '../assets/css/fonts.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminLogin = () => {

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
    const navigate = useNavigate()
    const {loading, registered } = useSelector( state => state.user)
    const [formData,setFormData] =useState({
        email:'',
        password:''
    })
    const {email,password} = formData
    const onChange = e =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }

    const handleLogin = (e) => {
        e.preventDefault();
        try {
          dispatch(login({ email, password })).then((response) => {
            if (login.fulfilled.match(response)) {
              const token = response.payload.access;
              localStorage.setItem('access_token', token);
      
              // Fetch user data after successful login
              dispatch(getUser(token)).then((userResponse) => {
                const user = userResponse.payload; // Assuming this contains user data
                console.log('while login users details',user.is_superuser)
                if (user.is_superuser) {
                  // Redirect to the admin dashboard for superusers
                  navigate('/admin-dashboard');
                } else {
                  // Redirect to the user dashboard or login page for regular users
                  navigate('/'); // Replace with your user dashboard URL
                }
              });
            } else {
              toast.error('Admin Login failed ...');
            }
          });
        } catch (error) {
          toast.error('Admin Login failed ...');
        }
      };

    useEffect(() =>{
        if(registered) dispatch(resetRegistered())
    },[registered,dispatch])
  return (
    <div className="container">
      <div className="row mt-5">
        <h2 className="font-script">NexisNook</h2>
        <div className="col-md-6 mt-2">
          <img src={loginImage1} alt="login Image" className="img-fluid" />
        </div>
        <div className="col-md-6 mt-5">
            <div className="d-flex flex-column align-items-center justify-content-center">

                <form onSubmit={handleLogin} className="mt-4 " style={{width:'60%'}}>
                    <div className="mb-3">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Admin Email"
                        required
                    />
                    </div>
                    <div className="mb-3">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Admin Password"
                        required
                    />
                    </div>
                    <button type="submit" className="btn btn-secondary" style={buttonStyle}>Log In</button>
                </form>
                <p className="mt-1">Are you an User? <Link to={"/"} className="font-semibold leading-6 ml-2 text-indigo-600 hover:text-indigo-500 text-decoration-none">Login Here</Link></p>
                {/* <div className="mt-4">
                    <p>Get the app.</p>
                    <img src={appStores} alt="Get the app" className="img-fluid" style={{ width: '300px' }} />
                </div> */}
            </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

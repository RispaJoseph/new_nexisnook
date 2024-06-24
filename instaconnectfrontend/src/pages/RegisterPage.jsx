import React, { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {toast} from 'react-toastify'
import {Link,Navigate} from 'react-router-dom'
import {register} from '../redux/slice'
import appStores from '../images/appstore.png'
import loginImage1 from '../images/network.png'
import '../assets/css/fonts.css'
import 'bootstrap/dist/css/bootstrap.min.css';



const RegisterPage = () => {

    const [generalErrorMessage, setGeneralErrorMessage] = useState('');

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
        username:'',
        email:'',
        password:'',
        password1:''
    })
    const {email,username,password,password1} = formData

    const onchange = (e) =>{
        setFormData({ ...formData, [e.target.name] : e.target.value})
    }

    const userRegister = async(e) =>{
        e.preventDefault()
        if(password===password1){
            dispatch(register({username,email,password}))
            .unwrap()
            .then((data) =>{
              console.log('regestration successfull')
            })
            .catch((error) =>{
              if (error.response && error.response.data) {
                const responseErrors = error.response.data
                setGeneralErrorMessage(responseErrors[Object.keys(responseErrors)[0]][0]);
              } else {
                toast.error('An error occured during registration.')
                console.error('unhandled error:',error)
              }
            })
        }else{
            toast.error("Password mis-match")
        }
    }

    if(registered) return <Navigate to='/' />
  return (
    <div className="container">
      <div className="row mt-5">
        <h2 className="font-script">NexisNook</h2>
        <div className="col-md-6 mt-2">
          <img src={loginImage1} alt="login Image" className="img-fluid" />
        </div>
        
        <div className="col-md-6 mt-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
          {generalErrorMessage && (
              <div className="alert alert-danger">{generalErrorMessage}</div>
            )}
            <form onSubmit={userRegister} className="mt-4 " style={{width:'60%'}}>
              <div className="mb-3">
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={onchange}
                  className='form-control'
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  id="username"
                  name="username"
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={onchange}
                  className='form-control'
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
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
                  placeholder="Confirm Password"
                  type="password"
                  value={password1}
                  onChange={onchange}
                  className='form-control'
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary " style={buttonStyle}>
                Sign up
              </button>
            </form>
            <div className="mt-4">
              Already have an account?
              <Link to="/" className='font-semibold leading-6 ml-2 text-indigo-600 hover:text-indigo-500 text-decoration-none'>
                {' '}
                Login
              </Link>
            </div>
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

export default RegisterPage

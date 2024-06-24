import React,{useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import UpdateUserDetailApi from '../api/UpdateUserDetailApi'
import { BASE_URL } from '../utils/constants';
import { getUser } from '../redux/slice'
import DisplayPicture from '../images/Default-Profile-Picture1.png'

const ProfileUpdateModal = ({ isVisible, onClose }) => {

    const { user }=useSelector(state=>state.user);
    const dispatch = useDispatch()
    const [displayPic,setDisplayPic] = useState(null)
    
    const [formData,setFormData] = useState({
        username:user?.username,
        first_name:user?.first_name,
        last_name:user?.last_name,
        display_pic:user?.display_pic,
        email:user?.email
    })

    const {username,first_name,last_name,display_pic,email} = formData

    const onChange = e => {
      setFormData({...formData, [e.target.name]: e.target.value });
    }

    if( !isVisible ) return null;

    const handleClose = (e) =>{
        if(e.target.id === 'wrapper') onClose();
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            await UpdateUserDetailApi(formData,displayPic);
            toast.success('User details updated successfully!', {
                position: "top-center",
              });
              dispatch(getUser());
              onClose();
        }catch (error) {
            toast.error('Failure, User details not Updated!', {
              position: "top-center",
            });
            onClose();
      }
  };

    var loadFile = function(event) {   
      setDisplayPic(event.target.files[0])
      var output = document.getElementById('preview_img');
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function() {
          URL.revokeObjectURL(output.src) // free memory
      }
    };

  return (
    <div
      className="z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="m-2 w-full md:w-2/5 flex flex-col">
        <button className="text-white text-xl place-self-end" onClick={onClose}>
          x
        </button>
        <div className="bg-white p-10 rounded">
            <form onSubmit={handleSubmit}>
            <label htmlFor="modal" className="flex justify-center font-bold ">
              Update User Details
            </label>
            <div className="shrink-0 flex justify-center">
                    <img id='preview_img' className="border-b-2 w-36 h-36 object-cover rounded-full my-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]" src={ user?.display_pic ? `${BASE_URL}${user?.display_pic}` : DisplayPicture} alt="" />
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
              New Profile Picture
              </label>
              <input
                onChange={loadFile}
                className="relative my-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile"
              />
            </div>
              <div>
                  <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">First Name</label>
                  <input 
                  type="text" 
                  id="firstname" 
                  className="block w-full p-2  text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={first_name}
                  name='first_name'
                  onChange={onChange}/>
              </div>
              <div>
                  <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Last Name</label>
                  <input 
                  value={last_name}
                  name='last_name'
                  onChange={onChange} 
                  type="text" id="astname" 
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
              </div>
              <div>
                  <label htmlFor="E-mail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email Address</label>
                  <input defaultValue={email} type="email" id="E-mail" aria-label="disabled input" className="mb-2 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"  disabled></input>
              </div>
              <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Username</label>
                  <input defaultValue={username} type="text" id="username" aria-label="disabled input" className="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled></input>
              </div>
              <button
              type="submit"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-flex items-center rounded bg-gray-600 px-6 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              {/* <span className="material-symbols-outlined text-sm mr-2">
                upload
              </span> */}
              <span className="flex-shrink-0 ">Done</span>
            </button>
            </form>
        </div>
       </div>
    </div>
  )
}

export default ProfileUpdateModal

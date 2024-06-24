import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MoreVertIcon from '@mui/icons-material/MoreVert';


const DropdownOptions = ({post,handleDeletePost, handleUpdatePost,handleReportPost}) => {

  const [show,setShow] = useState(false);
  const { user } = useSelector(state=>state.user);

  const handleClick =()=>{
    setShow(!show);
  };

  const menuOpt = post?.author?.email === user?.email ? [{ label: 'Delete' }, { label: 'Update' }] : [{ label: 'Report' }];
  // const menuOpt = [{ label: 'Delete' }, { label: 'Update' }]

  return (
    <div className="text-black relative text-sm font-bold inline-block">
        <button
            type="button"
            className="rounded-full inline-block font-medium uppercase leading-normal focus:outline-none"
            data-te-ripple-init
            data-te-ripple-color="light"
            onClick={handleClick}
            >
            <MoreVertIcon />
        </button>
      {show && (
        <div className='absolute bg-white rounded-md shadow-lg top-0 right-0 mt-8'> 
        {menuOpt.map((menu)=>(
          <div
          key={menu.label}
          className='block cursor-pointer p-2 hover:bg-gray-100'
          onClick={()=>{
            if(menu.label === 'Delete'){
              handleDeletePost(post.id);
              handleClick();
            }else if(menu.label === 'Update'){
              handleUpdatePost(post.id);
              handleClick();
            }else if(menu.label === 'Report'){
              handleReportPost(post.id);
              handleClick();
            }
          }}>
              {menu.label}
          </div>

        ))}
        </div>
      )}
    </div>
  );
};

export default DropdownOptions

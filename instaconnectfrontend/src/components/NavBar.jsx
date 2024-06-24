import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material'
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logout,resetPostsState } from '../redux/slice';
import PostModal from './PostModal';
import Search from './Search';
import { BASE_URL } from '../utils/constants';
import DisplayPicture from '../images/Default-Profile-Picture1.png'
import Notifications from './Notifications';
import getNotificationApi from '../api/getNotificationsApi';

const NavBarWrapper = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-family: "Style Script";
  color:black;
  font-size: 33px;
  margin: 25px;
  text-decoration:none;

  &:hover {
    cursor: pointer;
    text-decoration: none !important;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgb(0, 0, 0);
  background: 0;
  border: 0;
  margin: 10px 15px 10px 15px;
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
  width: 100%;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    background-color: #C3C2C2;
  }

  &:hover {
    cursor: pointer;
    background-color: #C3C2C2;
    text-decoration: none !important; /* Add !important to increase specificity */
  }
`;

const AvatarContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  margin: 10px 15px 10px 15px;
  padding: 10px 15px 10px 10px;
  border-radius: 15px;
  width: 100%;
  color: rgb(0, 0, 0);

  &:hover {
    cursor: pointer;
    background-color: #C3C2C2;
  }

  &:hover {
    cursor: pointer;
    background-color: #C3C2C2;
    text-decoration: none !important; /* Add !important to increase specificity */
  }
`

const LogoutButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgb(0, 0, 0);
  background: 0;
  border: 0;
  margin: 5px 15px 5px 15px;
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
  text-decoration: none;
  position: fixed;
  bottom: 3px;

  &:hover {
    cursor: pointer;
    background-color: #C3C2C2;
  }

  &:hover {
    cursor: pointer;
    background-color: #C3C2C2;
    text-decoration: none !important;
    width: 11%;
  }
`;


const NavBar = ({ updatePostList }) => {
    const navigate = useNavigate()
    // const [show,setShow] = useState(false)
    const [showSearch , setShowSearch] = useState(false)
    const [showNotifications , setShowNotifications] = useState(false)
    const [notification , setNotification] = useState([])
    const [showPostModal , setShowPostModal] = useState(false)

    const {user,isAuthenticated , loading} = useSelector(state => state.user)
    const dispatch = useDispatch()

    const email = isAuthenticated ? user?.email:''

    const handleNewPostCreated = (newPostData) => {
      updatePostList(newPostData);
      setShowPostModal(false);
    };

    useEffect(() => {
      const fetchData = async () =>{
        try {
          const data = await getNotificationApi()
          setNotification(data)
        } catch (error) {
          console.error(error)
        }
      }
      if (user && !loading) {
        fetchData()
      }
    },[user,loading])

    useEffect(() =>{
      if (user) {
        const accessToken = localStorage.getItem('access_token')
        const websocketProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const socket = new WebSocket(`${websocketProtocol}${window.location.host}/ws/notification/?token=${accessToken}`);

        socket.onopen = () => {
          console.log('websocket connection established')
        }

        socket.onmessage = (event) => {
          const newNotification = JSON.parse(event.data)
          console.log(newNotification)
          if (newNotification.type === 'notification' ) {
            setNotification((prevNotifications) => [...prevNotifications,newNotification.payload])
          }
        }

        socket.onclose = (event) => {
          console.log('Websocket connection closed' , event)
        }
        return () =>{
          socket.close()
        }
      }
    },[user])

    const handleLogout = () =>{
        dispatch(logout())
        dispatch(resetPostsState())
    }

    const createPost = () =>{
      if (showPostModal === true ) {
        setShowPostModal(false)
      } else {
        setShowPostModal(true)
      }
    }

    const openSearch = () =>{
      setShowSearch(true)
    }

    const closeSearch = () =>{
      setShowSearch(false)
    }

    const removeNotification = (notificationIdToRemove) => {
      setNotification((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationIdToRemove
        )
      )
    }

  return (
    <NavBarWrapper>
      <Logo to='/'>Instaconnect</Logo>
      <ButtonContainer>
        <NavButton to="/">
          <HomeIcon />
          <span>Home</span>
        </NavButton>
        <NavButton to="">
          <SearchIcon />
          <span>Search</span>
        </NavButton>
        <NavButton to="">
          <ExploreIcon />
          <span>Explore</span>
        </NavButton>
        <NavButton to="">
          <ChatIcon />
          <span>Messages</span>
        </NavButton>
        <NavButton to="">
          <FavoriteIcon />
          <span>Notification</span>
        </NavButton>
        <NavButton to="">
          <AddCircleIcon />
          <span>Create</span>
        </NavButton>
        <AvatarContainer to={`/profile/${email}`}>
          <Avatar className="avatar">
            <img src={ user?.display_pic ? `${BASE_URL}${user?.display_pic}` : DisplayPicture} alt="" />
          </Avatar>
          <span>Profile</span>
        </AvatarContainer>
        <LogoutButton onClick={handleLogout}>
          <LogoutIcon />
          <span>Logout</span>
        </LogoutButton>
      </ButtonContainer>
      <PostModal isVisible={showPostModal} onClose={() => setShowPostModal(false)} updatePostList={updatePostList} />
      <Search isVisible={showSearch} onClose={closeSearch} />
      <Notifications isVisible={showNotifications} onClose={()=>setShowNotifications(false)} notification={notification} removeNotification={removeNotification}/>
    </NavBarWrapper>
    
  )
}

export default NavBar
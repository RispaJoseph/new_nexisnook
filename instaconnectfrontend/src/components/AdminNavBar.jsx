import React from 'react'
import {BsGrid1X2Fill,BsPersonCircle,BsPeopleFill,BsListCheck,BsMenuButtonWideFill,BsFillGearFill,BsBoxArrowRight } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../redux/slice'
import styled from 'styled-components'

export const Sidebar = styled.aside`
  grid-area: sidebar;
  height: 100%;
  background-color: #263043;
  overflow-y: auto;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
`;

export const SidebarTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px 0px 30px;
  margin-bottom: 30px;
`;

export const CloseIcon = styled.span`
  display: none;
`;

export const SidebarBrand = styled.div`
  margin-top: 15px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
`;

export const SidebarList = styled.ul`
  padding: 0;
  list-style-type: none;
`;

export const SidebarListItem = styled.li`
  padding: 20px;
  font-size: 18px;
  display: flex;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    text-decoration: none;
    width: 100%;
  }
`;

export const SidebarLink = styled(Link)`
  text-decoration: none;
  color: #9e9ea4;
  display:flex;
`;

export const Icon = styled.div`
  margin-right: 5px;
`;

export const LogoutButton = styled.button`
  bottom: 3px;
  position: fixed;
  &:hover {
    color: #9e9ea4;
    width: 17%;
  }
`;


const AdminNavBar = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () =>{
        dispatch(logout())
        navigate('/')
    }
  return (
    <Sidebar>
      <SidebarTitle>
        <SidebarBrand>
          <Icon ><BsPersonCircle className='icon_header' /> </Icon> Admin Panel
        </SidebarBrand>
        <CloseIcon>X</CloseIcon>
      </SidebarTitle>
      <SidebarList>
        <SidebarListItem>
          <SidebarLink to="/admin-dashboard">
          <Icon ><BsGrid1X2Fill className='icon'/></Icon>Dashboard
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/users">
          <Icon ><BsPeopleFill className='icon'/></Icon>Users
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/posts-lists">
          <Icon ><BsListCheck className='icon'/></Icon>Posts
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/reported-posts">
          <Icon ><BsMenuButtonWideFill className='icon'/></Icon>Reports
          </SidebarLink>
        </SidebarListItem>
        <LogoutButton onClick={handleLogout}>
          <SidebarListItem>
          <Icon ><BsBoxArrowRight className='icon' /></Icon> Logout
          </SidebarListItem>
        </LogoutButton>
      </SidebarList>
    </Sidebar>
  )
}

export default AdminNavBar

import React, { useEffect, useState } from 'react'
import { BsFillBellFill,BsFillEnvelopeFill,BsPersonCircle,BsJustify,BsSearch } from 'react-icons/bs'
import userListApi from '../api/userListApi'
import { BASE_URL } from '../utils/constants'
import AdminNavBar from '../components/AdminNavBar'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import {MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import DefaultPicture from '../images/default_picture.png'


export const Body = styled.div`
  margin: 0;
  padding: 0;
  background-color: #1d2634;
  color: #9e9ea4;
  font-family: 'Montserrat', sans-serif;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr 1fr 1fr;
  grid-template-rows: 0.2fr 3fr;
  grid-template-areas: 'sidebar header header header' 'sidebar main main main';
  height: 100vh;
`;

export const Icon = styled.div`
  vertical-align: middle;
  line-height: 1px;
  font-size: 20px;
`;

export const IconHeader = styled.div`
  vertical-align: middle;
  line-height: 1px;
  font-size: 26px;
`;

export const CloseIcon = styled.div`
  color: red;
  margin-left: 30px;
  margin-top: 10px;
  cursor: pointer;
`;

export const HeaderRight = styled.div`
  display: flex;
  .icon {
    margin: 5px;
  }
`;

export const Header = styled.header`
  grid-area: header;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px 0 30px;
  box-shadow: 0 6px 7px -3px rgba(0, 0, 0, 0.35);
`;

export const MenuIcon = styled.div`
  display: none;
`;

export const MainContainer = styled.main`
  grid-area: main;
  overflow-y: auto;
  padding: 20px 20px;
  color: rgba(255, 255, 255, 0.95);
`;

export const MainTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CenteredTable = styled(MDBTable)`
  width: 80%;
  margin: 0 auto;
  margin-top:30px;
`;

const UsersList = () => {

    const [users,setUsers] = useState()

    useEffect (() =>{
        const fetchUsers = async () =>{
            try {
                const data = await userListApi()
                setUsers(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUsers()
    },[])

    const blockUser = async (id) =>{
        const accessToken = localStorage.getItem('access_token')
        try {
            const response = await fetch(`${BASE_URL}/blockuser/${id}`,{
                method:'GET',
                headers:{
                    Accept:'application/json',
                    Authorization:`Bearer ${accessToken}`
                },
            })
            console.log(response)
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user,is_active: !user.is_active } : user
            ))
            toast.success('Blocked/Unblocked a User',{
                position:'top-center',
            })
        } catch {
            console.log('error')
        }
    }

  return (
    <Body>
      <GridContainer>
        <Header className='header'>
          <MenuIcon>
            <BsJustify className='icon' />
          </MenuIcon>
          <div className="header-left">
            <BsSearch className='icon' />
          </div>
          <HeaderRight>
            <BsFillBellFill className='icon' />
            <BsFillEnvelopeFill className='icon' />
            <BsPersonCircle className='icon' />
          </HeaderRight>
        </Header>
        <AdminNavBar />
        <MainContainer className='main-container'>
            <MainTitle className="main-title">
                <h3>Users</h3>
            </MainTitle>
            <CenteredTable>
                <MDBTable align='middle'>
                    <MDBTableHead>
                        <tr>
                        <th scope='col'>Username</th>
                        <th scope='col'>Details</th>
                        <th scope='col'>Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {users?.map((item) => (
                        <tr>
                            <td>
                                <div className='d-flex align-items-center'>
                                <img
                                    src={item.display_pic ? `${BASE_URL}${item.display_pic}` : '../images/default_picture.png' }
                                    alt={item.username}
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                />
                                <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{item.username}</p>
                                </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{item.first_name} {item.last_name}</p>
                                <p className='text-muted mb-0'>{item.email}</p>
                            </td>
                            <td>
                            {item.is_active ? (
                            <button className="bg-red-500 rounded-md p-2 text-white font-bold hover:bg-red-600 relative" onClick={() => blockUser(item.id)}>Block</button>
                            ):(
                            <button className="bg-green-500 rounded-md p-2 text-white font-bold hover:bg-green-600 relative" onClick={() => blockUser(item.id)}>unblock</button>
                            )}
                            </td>
                        </tr>
                        ))}
                        
                    </MDBTableBody>
                </MDBTable>
            </CenteredTable>
        </MainContainer>
      </GridContainer>
    </Body>
  )
}

export default UsersList

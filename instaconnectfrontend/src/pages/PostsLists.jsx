import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import postsListApi from '../api/postsListApi'
import { BsFillBellFill,BsFillEnvelopeFill,BsPersonCircle,BsJustify,BsSearch } from 'react-icons/bs'
import AdminNavBar from '../components/AdminNavBar'
import {MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

import styled from 'styled-components'
import { toast } from 'react-toastify'

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

const PostsLists = () => {
    const [posts,setPosts] = useState([])
    const [postId,setPostId] = useState(null)
    const [showPostDetailModal,setShowPostDetailModal] = useState(false)

    useEffect(() =>{
        const fetchPosts = async () =>{
            try {
                const data = await postsListApi()
                setPosts(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchPosts()
    },[])

    const blockPost = async (id) =>{
        const accessToken = localStorage.getItem('access_token')
        try {
            const response = await fetch(`${BASE_URL}/blockpost/${id}/`,{
                method:'GET',
                headers:{
                    Accept:'application/json',
                    Authorization:`Bearer ${accessToken}`,
                }
            })
            console.log(response)
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === id ? {...post,is_blocked:!post.is_blocked}:post
                    )
            )
            toast.success('Blocked/Unblocked a Post',{
                position:'top-center'
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
                <h3>Posts List</h3>
            </MainTitle>
            <CenteredTable>
                <MDBTable align='middle'>
                    <MDBTableHead>
                        <tr>
                        <th scope='col'>Username</th>
                        <th scope='col'>Image</th>
                        <th scope='col'>Caption</th>
                        <th scope='col'>Created at</th>
                        <th scope='col'>Active</th>
                        <th scope='col'>Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {posts?.map((item) => (
                        <tr>
                            <td>
                                <p className='fw-bold mb-1'>{item.author.username}</p>

                            </td>
                            <td>
                              {console.log('image url here',item.img)}
                                <img
                                    src={`${BASE_URL}${item.img}`}
                                    alt={item.username}
                                    style={{ width: '140px', height: '100px' , borderRadius:'10%'}}
                                    
                                />
                            </td>
                            <td>
                                <p className='text-muted mb-0'>{item.body}</p>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{item.first_name} {item.last_name}</p>
                                <p className='text-muted mb-0'>{item.created_time} ago</p>
                            </td>
                            <td>
                                {item.is_blocked ? (
                                <span className="bg-danger text-white rounded-pill p-2 font-weight-bold">hide</span>
                                ):(
                                  <span className="bg-success text-white rounded-pill p-2 font-weight-bold">Active</span>
                                )}
                            </td>
                            <td>
                                {item.is_blocked ? (
                                <button className="bg-green-500 rounded-md p-2 text-white font-bold hover:bg-red-600 relative" onClick={() => blockPost(item.id)}>Unblock</button>
                                ):(
                                <button className="bg-red-500 rounded-md p-2 text-white font-bold hover:bg-green-600 relative" onClick={() => blockPost(item.id)}>Block</button>
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

export default PostsLists

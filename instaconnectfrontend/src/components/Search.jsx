import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import SearchApi from '../api/SearchApi';
import {MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { BASE_URL } from '../utils/constants';
import styled, { createGlobalStyle } from 'styled-components';
import { NavLink } from 'react-router-dom';
import PostDetailModal from './PostDetailModal';

const GlobalStyle = createGlobalStyle`
  .scrollbar {
    margin-left: 30px;
    float: left;
    height: 20px;
    width: 65px;
    background: #fff;
    overflow-y: scroll;
    margin-bottom: 25px;
  }
  
  .scrollbar-ripe-malinka {
    scrollbar-color: #f5576c #f5f5f5;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #f5f5f5;
    border-radius: 10px;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-image: -webkit-linear-gradient(330deg, #f093fb 0%, #f5576c 100%);
    background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
  }
`;

const CenteredTable = styled(MDBTable)`
  width: 80%;
  margin: 0 auto;
  margin-top:30px;
`;

const modalBodyStyle = {
  maxHeight: '650px',
};

const contentStyle = {
  maxHeight: '450px',
};

const StyledTableRow = styled.tr`
  border-width:0px;
  td {
    border-bottom: 0px none rgb(254, 254, 254);
    border-width:0;
    width:32%;
    &:hover {
      cursor: pointer;
      background-color: #EBEAEA !important;
    }
  }
`;
const Search = ({ isVisible, onClose }) => {

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchData , setSearchData] = useState([])
  const [postId,setPostId] =useState(null)
  const [showPostDetailModal,setShowPostDetailModal] = useState(false)

  const handleInputChange = async (e) => {
    const value = e.target.value
    setInputValue(value);

    try {
      const data = await SearchApi(value)
      setSearchData(data)
      const usersData = data?.user_data?.users
      const postsData = data?.post_data?.posts
      console.log('users:',usersData)
      console.log('posts:',postsData)
    } catch (error){
      console.error(error)
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleModalClose = () => {
    onClose();
  };

  const handleViewPost = (postId) =>{
    setPostId(postId)
    setShowPostDetailModal(true)
  }

  return (
    <div>
      <GlobalStyle />
      <Modal show={isVisible} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
        <PostDetailModal isVisible={showPostDetailModal} onClose={() =>setShowPostDetailModal(false)} postID={postId}/>
          <Form>
            <Form.Group className={`mb-3 ${isFocused ? 'focused' : ''}`} controlId="exampleForm.ControlInput1">
              <label htmlFor="searchInput" className="sr-only">
                Search
              </label>
              <div className={`search-input-container ${isFocused ? 'focused' : ''}`}>
                <Form.Control
                  type="text"
                  id="searchInput"
                  name='searchInput'
                  placeholder={isFocused ? '' : 'Search'}
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </Form.Group>
          </Form>
          {searchData ? 
          <div className="overflow-auto scrollbar-ripe-malinka" style={contentStyle}>
            <CenteredTable>
              <MDBTable align='middle' style={{ borderWidth: '0px',marginTop:'-10px' }}>
                <MDBTableBody>
                {searchData?.user_data?.users && searchData.user_data.users.length > 0 && (
                  <p style={{borderWidth:'0' ,fontWeight: 'bold' , marginBottom:'-10px'}} className='text-bold'>Users</p>
                  )}
                    {searchData?.user_data?.users?.map((item) => (
                    <StyledTableRow >
                      <NavLink to={`/profile/${item.email}`} style={{ textDecoration: 'none' }}>
                        <td>
                            <div className='d-flex align-items-center'>
                              <img
                                  src={item.display_pic ? `${BASE_URL}${item.display_pic}` : '../images/default_picture.png' }
                                  alt={item.username}
                                  style={{ width: '45px', height: '45px' }}
                                  className='rounded-circle'
                              />
                              <div className='ms-3'>
                                <p className='fw-bold mb-0'>{item.username}</p>                            
                                <p className='text-muted mb-1'>{item.first_name} {item.last_name}</p>
                              </div>
                            </div>
                        </td>
                      </NavLink>
                    </StyledTableRow>
                    ))}

                {searchData?.post_data?.posts && searchData.post_data.posts.length > 0 && (
                  <p style={{borderWidth:'0' ,fontWeight: 'bold' , marginBottom:'-10px'}} className='text-bold'>Posts</p>
                  )}
                    {searchData?.post_data?.posts?.map((item) => (
                    <StyledTableRow >
                      <NavLink key={item.id} onClick={() => handleViewPost(item.id)} style={{ textDecoration: 'none' }}>
                        <td>
                            <div className='d-flex align-items-center'>
                              <img
                                  src={item.img ? `${BASE_URL}${item.img}` : '../images/default_picture.png' }
                                  alt={item.username}
                                  style={{ width: '90px', height: '60px',borderRadius: '10px' }}
                                  className=''
                              />
                              <div className='ms-3'>
                                <p className='fw-bold mb-0'>{item.author.username}</p>                            
                                <p className='text-muted mb-1'>{item.body}</p>
                              </div>
                            </div>
                        </td>
                      </NavLink>
                    </StyledTableRow>
                    ))}
                  
                </MDBTableBody>
              </MDBTable>
            </CenteredTable>
          </div>:''
          
      }
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Search;

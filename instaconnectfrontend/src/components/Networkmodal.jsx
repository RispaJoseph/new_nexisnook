import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {Tab,initTE} from "tw-elements";
import {MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { BASE_URL } from '../utils/constants';
import styled, { createGlobalStyle } from 'styled-components';
import { NavLink, useNavigate ,Link } from 'react-router-dom';
import myNetworkApi from '../api/myNetworkApi';
import { useSelector } from 'react-redux';

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
  borderStyle:'none'
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

const Networkmodal = ({ isVisible, onClose }) => {

  initTE({ Tab })
  const [followers,setfollowers] =useState([])
  const [following,setfollowing] = useState([])
  const {user} = useSelector(state => state.user)
  const [activeTab, setActiveTab] = useState('following')

  const access_token = localStorage.getItem('access_token')
  useEffect(() => {
    console.log('before networkapi working')
    const fetchData = async () => {
      try {
        console.log('before networkapi working')
        const data = await myNetworkApi(access_token)
        console.log('after networkapi working')
        setfollowers(data.followers)
        setfollowing(data.following)
      } catch (error) {
        console.error(error)
      }
      
    }
    if (user) {
      fetchData()
    }
  },[user])

  if (!isVisible) return null

  const handleModalClose = (e) => {
    onClose()
  };


  return (
    <div>
      <GlobalStyle />
      <Modal show={isVisible} onHide={handleModalClose} closeButton>
        <Modal.Header closeButton>
          <Modal.Title>My Connections</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>  
          <div className="overflow-auto scrollbar-ripe-malinka" style={contentStyle}>
            <CenteredTable>
              <MDBTable align='middle' style={{ borderWidth: '0px',marginTop:'-35px' }}>
                <MDBTableBody>
                <ul
                  className="mb-2 flex list-none flex-row flex-wrap border-b-0 pl-0"
                  role="tablist"
                  data-te-nav-ref style={{ borderBottom: 'none' }}>
                  <li role="presentation" className={`flex-auto text-center ${activeTab === 'followers' ? 'active' : ''}`} onClick={() => setActiveTab('followers')}>
                    <Link
                      href="#tabs-profile01"
                      className=""
                      data-te-toggle="pill"
                      data-te-target="#tabs-profile01"
                      data-te-nav-active
                      role="tab"
                      aria-controls="tabs-profile01"
                      aria-selected="true"
                      style={{textDecoration:'none',borderBottom: 'none'}}><p style={{borderWidth:'0' ,fontWeight: 'bold' , marginBottom:'-10px' , color:'black' , textDecoration: activeTab === 'followers' ? 'underline' : 'none'}} className='text-bold'>Followers</p></Link>
                  </li>
                  <li role="presentation" className={`flex-auto text-center ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>
                    <Link
                      href="#tabs-home01"
                      className=""
                      data-te-toggle="pill"
                      data-te-target="#tabs-home01"
                      role="tab"
                      aria-controls="tabs-home01"
                      aria-selected="false"
                      style={{textDecoration:'none',borderBottom: 'none'}}><p style={{borderWidth:'0' ,fontWeight: 'bold' , marginBottom:'-10px' ,color:'black' , textDecoration: activeTab === 'following' ? 'underline' : 'none'}} className='text-bold'>Following</p></Link>
                  </li>
                  
                </ul>
                <div className="mb-6" style={{borderStyle:'none'}}>

                  <StyledTableRow className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" id="tabs-profile01" role="tabpanel" aria-labelledby="tabs-profile-tab01">
                    {following.length > 0 && following ? following.map((item) => (
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
                                <p className='fw-bold mb-0 text-black'>{item.username}</p>                            
                                <p className='text-muted mb-1'>{item.first_name} {item.last_name}</p>
                              </div>
                            </div>
                        </td>
                      </NavLink>
                    
                    )):(
                      <p>No followers</p>
                    )}
                  </StyledTableRow>

                  <StyledTableRow className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" id="tabs-home01" role="tabpanel" aria-labelledby="tabs-home-tab01" data-te-tab-active>
                    {followers.length > 0 && followers ? followers.map((item) => (
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
                                <p className='fw-bold mb-0 text-black'>{item.username}</p>                            
                                <p className='text-muted mb-1'>{item.first_name} {item.last_name}</p>
                              </div>
                            </div>
                        </td>
                      </NavLink>
                    
                    )):(
                      <p>No following</p>
                      
                    )}
                  </StyledTableRow>
                  
                </div>
                </MDBTableBody>
              </MDBTable>
            </CenteredTable>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Networkmodal;

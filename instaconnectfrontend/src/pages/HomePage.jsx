import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import postListApi from '../api/postListApi'
import { toast } from 'react-toastify';
import deletePostApi from '../api/deletePostApi'
import PostModal from '../components/PostModal';
import { BASE_URL } from '../utils/constants';
import { NavLink } from 'react-router-dom';
import DropdownOptions from '../components/DropdownOptions';
import PostDetailModal from '../components/PostDetailModal';
import Loading from '../components/Loading'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import likePostApi from '../api/likePostApi';
import ShareIcon from '@mui/icons-material/Share';
import reportPostApi from '../api/reportPostApi';
import Button from 'react-bootstrap/Button';
import followUserApi from '../api/followUserApi';
import createChatRoomApi from '../api/createChatRoomApi';


const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const NavContainer = styled.div`
  width: 16.5%;
  background-color: #faf7f4;
  position:fixed;
  top:0;
  bottom:0;
  border-right:double
`;

const ContentContainer = styled.div`
  width:100%;
  flex-direction:column;
  flex-grow: 1;
  padding: 20px;
  padding-left:16.5%;
  min-height:100%;
  height:fit-content;
  background-color:#faf7f4
`;

const SuggessionsContainer = styled.div`
  margin-top: 50px;
  margin-right: 20px;
`;

const SuggesstionsTitle = styled.div`
  color: grey;
  font-weight: bold;
`;

const UsernameLeft = styled.div`
  display: flex;
  align-items: center;
`;

const UsernameInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Relation = styled.span`
  color: grey;
  font-size: 12px;
`;

const SuggesstionUsername = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const FollowButton = styled.button`
  color: #0095f7;
  font-weight: bold;
  background: 0;
  border: 0;

  &:hover {
    color: #0a4064;
    cursor: pointer;
  }
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const initialUsersToDisplay = 4;

const HomePage = () => {

  const {user , loading , isAuthenticated } = useSelector(state =>state.user)
  const [posts,setPosts] = useState([])
  const [usersNotFollowing,setUsersNotFollowing] = useState([])
  const [showAllUsers,setShowAllUsers] = useState(false)
  const [postId,setPostId] = useState(null)
  const [showPostModal,setShowPostModal] = useState(false)
  const [showPostDetailModal,setShowPostDetailModal] = useState(false)
  const [initialCaption, setInitialCaption] = useState('');
  const [initialImage, setInitialImage] = useState(null);

  const access_token = localStorage.getItem('access_token')
  useEffect(() =>{
    const fetchData = async () => {
      try {
        console.log('user details',access_token)
        const data = await postListApi(access_token)
        setPosts(data.posts)
        setUsersNotFollowing(data.users_not_following)
        console.log('posts inside home page useEffect',data)
      } catch (error) {
        console.error(error)
      }
    }

    if (user && !loading) {
      fetchData()
    }
  }, [user,loading])

  const fetchData = async () =>{
    try {
      const data =await postListApi(access_token)
      setPosts(data.posts);
      setUsersNotFollowing(data.users_not_following);
      console.log('Posts inside home page fetchData', data)
    } catch (error) {
      console.error(error)
    }
  }

  const toggleShowAllUsers = () => {
    setShowAllUsers(!showAllUsers)
  }

  const handleDeletePost = async (postId) =>{
    try {
      await deletePostApi(postId,fetchData)
      toast.success('Post Deleted Successfully.',{
        position:'top-center',
      })
    } catch (error) {
      toast.error('Post Not Deleted.',{
        position:'top-center',
      })
    }
  }

  const handleUpdatePost = (postId) =>{
    setPostId(postId)

    const postToUpdate = posts.find((post) => post.id === postId)
    if (postToUpdate) {
      setInitialCaption(postToUpdate.body)
      setInitialImage(postToUpdate.img)
    }
    setShowPostModal(true)
  }

  const handleReportPost = async (postId) => {
    try {
      await reportPostApi(postId,fetchData)
      toast.success('Post Reported successfully',{
        position:'top-center'
      })

    } catch (err) {
      toast.error('Failure, post not Reported!',{
        position:'top-center'
      })
    }
  };

  const updateCaption = (postId, newCaption) => {
    console.log('Updating caption:', postId, newCaption);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, body: newCaption } : post
      )
    );
  };
  
  const updatePostList = async () => {
    try {
      console.log('updatepostlist is working')
      const data = await postListApi(access_token);
      setPosts((prevPosts) => [data.newPost, ...prevPosts]); // Add the new post at the beginning
      setUsersNotFollowing(data.users_not_following);
      console.log('Posts inside home page updatePostList', data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLikePost = async (postId) => {
    try {
      await likePostApi(postId,fetchData)
    } catch (error) {
      toast.err('Failure , Post not Liked!',{
        position:'top-center',
      })
    }
  };

  const handleToggleFollow = async (userId) =>{
    try {
        await followUserApi(userId,fetchData)
        await createChatRoomApi(userId)

        setUsersNotFollowing((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
    } catch (error) {
        toast.error('Cannot follow user',{
            position:'top-center'
        })
    }
  }

  if(!isAuthenticated && !loading && user === null){
    return <Navigate to='/' />
  }

  const closePostModal = () =>{
    setShowPostModal(false)
    setShowPostDetailModal(false)
  }

  const showPostDetail = (postId) =>{
    setPostId(postId)
    setShowPostDetailModal(true)
  }

  return (
    <PageContainer>
      <NavContainer>
        <NavBar />
      </NavContainer>
      {loading?(
          <Loading />
        ):(
      <ContentContainer>
        <PostModal isVisible={showPostModal} onClose={closePostModal} postID={postId} initialCaption={initialCaption} initialImage={initialImage} updateCaption={updateCaption} updatePostList={updatePostList}/>
        <PostDetailModal isVisible={showPostDetailModal} onClose={closePostModal} postID={postId} />
        <div style={{display:'flex'}} >
          <div className="mt-10 w-9/12">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
            <div key={post.id} className="block rounded-lg w-11/12 lg:w-4/6 min-w-min mx-auto mt-3 gap-4 p-2 text-[#252525] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white">
              <div
                className="overflow-hidden bg-cover bg-no-repeat"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                <div className="flex justify-between items-center border-b-2  border-gray-100">
                  <div className="flex items-center ">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={`${BASE_URL}${post.author.display_pic}`}
                      alt="user_image"
                    />
                    <NavLink to={`/profile/${post.author.email}`} className="mb-2 mr-3 ms-2 mt-2 text-md font-bold cursor-pointer leading-tight text-[#262626] text-decoration-none" >
                      {post.author.username}
                    </NavLink>
                    {post.author.email !== user.email &&
                      (post.followers && post.followers.some(
                        (follower) => follower.follower === user.email
                      ) ? (
                      <Button type='button'
                      variant='outline-secondary'
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      title={`unfollow ${post.author.username}`}
                      onClick={() => handleToggleFollow(post.author.id)}
                      >
                        Unfollow
                      </Button>
                      ):(
                      <Button type='button'
                      variant='outline-primary'
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      title={`follow ${post.author.username}`}
                      onClick={() => handleToggleFollow(post.author.id)}
                      >
                        Follow
                      </Button>
                      ))}
                      <span className='font-xs font-mono font-extralight ml-2 text-sm text-gray-400'> {post.created_time} ago</span>
                    
                    
                  </div>
                  <DropdownOptions post={post} handleDeletePost={handleDeletePost} handleUpdatePost={handleUpdatePost} handleReportPost={handleReportPost} />
                </div>
                <div className='border-b-2  border-gray-100'>
                  <img
                    className="rounded-lg mx-auto my-3 h-96 border-2"
                    src={`${BASE_URL}${post.img}`}
                    alt="post_image"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-row gap-4">
                {post.likes.includes(user.id)?(
                  <button
                  className='inline-block p-0 text-xs font-medium leading-normal'
                  type='button'
                  data-te-ripple-init
                  data-te-ripple-color='light'
                  onClick={()=>{toggleLikePost(post.id, true)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28"><path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" style={{ fill: 'red' }}/></svg>

                  </button>
                ):(
                  <button
                  className='inline-block p-0 text-xs font-medium leading-normal'
                  type='button'
                  data-te-ripple-init
                  data-te-ripple-color='light'
                  onClick={()=>{toggleLikePost(post.id, true)}}>
                    <span className="material-symbols-outlined" ><FavoriteBorderIcon /></span>
                  </button>
                )}
                <button
                  className='inline-block p-0 text-xs font-medium leading-normal'
                  type='button'
                  data-te-ripple-init
                  data-te-ripple-color='light'
                  onClick={()=>{showPostDetail(post.id)}}>
                    <span className="material-symbols-outlined"><ChatBubbleOutlineIcon /></span>
                  </button>
                  <span className="material-symbols-outlined"><ShareIcon /></span>

                </div>
                <p>{post.likes_count ?? 0}&nbsp;likes</p>
                <div>
                  <p className="text-left  font-normal mb-4 text-md">
                    <span className="inline mr-2 font-semibold">{post.author.username}</span>{post.body}
                  </p>
                </div>
              </div>
            </div>
            ))
            ) : (
              <h4 className="flex justify-center items-center">Nothing to show here..!</h4>
            )}
        </div>
        <SuggessionsContainer className='suggessions w-3/9'>
          
          <SuggesstionsTitle className="suggesstions__title">Suggesstions for you</SuggesstionsTitle>
          <div className="suggesstions_usernames">
            {usersNotFollowing ? showAllUsers ? usersNotFollowing.map((users) =>(
              <SuggesstionUsername className="suggesstion__username" key={users.id}>
                  <UsernameLeft className="username__left">
                      <span className="avatar">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={`${BASE_URL}${users.display_pic}`}
                          alt="user_image"
                        />
                      </span>
                      <UsernameInfo className="username__info m-2">
                          <Username className='username'>
                            <NavLink className='font-bold cursor-pointer leading-tight text-[#262626] text-decoration-none' to={`/profile/${users.email}`}>
                              {users.username}
                            </NavLink>
                          </Username>
                          <Relation className='relation'>New to NexisNook</Relation>
                      </UsernameInfo>
                  </UsernameLeft>
                  {users.email !== user.email &&
                    (users.followers && users.followers.some(
                      (follower) => follower.follower === user.email
                    ) ? (
                          <FollowButton className="follow__button" title={`Unfollow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Unfollow</FollowButton>
                        ):(
                          <FollowButton className="follow__button" title={`Follow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Follow</FollowButton>
                  ))}
              </SuggesstionUsername>
            )): usersNotFollowing.slice(0, initialUsersToDisplay).map((users) => (
              <SuggesstionUsername className="suggesstion__username" key={users.id}>
                  <UsernameLeft className="username__left">
                      <span className="avatar">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={`${BASE_URL}${users.display_pic}`}
                          alt="user_image"
                        />
                      </span>
                      <UsernameInfo className="username__info m-2">
                          <Username className='username'>
                            <NavLink className='font-bold cursor-pointer leading-tight text-[#262626] text-decoration-none' to={`/profile/${users.email}`}>
                              {users.username}
                            </NavLink>
                          </Username>
                          <Relation className='relation'>New to NexisNook</Relation>
                      </UsernameInfo>
                  </UsernameLeft>
                  {users.email !== user.email &&
                    (users.followers && users.followers.some(
                      (follower) => follower.follower === user.email
                    ) ? (
                          <FollowButton className="follow__button" title={`Unfollow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Unfollow</FollowButton>
                        ):(
                          <FollowButton className="follow__button" title={`Follow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Follow</FollowButton>
                  ))}
              </SuggesstionUsername>
            ))
            :(
              <SuggesstionUsername className="suggesstion__username">
                  {/* Render the first user here */}
              </SuggesstionUsername>
              )}
          </div>
          
          {usersNotFollowing && usersNotFollowing.length > initialUsersToDisplay && (
              <button className='font-bold cursor-pointer' style={{ color: 'gray' }} onClick={toggleShowAllUsers}>
                {showAllUsers ? 'Show Less' : 'Show More'}
              </button>
          )}
        </SuggessionsContainer>
      </div>
      </ContentContainer>
      )}
    </PageContainer>
  );
}

export default HomePage

import React, { useEffect, useState } from 'react'
import {BsFillBellFill,BsFillEnvelopeFill,BsPersonCircle,BsSearch,BsJustify} from 'react-icons/bs'
import {BsPeopleFill,BsListCheck,BsMenuButtonWideFill } from 'react-icons/bs'
import { BarChart, Bar,LineChart,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminNavBar from '../components/AdminNavBar';
import styled from 'styled-components';
import userListApi from '../api/userListApi';
import postsListApi from '../api/postsListApi';
import reportedPostsListApi from '../api/reportedPostsListApi';
import { useSelector } from 'react-redux';

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

export const MainCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin: 35px 0px 55px 0;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 8px 15px;
  border-radius: 5px;
`;

export const FirstCard = styled(Card)`
  background-color: #2962ff;
`;

export const SecondCard = styled(Card)`
  background-color: #ff6d00;
`;

export const ThirdCard = styled(Card)`
  background-color: #d50000;
`;

export const CardInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardIcon = styled.div`
  font-size: 25px;
`;

export const Charts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 90px;
  height: 300px;
`;

export const BodyMedium = styled(Body)`
  @media screen and (max-width: 992px) {
    ${GridContainer} {
      grid-template-columns: 1fr;
      grid-template-rows: 0.2fr 3fr;
      grid-template-areas: 'header' 'main';
    }

    #sidebar {
      display: none;
    }

    ${MenuIcon} {
      display: inline;
    }

    .sidebar-title > span {
      display: inline;
    }
  }
`;

export const BodySmall = styled(BodyMedium)`
  @media screen and (max-width: 768px) {
    .main-cards {
      grid-template-columns: 1fr;
      gap: 10px;
      margin-bottom: 0;
    }

    .charts {
      grid-template-columns: 1fr;
      margin-top: 30px;
    }
  }
`;

export const BodyExtraSmall = styled(BodySmall)`
  @media screen and (max-width: 576px) {
    .header-left {
      display: none;
    }
  }
`;


const AdminDashboard = () => {
    const [totalUsers,setTotalUsers] = useState([])
    const [totalPosts,setTotalPosts] = useState([])
    const [totalReportedPosts,setTotalReportedPosts] = useState([])
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {user , loading , isAuthenticated ,isSuperuser } = useSelector(state =>state.user)

    useEffect(() => {
      const fetchDetails = async () => {
        try {
          const users = await userListApi();
          setTotalUsers(users);

          const posts = await postsListApi();
          setTotalPosts(posts);

          const reportedPosts = await reportedPostsListApi();
          setTotalReportedPosts(reportedPosts);

          console.log('Users:', users);
          console.log('Posts:', posts);
          console.log('Reported Posts:', reportedPosts);
          console.log('superuser:',user,'isAuthenticated:',isAuthenticated,'isSuperuser:',isSuperuser)
          
          setChartData([
            { name: 'Total Users', value: users.length },
            { name: 'Total Posts', value: posts.length },
            { name: 'Total Reported Posts', value: reportedPosts.length },
          ]);

          setIsLoading(false)

        } catch (error) {
          console.log('catch is working')
          console.error(error);
          setIsLoading(false)
        }
      };
    
      fetchDetails()
    }, []);


    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];

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
            <h3>DASHBOARD</h3>
          </MainTitle>
          <MainCards className="main-cards">
            <FirstCard className="card">
              <CardInner className="card-inner">
                <h3>POSTS</h3>
                <CardIcon>
                  <BsListCheck className='card_icon' />
                </CardIcon>
              </CardInner>
              <h1>{totalPosts?.length || 0}</h1>
            </FirstCard>
            <SecondCard className="card">
              <CardInner className="card-inner">
                <h3>USERS</h3>
                <CardIcon>
                  <BsPeopleFill className='card_icon' />
                </CardIcon>
              </CardInner>
              <h1>{totalUsers?.length || 0}</h1>
            </SecondCard>
            <ThirdCard className="card">
              <CardInner className="card-inner">
                <h3>REPORTS</h3>
                <CardIcon>
                  <BsMenuButtonWideFill className='card_icon' />
                </CardIcon>
              </CardInner>
              <h1>{totalReportedPosts?.length || 0}</h1>
            </ThirdCard>
          </MainCards>
          <Charts className="charts">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
                {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
            </LineChart>
            </ResponsiveContainer>
          </Charts>
        </MainContainer>
      </GridContainer>
    </Body>
  )
}

export default AdminDashboard

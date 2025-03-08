import react , {useContext , useState ,useEffect} from 'react'
import './App.css'
import './App2.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MyIcon from './assets/user.svg'
import MyHome from './assets/home.svg'
import MyMenu from './assets/menu.svg'
import { BrowserRouter as Router, Route, Routes, Navigate,useLocation  } from 'react-router-dom'
import { useNavigate} from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import Analyze from './analyze';
import AnalyzePython from './analyzePython.jsx'
import Exercise from './exercise';
import History from './history';
import ProfileA from './proaddminview.jsx'
import Home from './home';
import { ModelProvider } from './ModelContext';
import {Profile,Popup} from './profile.jsx';
import Footer from './footer';
import Excercise2 from './excercise2'
import { Login } from './login';
import Signup from './signup';
import ReactDOM from 'react-dom';
import Dash from './dash';
import Changelocation from './changelocation';
import Uploadtext from './uploadtext.jsx';
import Notfound from './notfound.jsx';
import PoseEstimatorWithWebcam from './PoseEstimator.jsx';
import {ReverseFlys,Re3,SuperManHold,PoseEstimatorWithWebcam2,PoseEstimatorWithWebcam3,PoseEstimatorWithWebcam4,PoseEstimatorWithWebcam5,PoseDataTrainer} from './PoseEstimator2.jsx';
import {UpData,TfjsClassifier,PoseModelTraining,PoseDataTransformer,PoseModel,Test,Test_sign,Register,UserProfile,LoginTest,LoginPage,YoloComponent,VideoFrameExtractor,CsvReader} from './test.jsx';
import {TrainModel,UseModel,PoseDetectionComponent,PoseDetectionComponent2,Train2,PoseCSVInput,PoseEstimationWithPrediction} from './Train.jsx';
import { AuthContext } from './AuthContext';
import {useUser} from './context/UserContext.jsx';
import Blackpage from './blackpage.jsx'
import { UserProvider } from './context/UserContext.jsx';
import axios from 'axios';
import { Button, Menu, MenuItem } from '@mui/material';
// import './index.css'
function App() {

  const ip = '192.168.1.196'
  const username = localStorage.getItem('username')
  const id = localStorage.getItem('userid')
  const token = localStorage.getItem('token')
  // const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [imageUser,setImageUser] = useState(MyIcon)
  const [usernameS,setUsernameS]  = useState()
  const [userRole,setUserRole]  = useState()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    const userId = localStorage.getItem('userid');
    console.log(userId)
    if (userId){
      setLoading2(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userid');
  useNavigate('/home');
};
  const MeClick =()=>{
    var element = document.getElementById('menuBa');
    if (element.style.display === 'none' || element.style.display === '') {
        element.style.display = 'block'; // Show the element
    } else {
        element.style.display = 'none'; // Hide the element
    }
  }
useEffect(() => {
  const getImage = async () => {
    const userId = localStorage.getItem('userid');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      setLoading(true);
      return;
    }
    try {
      const response = await axios.get(`https://${ip}:5000/images/${userId}`);
      setImageUser(`https://${ip}:5000/${response.data.imagePath}`);
      console.log(`https://${ip}:5000/${response.data.imagePath}`)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  getImage();
}, []);
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://${ip}:5000/user/${id}`); 
      setUsernameS(response.data.user.username)
      console.log(response.data.user.username);
      setUserRole(response.data.user.role)
    } catch (error) {
        console.error('Error fetching data:', error);
        setUsernameS('ยินดีต้อนรับ')
      }
    };
   fetchData();
}, []);
  console.log(window.location.href)
  return (
    <ModelProvider >
    <Router >
      <Navbar className='navnha' >
        <Container className='navCon' >
          <Navbar.Brand href="/" className='Ifontmain' style={{'color':'white'}}>
            <div>Bye</div>
            hunchback
            
          </Navbar.Brand>
          <Navbar.Text>
            <div className='MenuMoCon'>
              <div className='MeMo'>            
                  <a href='/home'><img src={MyHome} alt="My Icon" width={30} height={30} style={{"paddingBottom":'0px'}} /></a>
                <a href="/" style={{'fontSize':'10px','textDecoration':'none','color':'white'}}>Home </a>         
              </div>
              <div className='MeMo'>
                  <a onClick={MeClick}>
                  <img src={MyMenu} alt="My Icon" width={30} height={30} style={{"paddingBottom":'0px'}} /></a>
                  <a onClick={MeClick} style={{'fontSize':'10px','textDecoration':'none','color':'white'}}>Menu </a>
              </div>
            </div>

          </Navbar.Text>
          <Nav className="Ifont" >
            <Nav.Link href="/home" className="Ifontsub text-3xl shadow-white shadow-lg"> หน้าหลัก</Nav.Link>
            <Nav.Link href="/analyze" className="Ifontsub text-3xl shadow-white shadow-lg">วิเคราะห์</Nav.Link>
            <Nav.Link href="/excercise" className="Ifontsub text-3xl shadow-white shadow-lg">กายบริหาร</Nav.Link>
            <Nav.Link href="/history" className="Ifontsub text-3xl shadow-white shadow-lg">ประวัติ</Nav.Link>
          </Nav>
          
          <Navbar.Collapse className="flex justify-content-end">
            {/* <div className='myNavDev'><img src={MyHome} width={30} height={30} className='myNavDev' /></div> */}
            <div className=' flex items-center justify-center md:text-4xl space-x-4'>
              <a href="/login" className='Login text-[20px] md:text-3xl text-white'>
              {/* {username ? <p>{username}</p> : <img src={MyIcon} alt="My Icon" width={50} height={50} style={{"paddingBottom":'0px'}}></img>}  */}
              {usernameS}
              </a>
              {/* {username}  */}
              {/* <Button onClick={handleClick}>Menu</Button> */}

              <button onClick={handleClick}>
                <div className='w-14 aspect-square overflow-hidden'>
                  <img 
                      className="rounded-full object-cover w-full h-full" 
                      src={imageUser} 
                      alt={`Profile of ${usernameS}`}
                    />
                </div>
              </button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    width: 'full',
                    marginTop:'20px',
                  },
                }}
              >
                {loading2 ?
              (userRole === 'admin' ? (
                <>
                  <MenuItem ><a href={`https://${ip}:5173/profile`}>โปรไฟล์</a></MenuItem>
                  <MenuItem>
                  <a href="/dash">กระดานข้อมูล</a>
                  </MenuItem>
                  <MenuItem>
                  <a href="/upload">เพิ่มคำต้องห้าม</a>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                  <a href="/home">ออกจากระบบ</a>
                  </MenuItem>
                </>
                ):
                (
                  <>
                <MenuItem ><a href={`https://${ip}:5173/profile`}>โปรไฟล์</a></MenuItem>
                <MenuItem onClick={handleLogout}>
                  <a href="/home">ออกจากระบบ</a>
                  </MenuItem>
                  </>
                )
              ):
                (<MenuItem>
                <a href={`https://${ip}:5173/login`}>เข้าสู่ระบบ</a>
                </MenuItem>)}
                </Menu>
            </div>
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='MeMoMe' id='menuBa'>
        <div className='MenuTexa'>
          {/* <p>{`${loading}`}</p> */}
          {(userRole === 'admin' ?(
            <>
            <a href='/home'><li>หน้าหลัก</li></a>
            <a href="/excercise"><li>ออกกำลังกาย</li></a>
            <a href='/analyze'><li>วิเคราะห์อาการ</li></a>
            <a href='/history'><li>ประวัติการใช้งาน</li></a>
            {/* <a href='/changelo'><li>Changelocation</li></a>
            <a href='/upload'><li>addtext</li></a>
            <a href='/dash'><li>Dash</li></a> */}
            </>
          ):(
            <>
            <a href='/home'><li>หน้าหลัก</li></a>
            <a href="/excercise"><li>ออกกำลังกาย</li></a>
            <a href='/analyze'><li>วิเคราะห์อาการ</li></a>
            <a href='/history'><li>ประวัติการใช้งาน</li></a>
            </>
          ))}

        </div>
      </div>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/analyze" element={<PrivateRoute element={Analyze} />} />
        <Route path="/analyzePy" element={<PrivateRoute element={AnalyzePython} />} />
        <Route path="/history" element={<PrivateRoute  element={History} />} />
        <Route path="/excercise" element={< PrivateRoute element={Exercise} />} />
        <Route path="/profile" element={< PrivateRoute element={Profile}/>} />
        <Route path="/profile/:userId" element={< PrivateRoute element={ProfileA} />} />
        <Route path="/excercise2" element={<Excercise2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/changelo" element={<PrivateRoute element={Changelocation} requiredRole="admin"/>} />
        <Route path="/upload" element={<PrivateRoute element={Uploadtext}  requiredRole="admin"/>} />
        <Route path="/dash" element={<PrivateRoute element={Dash} requiredRole="admin" />} />

        <Route path="/PPcam" element={<PoseEstimatorWithWebcam />} />
        <Route path="/PPcam2" element={<PoseEstimatorWithWebcam2 />} />
        <Route path="/PPcam3" element={<PoseEstimatorWithWebcam3 />} />
        <Route path="/PPcam4" element={<PoseEstimatorWithWebcam4 />} />
        <Route path="/PPcam5" element={<PoseEstimatorWithWebcam5 />} />
        <Route path="/PPcam6" element={<ReverseFlys />} />
        <Route path="/PPcam7" element={<SuperManHold />} />
        <Route path="/TrainModel" element={<TrainModel />} />
        <Route path="/tm" element={<PoseModel />} />
        <Route path="/resut" element={<PoseDataTransformer />} />
        <Route path="/PoseTrain" element={<PoseModelTraining />} />
        <Route path="/UseModel" element={<UseModel />} />
        <Route path="/PoseDetection" element={<PoseDetectionComponent />} />
        <Route path="/PoseDetection2" element={<PoseDetectionComponent2 />} />
        <Route path="/PoseDetection3" element={<Train2 />} />
        <Route path="/PoseDetection4" element={<PoseCSVInput />} />
        <Route path="/PoseDetection5" element={<PoseEstimationWithPrediction />} />
        <Route path="/brang" element={<Blackpage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test-sign" element={<Test_sign />} />
        <Route path="/regis-test" element={<Register />} />
        <Route path="/pro/:userId" element={<UserProfile />} />
        <Route path="/logt" element={<LoginTest />} />
        <Route path="/logt2" element={<LoginPage />} />
        <Route path="/TSF" element={<YoloComponent />} />
        <Route path="/Sprit" element={<VideoFrameExtractor />} />
        <Route path="/testTrain" element={<PoseDataTrainer />} />
        <Route path="/newExercise" element={<UpData />} />
        <Route path="/recsv" element={<CsvReader />} />
        <Route path="/recsv2" element={<TfjsClassifier />} />
        <Route path="/recsv3" element={<Re3 />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
    {window.location.href == `https://${ip}:5173/PPcam2` || window.location.href == `https://${ip}:5173/PPcam`||window.location.href == `https://${ip}:5173/PPcam3`|| window.location.href == `https://${ip}:5173/PPcam4`? null: <Footer />}
    
    </ModelProvider>
  )
}

export default App

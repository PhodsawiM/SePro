import { useState } from 'react'
import './App.css'
import './App2.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MyIcon from './assets/user.svg'
import MyHome from './assets/home.svg'
import MyMenu from './assets/menu.svg'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Analyze from './analyze';
import Exercise from './exercise';
import History from './history';
import Home from './home';
import Footer from './footer';
import Excercise2 from './excercise2'
import { Login } from './login';
import Signup from './signup';
import Dash from './dash';
import Changelocation from './changelocation';
import Uploadtext from './uploadtext.jsx';
import Notfound from './notfound.jsx';
function App() {
  // const dasda = ()=>{
  //   useNavigate('/home')
  // }
  const MeClick =()=>{
    var element = document.getElementById('menuBa');
    if (element.style.display === 'none' || element.style.display === '') {
        element.style.display = 'block'; // Show the element
    } else {
        element.style.display = 'none'; // Hide the element
    }
  }
  return (
    <div>
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
            <Nav.Link href="/home" className="Ifontsub"> Home</Nav.Link>
            <Nav.Link href="/excercise" className="Ifontsub">Excercise</Nav.Link>
            <Nav.Link href="/analyze" className="Ifontsub">Analyze</Nav.Link>
            <Nav.Link href="/history" className="Ifontsub">History</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <div className='myNavDev'><img src={MyMenu} width={30} height={30} className='myNavDev' /></div>
            <div className='ConAli'>
              <a href="/login" className='Login' style={{'color':'white'}}>Login: </a>
              <img src={MyIcon} alt="My Icon" width={50} height={50} style={{"paddingBottom":'0px'}} />
            </div>
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='MeMoMe' id='menuBa'>
        <div className='MenuTexa'>
          <a href='/home'><li>Home</li></a>
          <a href="/excercise"><li>Exsercise</li></a>
          <a href='/analyze'><li>Analyze</li></a>
          <a href='/history'><li>History</li></a>
          <a href='admin/changelocation'><li>Changelocation</li></a>
          <a href='admin/addtext'><li>addtext</li></a>
          <a href='admin/changelocation'><li>changelocation</li></a>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/history" element={<History />} />
        <Route path="/excercise" element={<Exercise />} />
        <Route path="/excercise" element={<Excercise2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/changelo" element={<Changelocation />} />
        <Route path="/upload" element={<Uploadtext />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
    <Footer />
    </div>
  )
}

export default App

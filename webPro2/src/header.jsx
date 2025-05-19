import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MyIcon from './assets/user.svg'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Analyze from './analyze';
import Exercise from './exercise';
import History from './history';
import { GlobalContext } from "./context/GlobalContext";
const { ip, setGlobalVariable } = useContext(GlobalContext);
function Header() {
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
            Bye hunchback
            
          </Navbar.Brand>
          <Nav className="me-auto" style={{'fontSize':'10px'}}>
            <Nav.Link href="/home" >หน้าหลัก</Nav.Link>
            <Nav.Link href="/analyze" >วิเคราะห์อาการ</Nav.Link>
            <Nav.Link href="/history" >ประวัติการใช้งาน</Nav.Link>
            <Nav.Link href="/excercise" >ออกกำลังกาย</Nav.Link>
          </Nav>
          <Navbar.Collapse className="flex justify-end">
          <Navbar.Text>
            <a href="/login">เข้าสู่ระบบ: </a><img src={MyIcon} alt="My Icon" width={40} height={40} />
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  )
}

export default Header

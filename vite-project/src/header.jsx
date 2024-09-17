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
function Header() {
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
            Bye hunchback
            
          </Navbar.Brand>
          <Nav className="me-auto" style={{'fontSize':'10px'}}>
            <Nav.Link href="/home" >Home</Nav.Link>
            <Nav.Link href="/analyze" >Analyze</Nav.Link>
            <Nav.Link href="/history" >History</Nav.Link>
            <Nav.Link href="/excercise" >Excercise</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <a href="/login">Login: </a><img src={MyIcon} alt="My Icon" width={40} height={40} />
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  )
}

export default Header

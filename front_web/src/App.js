import React, { Component, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Spotify from './services/spotify';

const Popup = props => {
  return (
    <div className='popup-box'>
      <div className='box'>
        <span className='close-icon' onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
}

function App() {

  const [isOpen, setIsOpen] = useState(false);
  const errors = {
    username: "inavalid username",
    email: "invalid email",
    password: "invalid password"
  }

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const handlepopup = () => {
    { isOpen && <Popup content={<><p>logged Succesfully</p></>} handleClose={togglePopup} /> }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/spotify' element={<Spotify/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function Home() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const [errorMessages, setErrorMessages] = useState({});

  const renderErrorMessage = (name) => {
    name === errorMessages.name && (
      <div className='error'>{errorMessages.message}</div>
    );
  }

  const handlesubmit = (e) => {

    //if (username.length < 5) {
    //  setErrorMessages({
    //    name: username.name,
    //    message: errors.username
    //  });
    //} else if (email.length < 5) {
    //  setErrorMessages({
    //    name: email.name,
    //    message: errors.email
    //  });
    //} else if (password.length < 5) {
    //  setErrorMessages({
    //    name: password.name,
    //    message: errors.password
    //  });
    //} else {
    //  console.log(username, email, password);
    //  fetch('http://localhost:3000/', {
    //    method: 'POST',
    //    body: {
    //      username: username,
    //      email: email,
    //      password: password
    //    }
    //  }).then((res) => { return res.json() }).then((data) => { console.log(data) });
    //  togglePopup()
    //  handlepopup()
    //}
    navigate('/spotify');
  }

  const connect_spotify = () => {
    window.location.href = "http://localhost:3000/spotify/auth"
  }

  return (
    <div className='login-form'>
        <div className='input-container'>
          <label className='label'>Username</label>
          <input type='text' name="username" onChange={(e) => setUsername(e.target.value)} required />
          {renderErrorMessage("username")}
        </div>
        <div className='input-container'>
          <label className='label'>Mail</label>
          <input type='text' name="mail" onChange={(e) => setEmail(e.target.value)} required />
          {renderErrorMessage("mail")}
        </div>
        <div className='input-container'>
          <label className='label'>Password</label>
          <input type='password' name="Password" onChange={(e) => setPassword(e.target.value)} required />
          {renderErrorMessage("password")}
        </div>
        <div className='button-container'>
          <button className='button-login' onClick={() => handlesubmit()} >Se connecter</button>
        </div>
        <div className='button-container'>
          <button className='button-register' onClick={() => connect_spotify()}>connect with spotify</button>
        </div>
      </div>
  );
}
export default App;

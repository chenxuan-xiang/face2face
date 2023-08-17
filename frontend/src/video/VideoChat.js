import './VideoChat.css';
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notification from './components/Notification';
import { ContextProvider } from './SocketContext';
import End from '../pages/End';

const VideoChat = () => {


  return (
    <ContextProvider>
    <div className='background'>
        <div className='contain'>
            <Navbar.Brand style={{fontSize:"2em"}}>Video Chat</Navbar.Brand>
            <Nav.Link className="navitem" href="/" >Home</Nav.Link>
        </div>
        <VideoPlayer/>
        <Options>
        <Notification></Notification>
        </Options>

    </div>   

    
    </ContextProvider>

    
  );
}

export default VideoChat;
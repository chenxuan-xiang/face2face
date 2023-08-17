import './VideoPlayer.css';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../SocketContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


const VideoPlayer = () => {
const[width, setWidth] = useState(600); // We will scale the photo width to this
const[height, setHeight] = useState(0); // This will be computed based on the input stream
const {name, callAccepted, myVideo, userVideo, callEnded, stream, call} = useContext(SocketContext);
 useEffect(()=>{
    setHeight(myVideo.current.videoHeight / (myVideo.current.videoWidth/width));
 },[])

return (
    <>
        {/* {stream && ( */}
        <Container>
        <Row>
            <Col xs={12} md={6}>
                <Card.Header className="head" as="h4">{name || 'Name'}</Card.Header>
                <video playsInline muted ref={myVideo} 
                width={width}
                height={height}
                autoPlay className='video'/>
            </Col>
        {callAccepted && !callEnded && (
            <Col xs={12} md={6}>
                <Card.Header className="head" as="h4">{name || 'Name'}</Card.Header>
                <video playsInline ref={userVideo} 
                width={width}
                height={height}
                autoPlay className='video'/>
            </Col>
        )}
        </Row>
        </Container>
    </>

  );
}

export default VideoPlayer;
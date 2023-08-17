import './Options.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useContext, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SocketContext } from '../SocketContext';


const Options = ( {children} ) => {
  const {me, callAccepted, name, setName, callEnded, leaveCall, callUser} = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    

  return (

   <div className='root'> 
    <Row>
      <Col className='form'>
        <p className='typo'>Your Name</p>
        <input className="inputblock" 
          placeholder='input your name'
          type='text' 
          value={name} 
          onChange={(e) => {setName(e.target.value)}}>
        </input>
        <CopyToClipboard text={me}>
          <button className='button'>
            copy your id
          </button>
        </CopyToClipboard>
      </Col>

      
      <Col className='form'>
            <p className='typo'>Make a call</p>
            <input className="inputblock" type='text' placeholder='input others Id' value={idToCall} onChange={(e) => {setIdToCall(e.target.value)}}></input>
            {callAccepted && !callEnded ? (
              <button className='button' onClick={()=>{leaveCall()}}>Hang up</button>
            ) : (
              <button className='button' onClick={()=>{callUser(idToCall)}}>Call</button>
            )}
      </Col>
    </Row>
    <Row>
      {children}
    </Row>
  </div>
  );
}

export default Options;
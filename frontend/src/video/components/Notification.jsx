import React, { useContext } from 'react';
import { SocketContext } from '../SocketContext';
import { Button } from 'react-bootstrap';
import './Notification.css';
const Notification = () => {

  const {answerCall, call, callAccepted} = useContext(SocketContext);

  return (
    <div> 
      {call?.isReceivedCall && !callAccepted && (
        <div>
          <div className='notification'>{call.name} is calling!</div>
          <button className='button_answer' onClick={answerCall}>
            Answer
          </button>
        </div>
      )}
    </div>
  );
}

export default Notification;
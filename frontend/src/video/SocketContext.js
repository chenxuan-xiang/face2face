import React, {createContext, useEffect, useState, useRef} from 'react';
import  {io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// const socket = io('http://localhost:5000');

const ContextProvider = ({children}) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState("");
    const [name, setName] = useState("");
    const [call, setCall] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [socket, setSocket] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
        });

        //在函数里面声明可以防止项目一开始就socket连接，在函数外声明则即使不在这个页面也会去连接
        // const socket = io("http://localhost:5000");   
        const socket = io("https://face2face-523102cac868.herokuapp.com/");   
       
        setSocket(socket);

        socket.on('me', (id) => setMe(id)); //server return socket id 

        socket.on('calluser', ({from, name: callerName, signal}) => {  //when being called
            console.log("RECEIVED CALL");
            setCall({ isReceivedCall: true, from, name: callerName, signal});
        });
        return() => socket.disconnect();
    }, []);
    useEffect(() => {console.log(name)},[name])
    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator:false, trickle:false, stream});
        //data in signal will encapsulate a webrtc offer, answer, or ice candidate. 
        //These messages help the peers to eventually establish a direct connection to each other. 
        //The contents of these strings are an implementation detail that can be ignored by the user of this module; 
        //simply pass the data from 'signal' events to the remote peer and call peer.signal(data) to get connected.
        
        //Fired when the peer wants to send signaling data to the remote peer.
        //so inverse from normal "on" function pattern
        //for developer, our job is to get this data to the other peer.

        //Be sure to listen to this event immediately to avoid missing it. 
        //For initiator: true peers, it fires right away!!!!!
        //For initatior: false peers, it fires when the remote offer is received.
        

        peer.on('signal', (data)=>{
            console.log("ANSWER CALL");
            socket.emit('answercall', {signal: data, to: call.from});
        });

        
        // got remote video stream
        peer.on('stream', (currentStream)=>{
            console.log("receive stream");
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
    }

    const callUser = (id) => {
        const peer = new Peer({ initiator:true, trickle:false, stream});
        //caller signal -> "calluser" to server -> server pass signal to answerer ->
        peer.on('signal', (data)=>{
            console.log('SIGNAL', JSON.stringify(data))
            socket.emit('calluser', {userToCall: id, signalData:data, from: me, name});
        });

        peer.on('stream', (currentStream)=>{
            console.log("caller stream");
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal)=>{
            setCallAccepted(true);
            //Call this method whenever the remote peer emits a peer.on('signal') event.
            //in conclusion, 1.pass the data from 'signal' events to the remote peer 2.call peer.signal(data) to get connected.
            peer.signal(signal);
            console.log("cONNECTION");
        });

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return(
        <SocketContext.Provider value = {{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
        }}>
            {children}
        </SocketContext.Provider>
    )

}

export {SocketContext , ContextProvider};
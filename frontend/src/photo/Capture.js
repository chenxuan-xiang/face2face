import { useEffect, useRef, useState } from 'react';
import './Capture.css';

export function Capture() {
    // const base_url = "http://localhost:8080";
    const base_url = "";
    const[width, setWidth] = useState(320); // We will scale the photo width to this
    const[height, setHeight] = useState(0);  // This will be computed based on the input stream
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
    const[streaming, setStreaming] = useState(false);
    const[photoSrc, setPhotoSrc] = useState();
    const[result, setResult] = useState("");
    const[userName, setUserName] = useState("");
    const[userEmail, setUserEmail] = useState("");
    const[userId, setUserId] = useState("")
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play().then( _=>{
                let h = videoRef.current.videoHeight / (videoRef.current.videoWidth/width);
                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.
                if (isNaN(h)) {
                    h = width / (4/3);
                }
                setHeight(h);
            })
        })
        .catch(function(err) {
            console.log("An error occurredQ: " + err);
        });
        
    },[])
    useEffect(() => {
        clearphoto();
    },[height])
    const takePicture = () =>{
        var context = canvasRef.current.getContext('2d');
        if (width && height) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
          context.drawImage(videoRef.current, 0, 0, width, height);
        
          let data = canvasRef.current.toDataURL('image/png');
          console.log(data);
          uploadImage(data);
          setPhotoSrc(data);
        } else {
          clearphoto();
        }
    }

    function uploadImage(data) {
      fetch('/images', {
        method: 'POST',
        body: data
      })
        .then(result => {
          console.log('Success:', result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function validateImage() {
      setResult("Validating......");
      var context = canvasRef.current.getContext('2d');
      if (width && height) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        context.drawImage(videoRef.current, 0, 0, width, height);
        let data = canvasRef.current.toDataURL('image/png');
        setPhotoSrc(data);
        fetch('/validate', {
          method: 'POST',
          body: data
        })
        .then(re => {
          return re.json();})
        .then((result) =>{
          let tag = result.predictions[0].tagName;
          let maxVal = result.predictions[0].probability;
          result.predictions.forEach((item) => {
            if(maxVal < item.probability){
              maxVal = item.probability;
              tag = item.tagName;
            }
          });
          setResult(tag);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } else {
        clearphoto();
      }
    }

    const clearphoto = () => {
        var context = canvasRef.current.getContext('2d');
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, width, height);
      
        let data = canvasRef.current.toDataURL('image/png');
        console.log(data);
        setPhotoSrc(data);
    }

    const submitUser = () => {
      var context = canvasRef.current.getContext('2d');
      if (width && height) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        context.drawImage(videoRef.current, 0, 0, width, height);
        let data = canvasRef.current.toDataURL('image/png');
        setPhotoSrc(data);
        console.log(userEmail);

        fetch(base_url + '/users', {
          method: 'POST',
          body: 
          JSON.stringify(
          {
            email: userEmail,
            name: userName,
            image: data }
          )
        })
        .then(re => re.text())
        .then(result => {
          console.log('Result:', result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    }
    const getUser = () => {
      console.log("testtest!!!");
      fetch(base_url + `/users/${userId}`, {
        method: 'GET',
      })
      .then(re => re.json())
      .then(result => {
        console.log('Success:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

    const getUserByName = () => {
      console.log("testtest!!!222v");
      fetch(base_url + `/users/name/${userId}`, {
        method: 'GET',
      })
      .then(re => re.json())
      .then(result => {
        console.log('Success:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      console.log("testtestendend");
    }
  return (
    <div className="background">
      <header className="header">
        <h1>Take static picture</h1>
      </header>

      <div className="contentarea">
        <div className="camera">
          <video id="video"
           width = { width }
           height = { height }
           ref = { videoRef }
           onCanPlay = {() => {
            if (!streaming) { 
                setStreaming(true);
              }
           }}
           >Video stream not available.</video>
          <button id="startbutton" onClick={()=>{takePicture();}}>Take photo</button> 
        </div>
        <canvas id="canvas"
            ref = { canvasRef }
            width = { width }
            height = { height }
        ></canvas>
        <div className="output">
          <img id="photo" 
          src={photoSrc}
          alt="The screen capture will appear in this box."/> 
          <button id="clearbutton" onClick={() => {clearphoto()}}>Clear photo</button> 
        </div>
      </div>
      <div>
        <button id="validatebutton" onClick={() => {validateImage()}}>validate</button>
        {!!result && <div className='result'>{result}</div>}
      </div>
      <form className='user_form'>
        
        <input className="input_text" 
          type="text" 
          required="required" 
          placeholder='input your name'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}/>
        <input className="input_text" 
          type="text" 
          required="required" 
          placeholder='input your email'
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}/>
        <button className='submitbutton' onClick={(e) => {submitUser();e.preventDefault();}}>submit</button>
        <input className="input_text" 
          type="text" 
          required="required" 
          placeholder='query id'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}/>
        <button className='submitbutton' onClick={(e) => {getUser();e.preventDefault();}}>query users</button>
        <button className='submitbutton' onClick={(e) => {getUserByName();e.preventDefault();}}>query users by name test1</button>
      </form>
    </div>
  );
}

export default Capture;

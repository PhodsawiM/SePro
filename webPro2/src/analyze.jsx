import React, { useState,useRef,useContext, useEffect } from 'react'
import axios from 'axios'
import Webcam from "react-webcam";
import { Flag } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useNavigate} from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import UploadImage from './assets/upload.svg'
import { div } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import { GlobalContext } from "./context/GlobalContext";
import * as poseDetection from '@tensorflow-models/pose-detection';
const ipAd = ''
const Analyze = () => {
  const { ip, setGlobalVariable } = useContext(GlobalContext);
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const userId = localStorage.getItem('userid')
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/sound.mp4");
  const [C,setC] = useState('Image')
  const canvasRef = useRef(null);
  const [isCountN,setIscountn] = useState(false)
  const [nowtime,setNowtime] = useState(0)
const togleC = ()=>{
  if(C === 'Image'){
    setC('Video')
  }else{
    setC('Image')
  }
}
const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file);
  setPreview(URL.createObjectURL(file));
};


  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
        await sound.play();
        console.log('MoveNet model loaded');
      } catch (error) {
        console.error('Error loading MoveNet model:', error);
      }
    };
    loadModel();
  }, []);
  
  useEffect(() => {
    const detectPose = async () => {
      if (!detectorRef.current || !webcamRef.current || !webcamRef.current.video) {
        return;
      }
      const video = webcamRef.current.video;
      if (video.readyState !== 4) {
        requestAnimationFrame(detectPose);
        return;
      }
      const videoWidth = window.innerWidth; 
      const videoHeight = window.innerHeight; 
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      const runDetection = async () => {
        try {
            const poses = await detectorRef.current.estimatePoses(video, {
                maxPoses: 1,
                flipHorizontal: true, 
            });
    
            if (poses.length > 0) {
              console.log("Pose Keypoints:", poses[0].keypoints);
              
              const keypointsArray = poses[0].keypoints.flatMap(kp => [kp.x, kp.y]);
              const keypointsTensor = tf.tensor1d(keypointsArray);
              console.log("Keypoints Tensor Shape:", keypointsTensor.shape);
              setInputData(keypointsTensor.arraySync().join(",")); 
          }
          
            drawResults(poses, ctx, videoWidth, videoHeight);
        } catch (error) {
            console.error('Error during pose estimation:', error);
        }
        requestAnimationFrame(runDetection);
    };
      runDetection();
    };
    detectPose();
    
  }, [isModelLoaded]);

const handleSubmit = async () => {
  // e.preventDefault();
  // if (!image) {
  //   alert('Please select an image');
  //   return;
  // }
  const formData = new FormData();
  formData.append('imageTP', image);
  const userId = localStorage.getItem('userid')
  try {
    setLoading(true); 
    const response = await fetch(`https://${ip}:5000/uploadToPy/${userId}`, {
      method: 'POST',
      body: formData,
      userId: userId
    });
    const result = await response.json();
    console.log(response.status)
    if (response.status === 200) {
      navigate('/profile')
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  } finally {
    setLoading(false);
  }
};

  // const toggleCamera = () => {
  //   setIsCameraOn((prev) => !prev);
  // };
  const [selectedFile, setSelectedFile] = useState(null);

 
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

const formData = new FormData();
    formData.append('file', selectedFile);

    // fetch('YOUR_API_ENDPOINT', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('File uploaded successfully:', data);
    //   })
    //   .catch((error) => {
    //     console.error('Error uploading file:', error);
    //   });
}
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100);
  };
  const TestA = async () => {
    let AnalyzeLevel = await generateRandomNumber();
    try {
      console.log(AnalyzeLevel)
      const res = await axios.post(`${ip}/analyze/${userId}`, {AnalyzeLevel,userId});
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  }
  const [isON,setIsON] = useState(true)
  const handleCamon = ()=>{
    setIsON(prev => !prev);
    console.log(isON);
    togleC();
  }

  const playSound = () => {
    sound.play();
  };
  const drawResults = (poses, ctx, videoWidth, videoHeight, video) => {
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    const keypointNames = [
      "nose", "leftEye", "rightEye", "leftEar", "rightEar",
      "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
      "leftWrist", "rightWrist", "leftHip", "rightHip",
      "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
    ];

    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      const rightWristIndex = keypointNames.indexOf("rightWrist");
      const leftWristIndex = keypointNames.indexOf("leftWrist");
      const rightShoulderIndex = keypointNames.indexOf("rightShoulder");
      const leftShoulderIndex = keypointNames.indexOf("leftShoulder");

      const rightWrist = keypoints[rightWristIndex];
      const leftWrist = keypoints[leftWristIndex];
      const rightShoulder = keypoints[rightShoulderIndex];
      const leftShoulder = keypoints[leftShoulderIndex];

      if (rightWrist.score > 0.5 || leftWrist.score > 0.5) {
        const localrightWristY = rightWrist.y;
        const localrightWristX = rightWrist.x;
        const localleftWristY = leftWrist.y;
        const localleftWristX = leftWrist.x;
        const localrightShoulderY = rightShoulder.y;
        const localrightShoulderX = rightShoulder.x;
        const localleftShoulderY = leftShoulder.y;
        const localleftShoulderX = leftShoulder.x;

        const calculatedDistance = findAngle(localrightShoulderX, localrightShoulderY, localrightWristX, localrightWristY);
        setDistance(calculatedDistance);
        console.log(calculatedDistance);

        if (calculatedDistance <= 40 &&calculatedDistance >= 10 && poseStateRef.current === "state0") {
          setPosstate("state1");
          poseStateRef.current = "state1";
          playSound();
        } else if (calculatedDistance <= 275 &&calculatedDistance >= 265 && poseStateRef.current === "state1") {
          // setCount((prevCount) => prevCount + 1);
          setPosstate("state2");
          poseStateRef.current = "state2";
          // playSound();
        } else if(calculatedDistance <= 130 &&calculatedDistance >= 110 && poseStateRef.current === "state2"){
          setCount((prevCount) => prevCount + 1);
          setPosstate("state0");
          poseStateRef.current = "state0";
          playSound();
        }
      }
    }
  };
  const [hasPermission, setHasPermission] = useState(false);
  const [camON, setCamon] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
useEffect(() => {
  const getCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // front camera
          width: { ideal: 480 },
          height: { ideal: 1280 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error('Error accessing camera: ', err);
      setHasPermission(false);
    }
  };
  if (!isON) {
    getCamera();
  } else {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }
  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };
}, [isON]);
const captureImage = async () => {
  console.log('Start capture in 10 second');
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video || !canvas) {
    console.error('Video or canvas not found');
    return;
  }
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
  if (blob) {
    const file = new File([blob], 'captured-image.png', { type: 'image/png' });
    setImage(file); 
    setPreview(URL.createObjectURL(blob));
    console.log('Captured image file:', file);
    handleSubmit();
  }
};
const jscount = () => {
  return new Promise((resolve) => {
    let counter = 0;
    const interval = setInterval(() => {
      counter += 1;
      setNowtime(counter);
      if (counter >= 10) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
};
  const nubtoilung = async () => {
    setIscountn(true);
    await jscount();   
    captureImage();    
    setNowtime(0);
  };
  return (
    <div
    className={`flex flex-col justify-center items-center min-h-screen p-1 bg-gradient-to-r from-black via-purple-950 to-blue-900 animate-gradient-x `}
    >
    <h1 className='text-3xl md:text-7xl text-white p-3 font-bold'>วิเคราะห์อาการ</h1>
  
      <div className='flex flex-col shadow-lg justify-between w-[90vw] md:w-4/5 md:mx-auto my-2 md:my-8 bg-blue-300 rounded-lg min-h-[480px] md:min-h-[500px]'>
          <div className='flex items-center justify-center min-h-[380px] md:min-h-screen my-auto w-full mx-auto rounded-t-lg bg-gray-300 relative overflow-hidden'>
            {C === 'Video'?(
              <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full md:max-h-[600px] object-cover transform scale-x-[-1]" 
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
              </>
            ) : loading ? (
              <div className='flex flex-col items-center justify-center space-y-5 bg-cover bg-center min-h-[700px] px-8' style={{ backgroundImage: `url(${preview})` }}>
                <div className='flex flex-col'>
                  <ClipLoader className='mx-auto my-auto' color="#3498db" size={130} />
                  <span className='text-white text-4xl'>
                    กำลังประมวลผล
                  </span>
                </div>
              </div>
          
          ):preview ==! null ? (<img className='mx-auto mt-10 md:mt-3' style={{'maxHeight':'700px'}} src={preview}></img>)
        :(<div className='flex flex-col items-center text-white text-3xl'> <img src={UploadImage} width={100} height={100} /> <p>อัปโหลดรูปภาพ</p></div>)
          }
          </div>
          {C === 'Image'?(<div className='h-full p-3 space-x-2 '>
            <Button
            variant="contained"
            component="label"
            onClick={handleCamon}
            >
            เปิดกล้อง
          </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              อัปโหลดภาพ
              <input
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body1">
                Selected File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!image}
            >
              เริ่มวิเคราะห์
            </Button>
        </div>):
        (<div className='h-full p-3 space-x-2'>
          <Button
            variant="contained"
            component="label"
            onClick={handleCamon}
            >
            อัปโหลดรูป
          </Button>
          {/* <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            อัปโหลดภาพ
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            /> */}
          {/* </Button> */}
          {selectedFile && (
            <Typography variant="body1">
              Selected File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
          )}
          {/* <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!image}
          >
            เริ่มวิเคราะห์
          </Button> */}
          {/* <Button onClick={captureImage}> */}
          <Button             
            variant="contained"
            component="label"
            onClick={nubtoilung} >
            ถ่าย
          </Button>
      </div>)}
          
    </div>
    {/* <div> */}
    {/* {!hasPermission ? (
        <p>Camera permission denied or not available.</p>
      ) : ( isON ? null:(
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="100%"
          height="auto"
          style={{ transform: 'scaleX(-1)' }}
        />
      )
      )
      }
    </div> */}
    {/* <div className='text-white h-full w-full bg-white rounded-lg'>
      <div className='grid grid-cols-4 justify-center items-center p-2 h-auto w-full text-black'>
            <div className='flex h-[10vh] bg-black items-center justify-center'>
              1
            </div>
            <div>
              2
            </div>
            <div>
              3
            </div>
            <div>
              4
            </div>

      </div>
    </div> */}
    {/* <div>
      <button className='text-white'
        onClick={handleCamon}
      >
        เปิดกล้อง
      </button>
    </div> */}
    {/* <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Send Email</h2>
      <input
        type="email"
        name="to"
        placeholder="To"
        value={formData.to}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <textarea
        name="text"
        placeholder="Message"
        value={formData.text}
        onChange={handleChange}
        rows={5}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={sendEmail} style={{ padding: '10px 20px' }}>
        Send Email
      </button>
      </div> */}
      {/* <button onClick={nubtoilung} className='text-white'>
        Send Email
      </button> */}
      {/* <div>
        <p className='text-white'>{nowtime}</p>
      </div> */}
</div>
  )
}

export default Analyze      
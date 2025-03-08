import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from "papaparse";

const PoseEstimatorWithWebcam2 = () => {
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);
  const [data0,setdata0] = useState(null);
  const [data1,setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);
  const [jfs, setJfs] = useState(null);

  const [poseState,setPosstate] = useState('back')
  const poseStateRef = useRef('back');

  const filePath = "/Mdata/situp.csv"; // Adjust path if required
 
  let counter = 0;
  let state = {
    leftWrist: 'neutral', // Tracks state for LeftWrist
    rightWrist: 'neutral', // Tracks state for RightWrist
  };
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        if (!tf.ENV.get('WEBGL_VERSION')) {
          console.error('WebGL not supported!');
        }
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
        console.log('MoveNet model loaded');
      } catch (error) {
        console.error('Error loading MoveNet model:', error);
      }
    };
    
    loadModel();
  }, []);
  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());  // Stop the stream after testing
      console.log('Camera access granted');
    } catch (error) {
      console.error('Camera permission error:', error);
      alert('Camera access is required for pose detection.');
    }
  };
  
  useEffect(() => {
    checkPermissions();
  }, []);
  
  useEffect(() => {
    if (count === 10) {
      const activateFunct = async () => {
        try {
          const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, { exercisename: localStorage.getItem('exerciseName'), userId, exerciseId: localStorage.getItem('exerciseId') });
          console.log(res);
          navigate('/history');
        } catch (error) {
          console.error('Error submitting the form:', error);
        }
      };
      activateFunct()
    }
  }, [count]);
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
      // const videoWidth = 1080;
      // const videoHeight = 720;
      const videoWidth = window.innerWidth; // Use window width for responsiveness
      const videoHeight = window.innerHeight; 
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      const runDetection = async () => {
        try {
          const poses = await detectorRef.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true, // Flip the video horizontally for pose estimation
          });

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
  const playSound = () => {
    sound.play();
  };
  const drawResults = async (poses, ctx, videoWidth, videoHeight) => {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
  
    const keypointNames = [
      "nose", "leftEye", "rightEye", "leftEar", "rightEar",
      "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
      "leftWrist", "rightWrist", "leftHip", "rightHip",
      "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
    ];
  
    let predictedClass = "No Action";
  
    for (const pose of poses) {
      const keypoints = pose.keypoints;
  
      if (keypoints.length > 0) {
        let leftEyeY = null;
        keypoints.forEach((keypoint, index) => {
          if (keypoint.score > 0.5 && keypointNames[index] === "nose") {
            leftEyeY = keypoint.y;
          }
        });

        let localRHX = 0
        let localLHX = 0
        let localRHY = 0
        let localLHY = 0

        let localRSX = 0
        let localLSX = 0
        let localRSY = 0
        let localLSY = 0
        
        let localRHPX = 0
        let localLHPX = 0
        let localRHPY = 0
        let localLHPY = 0

        let localREarX = 0
        let localLEarX = 0
        let localREarY = 0
        let localLEarY = 0

        let cooldown = false;

        keypoints.forEach((keypoint, index) => {
          if (keypoint.score > 0.5) {
            const partName = keypointNames[index];
        
            if (partName === "leftShoulder") {
              localLSY = keypoint.y;
              localLSX = keypoint.x;
            }
            if (partName === 'rightHip'){
              localRHPY = keypoint.y;
              localRHPX = keypoint.x;
            }
            if (partName === 'lefttHip'){
              localLHPY = keypoint.y;
              localLHPX = keypoint.x;
            }
            if (partName === 'rightEar'){
              localREarY = keypoint.y;
              localREarX = keypoint.x;
            }
            if (partName === 'lefttEar'){
              localLEarY = keypoint.y;
              localLEarX = keypoint.x;
            }
            if (partName === "rightShoulder") {
              localRSY = keypoint.y;
              localRSX = keypoint.x;
        
              if (localREarX !== 0 && localRSX !== 0) {
                const distance = localRSX-localREarX;
                const coredistance = localRSX-localRHPX;
                // if (distance > 0){
                  console.log(`${localRSX} - ${localREarX} = ${distance}`)
                  setJfs(`${localRSX} - ${localREarX} = ${distance}`)
                // }
                if (!cooldown) {
                  if (localREarX > localRSX && poseStateRef.current === 'back') {
                    setCount((prevCount) => prevCount + 1);
                    setPosstate('font');
                    poseStateRef.current = 'font'; // Update the ref
                    console.log("Changed to 'font'");
                    playSound();
                    cooldown = true;
                    setTimeout(() => (cooldown = false), 50);
                  } else if (localREarX < localRSX && poseStateRef.current === 'font') {
                    setPosstate('back');
                    poseStateRef.current = 'back'; // Update the ref
                    console.log("Changed to 'back'");
                    playSound();
                    cooldown = true;
                    setTimeout(() => (cooldown = false), 50);
                  }
                }
              }
            }
          }
        });
      }
    }

    const predictionDiv = document.getElementById("prediction-text");
    setTimeout(() => {
      if (predictionDiv) {
        predictionDiv.innerText = `Prediction: ${predictedClass}`;
      }
    }, 2000);
  };
  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      <div className="w-[98vw] h-[100vh]">
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      {/* <div className='text-white'>
        {poseState}
      </div> */}
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
      {isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px]">
          <p className="text-blue-600 text-5xl text-left">{poseStateRef.current}</p>
          <p className="text-blue-600 text-8xl text-left">{count}</p>
        </div>
      )}
      {/* <div className="text-white mt-4">{count}</div> */}
      {/* {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
          Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
          Data digit 1: {data1}
          </p>
        </div>
      )} */}
      {/* <div className='text-white'>
        {Pretenshow}
      </div> */}
    </div>
  );
  
};

// ----------------------------------------------------------------------------------------------
const PoseEstimatorWithWebcam3 = () => {
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);

  const [model, setModel] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [data0,setdata0] = useState(null);
  const [data1,setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);

  const [RHY, setRHY] = useState();
  const [RHX, setRHX] = useState();
  const [LHY, setLHY] = useState();
  const [LHX, setLHX] = useState();

  const [positionTest,setpositionTest] = useState(0)
  const [positionTest2,setpositionTest2] = useState(0)
  const [positionTest3,setpositionTest3] = useState(0)
  const [distance, setDistance] = useState(null); 
  const [poseState,setPosstate] = useState('up')
  const poseStateRef = useRef('up');
const positionTestRef = useRef(0)
  const filePath = "/Mdata/situp.csv"; // Adjust path if required
  useEffect(() => {
    if (count === 10) {
      const activateFunct = async () => {
        try {
          const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, { exercisename: localStorage.getItem('exerciseName'), userId, exerciseId: localStorage.getItem('exerciseId') });
          console.log(res);
          navigate('/history');
        } catch (error) {
          console.error('Error submitting the form:', error);
        }
      };
      activateFunct()
    }
  }, [count]);

  let counter = 0;
  let state = {
    leftWrist: 'neutral', 
    rightWrist: 'neutral',
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
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
      const videoWidth = window.innerWidth; // Use window width for responsiveness
      const videoHeight = window.innerHeight; 
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      const runDetection = async () => {
        try {
          const poses = await detectorRef.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true, // Flip the video horizontally for pose estimation
          });

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
  const playSound = () => {
    sound.play();
  };
  const drawResults = (poses, ctx, videoWidth, videoHeight) => {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    const keypointNames = [
      "nose", "leftEye", "rightEye", "leftEar", "rightEar",
      "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
      "leftWrist", "rightWrist", "leftHip", "rightHip",
      "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
    ];
    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;
      const leftKneeIndex = keypointNames.indexOf("leftKnee");
      const leftHipIndex = keypointNames.indexOf("leftHip");
  
      const leftKnee = keypoints[leftKneeIndex];
      const leftHip = keypoints[leftHipIndex];
  
      if (leftKnee.score > 0.5 && leftHip.score > 0.5) {
        const localLKneeY = leftKnee.y;
        const localLHPY = leftHip.y;
  
        const calculatedDistance = localLKneeY - localLHPY;
        setDistance(calculatedDistance);
  
        if (calculatedDistance < 150 && poseStateRef.current === "up") {
          setPosstate("down");
          poseStateRef.current = "down";
          playSound();
        } else if (calculatedDistance > 150 && poseStateRef.current === "down") {
          setCount((prevCount) => prevCount + 1);
          setPosstate("up");
          poseStateRef.current = "up";
          playSound();
        }
      }
    }
  };
  
  // const drawResults = async (poses, ctx, videoWidth, videoHeight) => {
  //   ctx.clearRect(0, 0, videoWidth, videoHeight);
  
  //   const keypointNames = [
  //     "nose", "leftEye", "rightEye", "leftEar", "rightEar",
  //     "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
  //     "leftWrist", "rightWrist", "leftHip", "rightHip",
  //     "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
  //   ];
  
  //   let predictedClass = "No Action";
  
  //   for (const pose of poses) {
  //     const keypoints = pose.keypoints;
  //     if (poses.length > 0) {
  //       const keypoints = poses[0].keypoints;

  //       // Extract left knee and hip information
  //       const leftKneeIndex = keypointNames.indexOf("leftKnee");
  //       const leftHipIndex = keypointNames.indexOf("leftHip");

  //       const leftKnee = keypoints[leftKneeIndex];
  //       const leftHip = keypoints[leftHipIndex];

  //       if (leftKnee.score > 0.5 && leftHip.score > 0.5) {
  //         const localLKneeY = leftKnee.y;
  //         const localLHPY = leftHip.y;

  //         const calculatedDistance = localLKneeY - localLHPY;
  //         setDistance(calculatedDistance); // Update state with the calculated distance
  //         if(calculatedDistance < 150 && poseStateRef.current === 'up'){
  //           // setCount((prevCount) => prevCount + 1);
  //           setPosstate('down');
  //           poseStateRef.current = 'down';
  //           playSound();
  //         }
  //         if(calculatedDistance > 150 && poseStateRef.current === 'down'){
  //           setCount((prevCount) => prevCount + 1);
  //           setPosstate('up');
  //           poseStateRef.current = 'up';
  //           playSound();
  //         }
  //       }
  //     // if (keypoints.length > 0) {
  //     //   let leftEyeY = null;
  //     //   keypoints.forEach((keypoint, index) => {
  //     //     if (keypoint.score > 0.5 && keypointNames[index] === "rightShoulder" || keypointNames[index] === "leftShoulder") {
  //     //       leftEyeY = keypoint.y;
  //     //     }
  //     //   });

  //     //   let localRHX = 0
  //     //   let localLHX = 0
  //     //   let localRHY = 0
  //     //   let localLHY = 0

  //     //   let localREyeX = 0
  //     //   let localREyeY = 0
  //     //   let localLEyeX = 0
  //     //   let localLEyeY = 0

  //     //   let localRKneeX = 0
  //     //   let localRKneeY = 0
  //     //   let localLKneeX = 0
  //     //   let localLKneeY = 0

  //     //   let localRHPX = 0
  //     //   let localLHPX = 0
  //     //   let localRHPY = 0
  //     //   let localLHPY = 0

  //     //   let localRAnkleX = 0
  //     //   let localLAnkleX = 0
  //     //   let localRAnkleY = 0
  //     //   let localLAnkleY = 0

  //     //   let cooldown = false;
  //     //   const keypoints = pose.keypoints; // Replace 'pose' with your actual pose data
  //     //   const leftKnee = keypoints.find((point) => point.name === "leftKnee");
  //     //   const leftHip = keypoints.find((point) => point.name === "leftHip");
        
  //     //   if (leftKnee && leftHip) {
  //     //     const localLKneeY = leftKnee.y;
  //     //     const localLHPY = leftHip.y;
        
  //     //     let Data = localLKneeY - localLHPY;
  //     //     setpositionTest3(Data);
  //     //   }
  //       // keypoints.forEach((keypoint, index) => {
  //       //   if (keypoint.score > 0.5) {
  //       //     const partName = keypointNames[index];
        
  //       //     if (partName === "rightWrist") {
  //       //       localLHY = keypoint.y;
  //       //       localLHX = keypoint.x;
  //       //     }
  //       //     if (partName === 'rightEye'){
  //       //       localREyeY = keypoint.y;
  //       //       localREyeX = keypoint.x;}
  //       //     if (partName === 'leftEye'){
  //       //       localLEyeY = keypoint.y;
  //       //       localLEyeX = keypoint.x;
  //       //     }
  //       //     if (partName === "rightKnee") {
  //       //       localRKneeY = keypoint.y;
  //       //       localRKneeX = keypoint.x;
  //       //     }
  //       //     if (partName === 'leftKnee'){
  //       //       let localLKneeY2 = keypoint.y;
  //       //       if(localLKneeY2 > 0){
  //       //         localLKneeY = keypoint.y;
  //       //         setpositionTest(localLKneeY)
  //       //       }
              
  //       //       localLKneeX = keypoint.x;}
  //       //       if (partName === 'rightAnkle'){
  //       //         localRAnkleY = keypoint.y;
  //       //         localRAnkleX = keypoint.x;
  //       //       }
  //       //       if (partName === 'leftAnkle'){
  //       //         localLAnkleY = keypoint.y;
  //       //         localLAnkleX = keypoint.x;
  //       //       }
  //       //       if (partName === 'leftEye'){
  //       //         localLEyeY = keypoint.y;
  //       //       localLEyeX = keypoint.x;
  //       //     }
  //       //     if (partName === "leftWrist") {
  //       //       localRHY = keypoint.y;
  //       //       localRHX = keypoint.x;
  //       //     }
  //       //     if (partName === 'rightHip'){
  //       //       localRHPY = keypoint.y;
  //       //       localRHPX = keypoint.x;
  //       //     }
  //       //     if (partName === 'leftHip'){
  //       //       let localLHPY2 = keypoint.y;
  //       //       if(localLHPY2 > 0){
  //       //         localLHPY = keypoint.y;
  //       //         setpositionTest2(localLHPY)
  //       //       }
  //       //       localLHPX = keypoint.x;
  //       //       // setpositionTest3(localLKneeY - localLHPY)
  //       //       // if () {
  //       //         const distance = localLHX - localRHX;
  //       //         const standV = (localLAnkleY - localLKneeY)*0.1
  //       //         // const standD = Math.abs(localLKneeY - localLHPY)
  //       //         // const standD = localLKneeY - localLHPY;
  //       //         let Data = 0
  //       //           Data = localLKneeY - localLHPY
  //       //           setpositionTest3(Data);
  //       //         if (!cooldown) {
  //       //           if (Data <= 200 && poseStateRef.current === 'up') {
  //       //             counter++;
  //       //             setPosstate('down');
  //       //             poseStateRef.current = 'down';
  //       //             console.log("Changed to 'down'");
  //       //             playSound();
  //       //             cooldown = true;
  //       //             setTimeout(() => (cooldown = false), 500);
  //       //           } else if (Data >= 201 && poseStateRef.current === 'down') {
  //       //             setPosstate('up');
  //       //             poseStateRef.current = 'up';
  //       //             console.log("Changed to 'up'");
  //       //             playSound();
  //       //             cooldown = true;
  //       //             setTimeout(() => (cooldown = false), 500);
  //       //           }
  //       //         }
  //       //       // }
  //       //     }
  //       //   }
  //       // });
  //       // Clear the canvas for the next frame
  //     }
  //   }

  //   const predictionDiv = document.getElementById("prediction-text");
  //   setTimeout(() => {
  //     if (predictionDiv) {
  //       predictionDiv.innerText = `Prediction: ${predictedClass}`;
  //     }
  //   }, 2000);
  // };
  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      <div className="w-[95vw] h-[100vh]">
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className='text-white'>
        {distance !== null ? (
          <p>Distance between left knee and left hip: {distance.toFixed(2)}</p>
        ) : (
          <p>Calculating...</p>
        )}
      </div>
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
      {isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px]">
          <p className="text-blue-600 text-5xl text-left">{poseStateRef.current}</p>
          <p className="text-blue-600 text-8xl text-left">{count}</p>
        </div>
      )}
      <div className="text-white mt-4">{count}</div>
      {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
          Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
          Data digit 1: {data1}
          </p>
        </div>
      )}
      <div className='text-white'>
        {Pretenshow}
      </div>
    </div>
  );
  
};

// export  {PoseEstimatorWithWebcam2,PoseEstimatorWithWebcam3};




// ----------------------------------------------------------------------------------------------
const PoseEstimatorWithWebcam4 = () => {
  const userId = localStorage.getItem('userid');
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);

  const [model, setModel] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [data0, setdata0] = useState(null);
  const [data1, setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);

  const [RHY, setRHY] = useState();
  const [RHX, setRHX] = useState();
  const [LHY, setLHY] = useState();
  const [LHX, setLHX] = useState();

  const [positionTest, setpositionTest] = useState(0);
  const [positionTest2, setpositionTest2] = useState(0);
  const [positionTest3, setpositionTest3] = useState(0);
  const [distance, setDistance] = useState(null);
  const [poseState, setPosstate] = useState('state0');
  const poseStateRef = useRef('state0');

  const filePath = "/Mdata/situp.csv";
  const findAngle = (X1, Y1, X2, Y2) => {
    const angleRadians = Math.atan2(Y2 - Y1, X2 - X1);
    let angleDegrees = angleRadians * (180 / Math.PI);
    if (angleDegrees < 0) {
      angleDegrees += 360;
    }
    return angleDegrees;
  };

  let counter = 0;
  let state = {
    leftWrist: 'neutral',
    rightWrist: 'neutral',
  };

  useEffect(() => {
    if (count === 10) {
      const activateFunct = async () => {
        try {
          const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, { exercisename: localStorage.getItem('exerciseName'), userId, exerciseId: localStorage.getItem('exerciseId') });
          console.log(res);
          navigate('/history');
        } catch (error) {
          console.error('Error submitting the form:', error);
        }
      };
      activateFunct()
    }
  }, [count]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
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
      const videoWidth = window.innerWidth; // Use window width for responsiveness
      const videoHeight = window.innerHeight; 
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      const runDetection = async () => {
        try {
          const poses = await detectorRef.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true, // Flip the video horizontally for pose estimation
          });

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

  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      <div className="w-[95vw] h-[100vh]">
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className='text-white'>
        {distance !== null ? (
          <>
            <p>sate: {poseState}</p>
            <p>Angle: {distance.toFixed(2)}</p>
          </>
        ) : (
          <p>Calculating...</p>
        )}
      </div>
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
      {isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px]">
          <p className="text-blue-600 text-5xl text-left">{poseStateRef.current}</p>
          <p className="text-blue-600 text-8xl text-left">{count}</p>
        </div>
      )}
      <div className="text-white mt-4">{count}</div>
      {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
            Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
            Data digit 1: {data1}
          </p>
        </div>
      )}
      <div className='text-white'>
        {Pretenshow}
      </div>
    </div>
  );
};
// ----------------------------------------------------------------------------------------------
const PoseEstimatorWithWebcam5 = () => {
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);

  const [model, setModel] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [data0,setdata0] = useState(null);
  const [data1,setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);

  const [RHY, setRHY] = useState();
  const [RHX, setRHX] = useState();
  const [LHY, setLHY] = useState();
  const [LHX, setLHX] = useState();

  const [positionTest,setpositionTest] = useState(0)
  const [positionTest2,setpositionTest2] = useState(0)
  const [positionTest3,setpositionTest3] = useState(0)
  const [distance, setDistance] = useState(0); 
  const [poseState,setPosstate] = useState('down')
  const poseStateRef = useRef('down');
const positionTestRef = useRef(0)
  const filePath = "/Mdata/situp.csv"; // Adjust path if required
  function calculateDistance2D(x1, y1, x2, y2) {
    // const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // return distance;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
useEffect(() => {
  if (count === 10) {
    const activateFunct = async () => {
      try {
        const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, { exercisename: localStorage.getItem('exerciseName'), userId, exerciseId: localStorage.getItem('exerciseId') });
        console.log(res);
        navigate('/history');
      } catch (error) {
        console.error('Error submitting the form:', error);
      }
    };
    activateFunct()
  }
}, [count]);

  let counter = 0;
  let state = {
    leftWrist: 'neutral', // Tracks state for LeftWrist
    rightWrist: 'neutral', // Tracks state for RightWrist
  };
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
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
      const videoWidth = window.innerWidth; // Use window width for responsiveness
      const videoHeight = window.innerHeight; 
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      const runDetection = async () => {
        try {
          const poses = await detectorRef.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true, // Flip the video horizontally for pose estimation
          });

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
  const playSound = () => {
    sound.play();
  };
  const drawResults = (poses, ctx, videoWidth, videoHeight) => {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
  
    const keypointNames = [
      "nose", "leftEye", "rightEye", "leftEar", "rightEar",
      "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
      "leftWrist", "rightWrist", "leftHip", "rightHip",
      "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
    ];
    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;
      const rightKneeIndex = keypointNames.indexOf("rightKnee");
      const rightHipIndex = keypointNames.indexOf("rightHip");
      const rightShoulderIndex = keypointNames.indexOf("rightShoulder");
      const rightKnee = keypoints[rightKneeIndex];
      const rightHip = keypoints[rightHipIndex];
      const rightShoulder = keypoints[rightShoulderIndex];
      if (rightKnee.score > 0.5 && rightHip.score > 0.5 && rightShoulder.score > 0.5) {
        const localRKneeY = rightKnee.y;
        const localRKneeX = rightKnee.x;
        const localRHipY = rightHip.y;
        const localRHipX = rightHip.x;
        const localRSDY = rightShoulder.y;
        const localRSDX = rightShoulder.x;
        const calculatedDistanceX = ((localRSDX+localRKneeX)/2);
        console.log(calculatedDistanceX)
        const calculatedDistanceY = ((localRSDY+localRKneeY)/2);
        const dataDistance = calculateDistance2D(calculatedDistanceX,calculatedDistanceY,localRHipX,localRHipY)
        setDistance(dataDistance);
        if (dataDistance > 120 && poseStateRef.current === "down") {
          setPosstate("up");
          poseStateRef.current = "up";
          playSound();
        } else if (dataDistance < 110 && poseStateRef.current === "up") {
          setCount((prevCount) => prevCount + 1);
          setPosstate("down");
          poseStateRef.current = "down";
          playSound();
        }
      }
    }
    // ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    // ctx.font = "30px Arial";
    // ctx.fillStyle = "red";
    // ctx.fillText(`Count: ${count}`, 50, 50);
    // poses.forEach((pose) => {
    //   pose.keypoints.forEach((keypoint) => {
    //     if (keypoint.score > 0.5) {
    //       ctx.beginPath();
    //       ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
    //       ctx.fillStyle = "blue";
    //       ctx.fill();
    //     }
    //   });
    // });
  };
  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      <div className="w-[95vw] h-[100vh]">
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className='text-white'>
        {distance !== null ? (
          <p>Distance between left knee and left hip: {distance.toFixed(2)}</p>
        ) : (
          <p>Calculating...</p>
        )}
      </div>
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
      {isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px]">
          <p className="text-blue-600 text-5xl text-left">{poseStateRef.current}</p>
          <p className="text-blue-600 text-8xl text-left">{count}</p>
          <p className="text-blue-600 text-8xl text-left">{distance}</p>
        </div>
      )}
      <div className="text-white mt-4">{count}</div>
      {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
          Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
          Data digit 1: {data1}
          </p>
        </div>
      )}
      <div className='text-white'>
        {Pretenshow}
      </div>
    </div>
  );
  
};
// ----------------------------------------------------------------------------------------------
const ReverseFlys = () => {
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);

  const [model, setModel] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [data0,setdata0] = useState(null);
  const [data1,setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);

  const [RHY, setRHY] = useState();
  const [RHX, setRHX] = useState();
  const [LHY, setLHY] = useState();
  const [LHX, setLHX] = useState();

  const [positionTest,setpositionTest] = useState(0)
  const [positionTest2,setpositionTest2] = useState(0)
  const [positionTest3,setpositionTest3] = useState(0)
  const [distance, setDistance] = useState(0); 
  const [poseState,setPosstate] = useState('down')
  const poseStateRef = useRef('down');
const positionTestRef = useRef(0)
  const filePath = "/Mdata/situp.csv"; // Adjust path if required
  function calculateDistance2D(x1, y1, x2, y2) {
    // const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // return distance;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
useEffect(() => {
  if (count === 10) {
    const activateFunct = async () => {
      try {
        const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, { exercisename: localStorage.getItem('exerciseName'), userId, exerciseId: localStorage.getItem('exerciseId') });
        console.log(res);
        navigate('/history');
      } catch (error) {
        console.error('Error submitting the form:', error);
      }
    };
    activateFunct()
  }
}, [count]);

  let counter = 0;
  let state = {
    leftWrist: 'neutral', // Tracks state for LeftWrist
    rightWrist: 'neutral', // Tracks state for RightWrist
  };
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
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
      const videoWidth = window.innerWidth; // Use window width for responsiveness
      const videoHeight = window.innerHeight; 
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      const runDetection = async () => {
        try {
          const poses = await detectorRef.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true, // Flip the video horizontally for pose estimation
          });

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
  const playSound = () => {
    sound.play();
  };
  const drawResults = (poses, ctx, videoWidth, videoHeight) => {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
  
    const keypointNames = [
      "nose", "leftEye", "rightEye", "leftEar", "rightEar",
      "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
      "leftWrist", "rightWrist", "leftHip", "rightHip",
      "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
    ];
    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;
      const rightElbowIndex = keypointNames.indexOf("rightElbow");
      const rightHipIndex = keypointNames.indexOf("rightHip");
      const rightShoulderIndex = keypointNames.indexOf("rightShoulder");
      const rightElbow = keypoints[rightElbowIndex];
      const rightHip = keypoints[rightHipIndex];
      const rightShoulder = keypoints[rightShoulderIndex];
      if (rightElbow.score > 0.5 && rightHip.score > 0.5 && rightShoulder.score > 0.5) {
        const localREBY = rightElbow.y;
        const localREBX = rightElbow.x;
        const localRHipY = rightHip.y;
        const localRHipX = rightHip.x;
        const localRSDY = rightShoulder.y;
        const localRSDX = rightShoulder.x;
        // const calculatedDistanceX = ((localRSDX+localREBX)/2);
        // console.log(calculatedDistanceX)
        // const calculatedDistanceY = ((localRSDY+localREBY)/2);
        // const dataDistance = calculateDistance2D(calculatedDistanceX,calculatedDistanceY,localRHipX,localRHipY)
        // setDistance(dataDistance);
        if (localREBY > localRSDY && poseStateRef.current === "down") {
          setPosstate("up");
          poseStateRef.current = "up";
          playSound();
        } else if (localREBY < localRSDY && poseStateRef.current === "up") {
          setCount((prevCount) => prevCount + 1);
          setPosstate("down");
          poseStateRef.current = "down";
          playSound();
        }
      }
    }
  };
  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      <div className="w-[95vw] h-[100vh]">
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className='text-white'>
        {distance !== null ? (
          <p>Distance between left knee and left hip: {distance.toFixed(2)}</p>
        ) : (
          <p>Calculating...</p>
        )}
      </div>
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
      {isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px]">
          <p className="text-blue-600 text-5xl text-left">{poseStateRef.current}</p>
          <p className="text-blue-600 text-8xl text-left">{count}</p>
          <p className="text-blue-600 text-8xl text-left">{distance}</p>
        </div>
      )}
      <div className="text-white mt-4">{count}</div>
      {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
          Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
          Data digit 1: {data1}
          </p>
        </div>
      )}
      <div className='text-white'>
        {Pretenshow}
      </div>
    </div>
  );
  
};
// ----------------------------------------------------------------------------------------------
const SuperManHold = () => {
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);

  const [model, setModel] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [data0,setdata0] = useState(null);
  const [data1,setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);

  const [RHY, setRHY] = useState();
  const [RHX, setRHX] = useState();
  const [LHY, setLHY] = useState();
  const [LHX, setLHX] = useState();

  const [positionTest,setpositionTest] = useState(0)
  const [positionTest2,setpositionTest2] = useState(0)
  const [positionTest3,setpositionTest3] = useState(0)
  const [distance, setDistance] = useState(0); 
  const [poseState,setPosstate] = useState('down')
  const poseStateRef = useRef('down');
const positionTestRef = useRef(0)
  const filePath = "/Mdata/situp.csv"; // Adjust path if required
  function calculateDistance2D(x1, y1, x2, y2) {
    // const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // return distance;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
useEffect(() => {
  if (count === 10) {
    const activateFunct = async () => {
      try {
        const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, { exercisename: localStorage.getItem('exerciseName'), userId, exerciseId: localStorage.getItem('exerciseId') });
        console.log(res);
        navigate('/history');
      } catch (error) {
        console.error('Error submitting the form:', error);
      }
    };
    activateFunct()
  }
}, [count]);

  let counter = 0;
  let state = {
    leftWrist: 'neutral', // Tracks state for LeftWrist
    rightWrist: 'neutral', // Tracks state for RightWrist
  };
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
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
      const videoWidth = window.innerWidth; // Use window width for responsiveness
      const videoHeight = window.innerHeight; 
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      const runDetection = async () => {
        try {
          const poses = await detectorRef.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true, // Flip the video horizontally for pose estimation
          });

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
  const playSound = () => {
    sound.play();
  };
  const drawResults = (poses, ctx, videoWidth, videoHeight) => {
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
      const rightHipIndex = keypointNames.indexOf("rightHip");
      const rightShoulderIndex = keypointNames.indexOf("rightShoulder");
      const rightAnkleIndex = keypointNames.indexOf("rightAnkle");
      const rightWrist = keypoints[rightWristIndex];
      const rightHip = keypoints[rightHipIndex];
      const rightShoulder = keypoints[rightShoulderIndex];
      const rightAnkle = keypoints[rightAnkleIndex];
      if (rightWrist.score > 0.5 && rightHip.score > 0.5 && rightShoulder.score > 0.5) {
        const localRWristY = rightWrist.y;
        const localRWristX = rightWrist.x;
        const localRHipY = rightHip.y;
        const localRHipX = rightHip.x;
        const localRSDY = rightShoulder.y;
        const localRSDX = rightShoulder.x;
        const localAKY = rightAnkle.y;
        const localAKX = rightAnkle.x;
        // const calculatedDistanceX = ((localRSDX+localRWristX)/2);
        // console.log(calculatedDistanceX)
        // const calculatedDistanceY = ((localRSDY+localRKneeY)/2);
        // const dataDistance = calculateDistance2D(calculatedDistanceX,calculatedDistanceY,localRHipX,localRHipY)
        // setDistance(dataDistance);
        if (localRWristY > localRHipY && poseStateRef.current === "down") {
          if (localAKY > localRHipY && poseStateRef.current === "down"){
            setPosstate("up");
            poseStateRef.current = "up";
            playSound();
          }
        } else if (localRWristY <= localRHipY && poseStateRef.current === "up") {
          if (localAKY > localRHipY && poseStateRef.current === "down"){
            setCount((prevCount) => prevCount + 1);
            setPosstate("down");
            poseStateRef.current = "down";
            playSound();
          }
        }
      }
    }
  };
  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      <div className="w-[95vw] h-[100vh]">
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className='text-white'>
        {distance !== null ? (
          <p>Distance between left knee and left hip: {distance.toFixed(2)}</p>
        ) : (
          <p>Calculating...</p>
        )}
      </div>
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
      {isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px]">
          <p className="text-blue-600 text-5xl text-left">{poseStateRef.current}</p>
          <p className="text-blue-600 text-8xl text-left">{count}</p>
          <p className="text-blue-600 text-8xl text-left">{distance}</p>
        </div>
      )}
      <div className="text-white mt-4">{count}</div>
      {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
          Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
          Data digit 1: {data1}
          </p>
        </div>
      )}
      <div className='text-white'>
        {Pretenshow}
      </div>
    </div>
  );
  
};
const Re3 = () => {
  const userId = localStorage.getItem('userid')
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sound = new Audio("./public/ring.mp3");
  const [count, setCount] = useState(0);
  const [model, setModel] = useState(null);
  const [modelpre, setModelpre] = useState(null);
  const [data0,setdata0] = useState(null);
  const [data1,setdata1] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [Pretenshow, setPretenshow] = useState(null);
  const [distance, setDistance] = useState(0); 
  const [poseState,setPosstate] = useState('down')
  const poseStateRef = useRef('down');
  const [inputData, setInputData] = useState("");
  const [accuracy, setAccuracy] = useState(null);

const loadPretrainedModel = async () => {
  try {
      const model = await tf.loadLayersModel(`https://192.168.1.194:5173/models/my-pretrained-model.json`);
      setModelpre(model);
      console.log("Model loaded from public folder.");
  } catch (error) {
      console.error("Error loading model:", error);
  }
};
useEffect(()=>{
  const handlePredict = async () => {
    await loadPretrainedModel(); // Reload the model before making a prediction
    if (!modelpre || !inputData) return;
    const inputArray = inputData.split(",").map(Number);
    console.log(inputArray)
    if (inputArray.length !== 34) {
        console.error("Incorrect input length:", inputArray.length);
        alert(`Invalid input! Expected 34 keypoints, but got ${inputArray.length}.`);
        return;
    }
    tf.tidy(() => {
        const inputTensor = tf.tensor2d([inputArray]);
        console.log("Input Tensor:", inputTensor.arraySync());
  
        const predictionTensor = modelpre.predict(inputTensor);
        console.log(predictionTensor.argMax(1).dataSync())
        const predictedClass = predictionTensor.argMax(1).dataSync()[0];
  
        console.log("Predicted Class:", predictedClass);
        setPrediction(predictedClass);
    });
  };
  handlePredict();
},[inputData])


  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet
        );
        setIsModelLoaded(true);
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
      const videoWidth = window.innerWidth; // Use window width for responsiveness
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
          
              // Convert tensor to a string and store it in state
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
  const playSound = () => {
    sound.play();
  };
  const drawResults = (poses, ctx, videoWidth, videoHeight) => {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
  
    const keypointNames = [
      "nose", "leftEye", "rightEye", "leftEar", "rightEar",
      "leftShoulder", "rightShoulder", "leftElbow", "rightElbow",
      "leftWrist", "rightWrist", "leftHip", "rightHip",
      "leftKnee", "rightKnee", "leftAnkle", "rightAnkle",
    ];

  };
  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-gray-800 items-center justify-center">
      <div className="w-[95vw] h-[100vh]">
        <Webcam
          ref={webcamRef}
          className="absolute top-20 left-0 w-full h-full object-cover rounded-lg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-20 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className='text-white'>
        {distance !== null ? (
          <p>Distance between left knee and left hip: {distance.toFixed(2)}</p>
        ) : (
          <p>Calculating...</p>
        )}
      </div>
      {!isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px] bg-black opacity-50">
          <p className="text-white text-5xl">Loading model...</p>
        </div>
      )}
      {isModelLoaded && (
        <div className="absolute mt-[80px] inset-1 h-[720px]">
          <p className="text-blue-600 text-5xl text-left">{poseStateRef.current}</p>
          <p className="text-blue-600 text-8xl text-left">{count}</p>
          <p className="text-blue-600 text-8xl text-left">{prediction}</p>
        </div>
      )}
      <div className="text-white mt-4">{count}</div>
      {prediction && (
        <div className="mt-4 text-white">
          <h3 className="text-lg font-bold">Prediction Result:</h3>
          <p className='text-red'>
          Data digit 0: {data0}
          </p>
          <p>{prediction}</p>
          <p className='text-red'>
          Data digit 1: {data1}
          </p>
        </div>
      )}
      <div className='text-white'>
        {Pretenshow}
      </div>
    </div>
  );
  
};


const PoseDataTrainer = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [trainingLabels, setTrainingLabels] = useState([]);
  const [testLabels, setTestLabels] = useState([]);
  const [model, setModel] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);

  // Handle file upload
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          processData(result.data, type);
        },
        header: true,
      });
    }
  };

  // Process CSV Data into training or testing data (only keypoints)
  const processData = (csvData, type) => {
    const inputData = [];
    const labelsData = [];
    
    csvData.forEach((row) => {
      try {
        // Parse keypoints and other data
        const keypoints = row.keypoints ? JSON.parse(row.keypoints) : [];
        const features = keypoints.flat().map((val) => parseFloat(val));

        const label = [parseFloat(row.Y)]; // Assuming Y is the label (binary classification)

        // Push data to the appropriate dataset (training or testing)
        if (type === "train") {
          inputData.push(features);
          labelsData.push(label);
          setTrainingData(inputData);
          setTrainingLabels(labelsData);
        } else {
          inputData.push(features);
          labelsData.push(label);
          setTestData(inputData);
          setTestLabels(labelsData);
        }
      } catch (e) {
        console.error(`Error processing row with keypoints: ${row.keypoints}`, e);
      }
    });
  };

  // Initialize TensorFlow.js
  async function initializeModel() {
    try {
      await tf.ready(); // Wait for TensorFlow.js to be ready
      console.log("TensorFlow.js is ready");

      // Create and compile the model
      createModel();
    } catch (error) {
      console.error("Error initializing TensorFlow.js:", error);
    }
  }

  // Create and compile the model
  const createModel = () => {
    if (trainingData.length === 0) {
      console.error("Training data is empty or not loaded yet.");
      return;
    }

    const model = tf.sequential();

    // Ensure the data has a valid shape for the input layer
    model.add(tf.layers.dense({ units: 64, activation: "relu", inputShape: [trainingData[0].length] }));
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" })); // Binary classification (0 or 1)

    model.compile({
      optimizer: "adam",
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });
    setModel(model);
  };

  // Train the model
  const trainModel = async () => {
    if (trainingData.length === 0 || trainingLabels.length === 0 || !model) {
      console.error("No training data or labels found, or model is not created.");
      return;
    }

    const inputs = tf.tensor2d(trainingData);
    const labelsTensor = tf.tensor2d(trainingLabels);

    await model.fit(inputs, labelsTensor, {
      epochs: 10,
      batchSize: 32,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
        },
      },
    });

    console.log("Training Complete!");
    // After training, evaluate the model on the test data
    evaluateModel();
  };

  // Evaluate the model on the test data
  const evaluateModel = async () => {
    if (testData.length === 0 || testLabels.length === 0) {
      console.error("No test data or labels found.");
      return;
    }

    const testInputs = tf.tensor2d(testData);
    const testLabelsTensor = tf.tensor2d(testLabels);

    const evaluation = await model.evaluate(testInputs, testLabelsTensor);
    console.log(`Test Loss: ${evaluation[0].dataSync()[0]}, Test Accuracy: ${evaluation[1].dataSync()[0]}`);
  };

  // Classify a new pose (Inference) using keypoints
  const classifyPose = async (pose) => {
    if (!model) return;

    // Convert pose keypoints into the input format (flatten the keypoints)
    const input = pose.keypoints.flat().map((val) => parseFloat(val));

    // Make the prediction using the trained model
    const inputTensor = tf.tensor2d([input]);
    const prediction = model.predict(inputTensor);

    // Extract and display the predicted result (0 or 1 for binary classification)
    const predictedClass = prediction.dataSync()[0] > 0.5 ? "Class 1" : "Class 0";
    setClassificationResult(predictedClass);
  };

  return (
    <div>
      <h1>Pose Data Trainer (Keypoints Only)</h1>

      <div>
        <input type="file" accept=".csv" onChange={(e) => handleFileChange(e, "train")} />
        <button onClick={initializeModel}>Initialize Model</button>
        <button onClick={trainModel}>Train Model</button>
        <input type="file" accept=".csv" onChange={(e) => handleFileChange(e, "test")} />
      </div>

      <div>
        <button
          onClick={() =>
            classifyPose({
              keypoints: 
              [[466.8773567676544, 59.51394236087802], [457.1079661846161, 50.0], [459.16391158103943, 50.70811927318576], [429.5363788604735, 55.70029497146609], [432.71063804626453, 56.49744212627414], [427.923043012619, 105.59119153022769], [416.1838767528534, 109.34990620613101], [385.0664691925049, 172.10432744026187], [365.5859327316284, 175.43530273437503], [356.1083450317383, 221.4715237617493], [300.0, 224.32568812370303], [433.32977771759033, 259.0521237850189], [420.69490599632263, 263.34527611732483], [434.3667690753937, 374.09418416023254], [426.01052713394154, 383.1739852428436], [433.9077444076538, 468.54871106147755], [421.95101022720326, 498.16100668907154]]
            })
          }
        >
          Test Pose
        </button>
      </div>

      {model && <p>Model created and ready to train.</p>}
      {classificationResult && <p>Classification Result: {classificationResult}</p>}
    </div>
  );
};

export  {PoseDataTrainer,Re3,ReverseFlys,SuperManHold,PoseEstimatorWithWebcam2,PoseEstimatorWithWebcam3,PoseEstimatorWithWebcam4,PoseEstimatorWithWebcam5};

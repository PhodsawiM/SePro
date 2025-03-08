import axios from 'axios';
import './exercise.css'
import React, { useState, useRef, useEffect } from 'react'
import Webcam from "react-webcam";
import { Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

function Excercise2() {
  const userId = localStorage.getItem('userid')
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the canvas
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [poseData, setPoseData] = useState(null);
  const [model, setModel] = useState(null);
  const tatalas = async () => {
    try {
      const res = await axios.post(`https://192.168.1.194:5000/exsersice2/${userId}`, {exercisename:localStorage.getItem('exerciseName'),userId,exerciseId:localStorage.getItem('exerciseId')});
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  }
  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready(); 
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet);
      setModel(detector);
    };

    loadModel();
  }, []);
  const detectPose = async () => {
    if (webcamRef.current && model) {
      const image = webcamRef.current.getScreenshot();
      if (image) {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.onload = async () => {
          const poses = await model.estimatePoses(imgElement);
          setPoseData(poses);
          drawPose(poses);
        };
      }
    }
  };
  useEffect(() => {
    if (isCameraOn) {
      const interval = setInterval(detectPose, 100); 
      return () => clearInterval(interval);
    }
  }, [isCameraOn, model]);
  const drawPose = (poses) => {
    if (!poses || poses.length === 0) return;
  
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); 
  
    poses.forEach(pose => {
      pose.keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.5) { 
          context.beginPath();
          context.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          context.fillStyle = 'red';
          context.fill();
          context.font = '12px Arial';
          context.fillStyle = 'white';
          context.fillText(`(${Math.round(keypoint.x)}, ${Math.round(keypoint.y)})`, keypoint.x + 6, keypoint.y - 6);
        }
      });
      const adjacentKeyPoints = [
        ['nose', 'leftEye'], ['leftEye', 'leftEar'],
        ['nose', 'rightEye'], ['rightEye', 'rightEar'],
        ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
        ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
        ['leftShoulder', 'rightShoulder'], ['leftHip', 'rightHip'],
        ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
        ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
      ];
  
      adjacentKeyPoints.forEach(([startPoint, endPoint]) => {
        const start = pose.keypoints.find(point => point.part === startPoint);
        const end = pose.keypoints.find(point => point.part === endPoint);
  
        if (start && end && start.score > 0.5 && end.score > 0.5) {
          context.beginPath();
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
          context.strokeStyle = 'blue';
          context.lineWidth = 2;
          context.stroke();
        }
      });
    });
  };
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

    fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded successfully:', data);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };
  return (
    <div style={{ width: '100%', minHeight: '600px' }}>
      <div className='font-bold text-black text-3xl'>Analyze</div>
      <div className='flex flex-col justify-between w-4/5 mx-auto my-8 bg-black rounded-lg' style={{'minHeight':'500px'}}>
        <div className='flex w-full items-center'>
         <div style={{ position: 'relative', width: '100%', height: '100%' }}>
  {isCameraOn && (
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      videoConstraints={{
        width: 1080,
        height: 720,
        facingMode: "user",
      }}
    />
  )}
  <canvas
    ref={canvasRef}
    width={1080}
    height={720}
    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
  />
</div>
        </div>

        <div className='p-2 bg-blue-300 rounded-b-lg'>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body1">
              Selected File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
          )}
          <Button
            variant="outlined"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Submit
          </Button>
          <Button onClick={toggleCamera}>
            {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          </Button>
          <Button onClick={tatalas}>
            Test BTN
          </Button>
        </div>
      </div>
    </div>
  );
}
export default Excercise2;

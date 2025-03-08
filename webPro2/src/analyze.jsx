import React, { useState,useRef } from 'react'
// import './analyze.css'
import axios from 'axios'
import Webcam from "react-webcam";
import { Flag } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useNavigate} from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import UploadImage from './assets/upload.svg'
import { div } from '@tensorflow/tfjs';
const ipAd = ''
// const ip = '192.168.1.196'
const ip = import.meta.env.VITE_API_URL;
const Analyze = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const userId = localStorage.getItem('userid')
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file);
  setPreview(URL.createObjectURL(file));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!image) {
    alert('Please select an image');
    return;
  }
  const formData = new FormData();
  formData.append('imageTP', image);
  const userId = localStorage.getItem('userid')
  try {
    setLoading(true); 
    const response = await fetch(`${ip}/uploadToPy/${userId}`, {
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

  // Function to toggle the webcam
  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
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
  return (
    <div
    className={`min-h-screen p-5 bg-gradient-to-r from-black via-purple-950 to-blue-900 animate-gradient-x `}
    >
    <h1 className='text-7xl text-white p-3 font-bold'>วิเคราะห์อาการ</h1>
  
      <div className='flex flex-col shadow-lg justify-between w-4/5 mx-auto my-8 bg-blue-300 rounded-lg' style={{'minHeight':'600px'}}>
          <div className='flex items-center justify-center  min-h-[530px] md:min-h-screen my-auto w-full mx-auto rounded-t-lg bg-gray-300 object-cover'>
            {loading ? (
              <div className='flex flex-col items-center justify-center space-y-5 bg-cover bg-center min-h-[700px] px-8' style={{ backgroundImage: `url(${preview})` }}>
                <div className='flex flex-col'>
                  <ClipLoader className='mx-auto my-auto' color="#3498db" size={130} />
                  <span className='text-white text-4xl'>
                    กำลังประมวลผล
                  </span>
                </div>
              </div>
          
          ):preview ==! null ? (<img className='mx-auto mt-10 md:mt-3' style={{'maxHeight':'700px'}} src={preview}></img>)
          :(<div className='flex flex-col items-center text-white text-3xl'> <img src={UploadImage} width={100} height={100} /> <p>อัปโหลดรูปภาพ</p></div>)}
          </div>
          <div className='h-full p-3 space-x-3'>
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
        </div>
    </div>
</div>
  )
}

export default Analyze      
import React, { useState,useRef } from 'react'
import './analyze.css'
import Webcam from "react-webcam";
import { Flag } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
function Analyze() {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  
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

    // Example upload process: FormData usage (replace with your API endpoint)
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
  return (
    <div style={{'width':'100%','minHeight':'700px'}}>
        <div><h1>Analyze</h1></div>
        
          <div className='AnaBox'>
            <div className='CameraBOX'>
              {isCameraOn && (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={"100%"}
                  height={"100%"}
                  videoConstraints={{
                    width: 1080,
                    height: 720,
                    facingMode: "user", // Can be "user" for front camera or "environment" for back camera
                  }}
                />
              )}
            </div>
            <div className='MenuBox'>
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

              <button onClick={toggleCamera} className='BBtn'>
                {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              </button>
              <button onClick={toggleCamera} className='BBtn'>
                Analyze
              </button>


          </div>
        </div>
    </div>
  )
}

export default Analyze      
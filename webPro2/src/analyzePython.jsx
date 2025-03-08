// import React, { useState,useRef } from 'react'
// import './analyze.css'
// import axios from 'axios'
// import Webcam from "react-webcam";
// import { Flag } from '@mui/icons-material';
// import { Box, Button, Typography } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { div } from '@tensorflow/tfjs';
// function AnalyzePython() {
//     const [image, setImage] = useState(null);
//     const [result, setResult] = useState(null);
//     const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       setImage(file);
//     };
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (!image) {
//         alert('Please select an image');
//         return;
//       }
//       const formData = new FormData();
//       formData.append('imageTP', image);
//       const userId = localStorage.getItem('userid')
//       try {
//         const response = await fetch(`https://192.168.1.194:5000/uploadToPy/${userId}`, {
//           method: 'POST',
//           body: formData,
//         });
        
//         // const result = await response.json();
//         // if (response.ok) {
//         //   console.log('Result from model:', result);
//         // } else {
//         //   console.error('Error uploading image:', result);
//         // }

      
//         if (response.ok) {
//           const resultData = await response.json();
//           console.log('Result from model:', resultData);
//           setResult(resultData); // Store the result in the state
//         } else {
//           console.error('Error uploading image:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error uploading image:', error);
//       }
//     };
  
//     return (
//     <div className='min-h-screen'>
//       <form onSubmit={handleSubmit} className='space-x-4'>
//         <input type="file" onChange={handleImageChange} />
//         <button type="submit" className='bg-blue-400 px-3'>Upload Image</button>
//       </form>
//       {result && (
//         <Box mt={4} p={2} border="1px solid gray" borderRadius="8px">
//           <Typography variant="h6">Posture Analysis Result:</Typography>
//           <Typography variant="body1">Angle: {result.angle}°</Typography>
//           <Typography variant="body1">Angle Difference: {result.angleres}°</Typography>
//           <Typography variant="body1">Postural Condition: {result.angleresR}</Typography>
//           <Typography variant="body1">Level: {result.LevelR}</Typography>
//         </Box>
//       )}
//     </div>
//     );
//   };
  
// export default AnalyzePython      


import React, { useState } from 'react';
import './analyze.css';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

function AnalyzePython() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Track if processing

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image');
      return;
    }

    setIsProcessing(true); // Set processing to true when image upload starts
    const formData = new FormData();
    formData.append('imageTP', image);
    const userId = localStorage.getItem('userid');

    try {
      const response = await fetch(`https://192.168.1.194:5000/uploadToPy/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const resultData = await response.json();
        console.log('Result from model:', resultData);
        setResult(resultData); // Store the result in the state
      } else {
        console.error('Error uploading image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsProcessing(false); // Set processing to false when done
    }
  };

  return (
    <div className='min-h-screen'>
      <form onSubmit={handleSubmit} className='space-x-4'>
        <input type="file" onChange={handleImageChange} />
        <button type="submit" className='bg-blue-400 px-3'>Upload Image</button>
      </form>

      {isProcessing && (
        <Box mt={4} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress /> {/* Processing indicator */}
          <Typography variant="body1" ml={2}>Processing...</Typography>
        </Box>
      )}

      {result && !isProcessing && (
        <Box mt={4} p={2} border="1px solid gray" borderRadius="8px">
          <Typography variant="h6">Posture Analysis Result:</Typography>
          <Typography variant="body1">Angle: {result.angle}°</Typography>
          <Typography variant="body1">Angle Difference: {result.angleres}°</Typography>
          <Typography variant="body1">Postural Condition: {result.angleresR}</Typography>
          <Typography variant="body1">Level: {result.LevelR}</Typography>
        </Box>
      )}
    </div>
  );
}

export default AnalyzePython;

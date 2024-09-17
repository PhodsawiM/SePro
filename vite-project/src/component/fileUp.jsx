// FileUpload.js
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './fileUp.css'
const FileUpload = () => {
  // Callback function to handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the dropped files here
    console.log(acceptedFiles);
    // You can upload files or process them as needed
  }, []);

  // Configure the dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept only image files, adjust as needed
  });

  return (
    <div
      {...getRootProps()}
    //   style={{
    //     minHeight:'100vh',
    //     width:'100%',
    //     border: '2px dashed #ccc',
    //     padding: '20px',
    //     textAlign: 'center',
    //     cursor: 'pointer',
    //     borderRadius:'30px',
    //     // display:'flex',

    //   }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag & drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileUpload;

import React from 'react'
import './uploadtext.css'
import FileUpload from './component/fileUp'
function Uploadtext() {
  return (
    <div style={{'width':'100%','minHeight':'700px'}}>
        <h1>Upload new text file</h1>
        <div className='UploadBox'>
            <FileUpload>
            </FileUpload>
        </div>

    </div>
  )
}

export default Uploadtext
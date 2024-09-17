import React from 'react'
import './changelocation.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField, IconButton, InputAdornment,Typography } from '@mui/material';
import Button from '@mui/joy/Button';
import { Margin } from '@mui/icons-material';
function Changelocation() {
  
  return (
    <div style={{'minHeight':'700px','width':'100%'}}>
      <div>
        <h1>
            Changelocation
        </h1>
        <div >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
            <TextField
            className='LinkInput'
            type='link'
            label="Link"
            sx={{
              width: '80%',
              textAlign:'center',
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px', // Adjust the border radius here
              },
            }}
            // value={valueName}
            // onChange={(newValName) => setValueName(newValName.target.value)}
            ></TextField>
            </div>
            <div>
             <Button
             sx={{
               width:'60%'
             }}>Submit</Button>
            </div>
         
          </LocalizationProvider>
        </div>
      </div>
    </div>
  )
}

export default Changelocation
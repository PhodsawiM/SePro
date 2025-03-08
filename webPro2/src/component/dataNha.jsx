import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
function dataNha({children}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker name={children} />
    </LocalizationProvider>
  )
}

export default dataNha
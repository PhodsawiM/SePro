import * as React from 'react';
import {useState,useEffect} from 'react';
// import '@fontsource/roboto/300.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BoxMain from './component/BoxMain';
import { TextField, IconButton, InputAdornment,Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from '@mui/material/Button';
// import {SubmitBTN} from './component/MyComponent'
import BoxContainer from './component/BoxContainer';
import './login.css'
import IRight from './assets/right.svg'
import ILeft from './assets/left.svg'
// import dayjs from 'dayjs';
function Login() {
    const [valueDate, setValueDate] = useState(null);
    const [valueName, setValueName] = useState('');
    const [valuePassword, setValuePassword] = useState('');
    const [valueEmail, setValueEmail] = useState('');
    const [btnValuesNha, setbtnValuseNha] = useState('Signin')
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    const handleSelectDate = (newDate)=>{
    setValue(newDate);
    console.log(newDate.format("DD-MM-YYYY"))
 }
//     const handleChange = (event) => {
//     setValue2(event.target.value);
//   };
    const handleSubmitLog = ()=>{
        
    }
    const handleSubmitSign = ()=>{

    }
    const onChangeNha = ()=>{

    }
    const [isAnimated, setIsAnimated] = useState(false);

    const handleAnimation = () => {
      setIsAnimated(!isAnimated);
      if(btnValuesNha === 'Signin'){
        setbtnValuseNha('Login')
      } else{
        setbtnValuseNha("Signin")
      }
    };
  return (
    <BoxContainer >
        <div className='JustBox'>
            <BoxMain>
                <div className='containerLog'>
                    <div className={`LogTop ${isAnimated ? 'Left' : 'Right'}`}>
                        <div className='blockOne'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <h1> Loging</h1>
                                <div className='subContent'>
                                    
                                    <TextField
                                        label="Usermane"
                                        value={valueName}
                                        onChange={(newValNameLog) => setValueName(newValNameLog.target.value)}
                                    >
                                    </TextField>
                                    <TextField
                                        type={showPassword ? 'text' : 'password'}
                                        label="Password"
                                        value={valuePassword}
                                        onChange={(newValPasswordLog) => setValuePassword(newValPasswordLog.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={handleClickShowPassword}
                                                  onMouseDown={handleMouseDownPassword}
                                                  edge="end"
                                                  >
                                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                              </InputAdornment>
                                            ),
                                          }}
                                    >
                                    </TextField>

                                    <Button
                                        style={{"backgroundColor":"rgb(68, 138, 204)","color":'white'}}
                                        onClick={handleSubmitLog}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </LocalizationProvider>
                        {/* <h1>{value ? value.format('DD-MM-YYYY') : "just select some date"}</h1> */}
                        </div>

                        <div className='blockTwo'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <h1> Sign</h1>
                                <div className='subContent'>
                                    
                                    <TextField
                                        type='name'
                                        label="Usermane"
                                        value={valueName}
                                        onChange={(newValName) => setValueName(newValName.target.value)}
                                    >
                                    </TextField>
                                    <TextField
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={valuePassword}
                                        onChange={(newValPassword) => setValuePassword(newValPassword.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={handleClickShowPassword}
                                                  onMouseDown={handleMouseDownPassword}
                                                  edge="end"
                                                  >
                                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                              </InputAdornment>
                                            ),
                                          }}
                                    >
                                    </TextField>
                                    <TextField
                                        type='email'
                                        label="Email"
                                        value={valueEmail}
                                        onChange={(newValEmail) => setValueEmail(newValEmail.target.value)}
                                    >
                                    </TextField>

                                    <DatePicker                                 
                                        label="Date of birt"
                                        // defaultValue={"null"}
                                        value={valueDate}
                                        onChange={(newValDate) => setValueDate(newValDate)}
                                        
                                        >
                                    </DatePicker>

                                    <Button
                                        style={{"backgroundColor":"rgb(68, 138, 204)","color":'white'}}
                                        onClick={handleSubmitLog}
                                    >
                                        Submit
                                    </Button>
                                </div>
                                {/* <div>{value2}</div> */}
                            </LocalizationProvider>
                        {/* <h1>{value ? value.format('DD-MM-YYYY') : "just select some date"}</h1> */}
                        </div>
                    </div>

                    <div className={`LogBot ${isAnimated ? 'Left2' : 'Right2'}`}>
                        <div className='blockOne'>
                            <h1>{btnValuesNha}</h1>
                            <p>Don't you have an acount yet? all right let create your acount now!</p>
                            
                                {/* <Button
                                    style={{'backgroundColor':'#85c1e9',"marginTop":"50%","color":'white'}}
                                    onClick={handleAnimation}
                                    >
                                    {btnValuesNha}
                                </Button> */}
                                <a onClick={handleAnimation} style={{ cursor: 'pointer' }}>
                                    <img src={ILeft} width={70} alt="" />
                                </a>
                        </div>
                        <div className='blockTwo'>
                            <h1>Login</h1>
                            <p>if you have an acount click login button to Login</p>

                                {/* <Button
                                    style={{'backgroundColor':'#85c1e9',"marginTop":"50%","color":'white'}}
                                    onClick={handleAnimation}
                                    >
                                    {btnValuesNha}
                                </Button> */}
                                <a onClick={handleAnimation} style={{ cursor: 'pointer' }}>
                                    <img src={ILeft} width={70} alt="" />
                                </a>
                        </div>
                    </div>
                </div>
            </BoxMain>
        </div>
    </BoxContainer>
  )
}

export {Login}
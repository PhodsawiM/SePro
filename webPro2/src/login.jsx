import * as React from 'react';
import {useState,useEffect,useContext} from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BoxMain from './component/BoxMain';
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton, InputAdornment,Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from '@mui/material/Button';
// import {SubmitBTN} from './component/MyComponent'
import BoxContainer from './component/BoxContainer';
import axios from 'axios';
import {useUser} from './context/UserContext.jsx';
import './login.css'
import IRight from './assets/right.svg'
import ILeft from './assets/left.svg'
// const axiosInstance = axios.create({
//   baseURL: 'https://192.168.1.194:5000'
// });
import { GlobalContext } from "./context/GlobalContext";
// const ip = import.meta.env.VITE_API_URL;
function Login() {
    const { ip, setGlobalVariable } = useContext(GlobalContext);
    const { setUsername } = useUser();
    const [valueDate, setValueDate] = useState(null);
    const [valueName, setValueName] = useState('');
    const [valuePassword, setValuePassword] = useState('');
    const [valueEmail, setValueEmail] = useState('');
    const [btnValuesNha, setbtnValuseNha] = useState('สมัครสมาชิก')
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleClickShowPassword = () => {

        setShowPassword((prev) => !prev);
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    const handleSelectDate = (newDate)=>{
    setUsername(newDate);
    console.log(newDate.format("DD-MM-YYYY"))
 }
const handleLogin = async () => {
    const loginData = {
        username: valueName,
        password: valuePassword,
    };

    try {
        const response = await axios.post(`https://${ip}:5000/login/`, loginData);
        const { token,id , username ,role} = response.data;
        localStorage.setItem('token',token);
        localStorage.setItem('userid', id);
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);
        console.log(response.data);
        setUsername(valueName)
        navigate('/home');
        if (response.status === 200) {
            window.location.reload();
          }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError('Invalid credentials'); 
        } else if (error.response && error.response.status === 404) {
            setError('User not found');
        } else {
            setError('An error occurred during login');
        }
    }
}
const handleSubmitSignUp = async () => {
  const signupData = {
    username: valueName,
    password: valuePassword,
    email: valueEmail,
    dateOfBirth:valueDate.format('YYYY-MM-DD'),
    };
  try {
    const response = await axios.post(`https://${ip}:5000/register/`, signupData);
    if (response.status === 201){
        window.location.reload();
        console.log('success')
    }
    if(response.status === 400){
        console.log(response)
        alert(response.data.msg);
    }
    } catch (response) {
        console.log(response.response.data.msg)
        alert(response.response.data.msg)
    }
};

    const [isAnimated, setIsAnimated] = useState(false);
    const handleAnimation = () => {
      setIsAnimated(!isAnimated);
      if(btnValuesNha === 'สมัครสมาชิก'){
        setbtnValuseNha('เข้าสู่ระบบ')
      } else{
        setbtnValuseNha("สมัครสมาชิก")
      }
    };
  return (
    <BoxContainer>
        <div className='JustBox '>
            <BoxMain className="">
                <div className='containerLog '>
                    <div className={`LogTop ${isAnimated ? 'Left' : 'Right'}`}>
                        <div className='blockOne'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <h1 className='text-3xl text-white'> เข้าสู่ระบบ</h1>
                                <div className='subContent'>  
                                    <TextField
                                        label="ชื่อผู้ใช้"
                                        value={valueName}
                                        onChange={(newValNameLog) => setValueName(newValNameLog.target.value)}
                                    >
                                    </TextField>
                                    <TextField
                                        type={showPassword ? 'text' : 'password'}
                                        label="รหัสผ่าน"
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
                                        onClick={handleLogin}
                                    >
                                        ยืนยัน
                                    </Button>
                                </div>
                            </LocalizationProvider>
                        </div>

                        <div className='blockTwo'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <h1 className='text-3xl text-white'> สมัครสมาชิก</h1>
                                <div className='subContent'>
                                    
                                    <TextField
                                        type='name'
                                        label="ชื่อผู้ใช้"
                                        value={valueName}
                                        onChange={(newValName) => setValueName(newValName.target.value)}
                                    >
                                    </TextField>
                                    <TextField
                                        label="รหัสผ่าน"
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
                                        label="อีเมล"
                                        value={valueEmail}
                                        onChange={(newValEmail) => setValueEmail(newValEmail.target.value)}
                                    >
                                    </TextField>

                                    <DatePicker                                 
                                        label="วันเกิด"
                                        value={valueDate}
                                        onChange={(newValDate) => setValueDate(newValDate)}
                                        
                                        >
                                    </DatePicker>

                                    <Button
                                        style={{"backgroundColor":"rgb(68, 138, 204)","color":'white'}}
                                        onClick={handleSubmitSignUp}
                                    >
                                        ยืนยัน
                                    </Button>
                                    {/* <div>{valueEmail}{valueEmail} {valueDate ? valueDate.format('YYYY-MM-DD') : 'No Date Selected'}</div> */}
                                </div>
                            </LocalizationProvider>
                        </div>
                    </div>

                    <div className={`LogBot ${isAnimated ? 'Left2' : 'Right2'}`}>
                        <div className='blockOne space-y-4'>
                            <h1 className='text-3xl'>{btnValuesNha}</h1>
                            <p>ยังไม่มียันชีใช่หรือไม่สามารถสมัครได้ตรงนี้เลย !!!</p>
                                <a onClick={handleAnimation} className='cursor-pointer flex justify-center'>
                                    <img src={ILeft} width={70} alt="" />
                                </a>
                        </div>
                        <div className='blockTwo space-y-4'>
                            <h1 className='text-3xl'>เข้าสู่ระบบ</h1>
                            <p>ถ้าหากมีบัญชีอยู่แล้วสามารถเข้าสู่ระบบได้ที่นี่เลย</p>
                                <a onClick={handleAnimation} className='cursor-pointer flex justify-center'>
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



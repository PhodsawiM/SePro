import React from 'react'
import './dash.css'
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
function Dash() {
  // function getRandomInt(max) {
  //   return Math.floor(Math.random() * max);
  // }
  const subItem = <div className='fodisItem'><input type="checkbox" /><p>username</p><div>phodsawi.ma.65@ubu.ac.th</div><div>15/06/2023</div><div>level 0</div><div className='setBTN'><button>View</button><button>Delete</button></div></div>
  function ranDom (len){
    let dataArr = [];
    for (let i = 0; i<=len; i++){
      let newValue = Math.floor(Math.random())
      dataArr.push(newValue);
    }
    console.log(dataArr)
    return dataArr;
  }
  function range(start, end) {
    let ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    console.log(ans)
    return ans;
}
  return (
    <div style={{'minHeight':'700px','width':'100%'}}>
      
        <h1>Dash</h1>
        <div className='graphBox'>
          <LineChart
            xAxis={[{ data: [1,2,3,4,5,6,7,8,9,10] }]}
            series={[
              {
                data: [10,20,30,10,20,30,90,70,80,50],
              },
            ]}
            width={500}
            height={300}
          />
          <div className='sib_of_dash'>
            <div> 
              <h2>
                MainBox
              </h2>
            </div>
            <div className='user_display'>
              <div className='SSBOXcontainer'>
                {subItem}
                {subItem}
                {subItem}
                {subItem}
                {subItem}
                {subItem}
                {subItem}
                {subItem}
                {subItem}
                {subItem}
                {subItem}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Dash
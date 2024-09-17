import './history.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios'
function History() {
  // const HisiTem = <div className='HisItem'>dasdas</div>

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/userData')
      .then((response) => {
        setData(response.data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        if (error.response) {
          // The request was made, and the server responded with a status code that falls out of the range of 2xx
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made, but no response was received
          console.log('Request data:', error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.log('Error message:', error.message);
        }
        setError('Error fetching data'); // Set a user-friendly error message
        setLoading(false); // Stop loading
      });
  }, []);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{'width':'100%','minHeight':'700px'}} className='HisBoxBo'> 
        <div><h1>History</h1></div>
        <div className='HisBox'>
            {data.map((item) => (
              <div key={item.id} className='HisItem'>
                <h2>{item.name}</h2>
                <p>{item.city}</p>
              </div>
            ))}
        </div>
    </div>
  )
}

export default History
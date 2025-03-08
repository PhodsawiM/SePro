import React, { useState } from 'react';

function Blackpage() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value); // Update state with input value
  };

  return (
    <div className="p-4 min-h-screen">
      <label htmlFor="inputField" className="block text-gray-700 mb-2">Enter text:</label>
      <input
        id="inputField"
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded mb-4 w-full"
      />
      <p className="text-blue-600">{inputValue}</p>
    </div>
  );
}

export default Blackpage;

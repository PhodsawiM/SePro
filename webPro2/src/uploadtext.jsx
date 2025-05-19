import React, { useState,useContext } from "react";
import axios from "axios";
import Papa from "papaparse";  // For parsing CSV
import { GlobalContext } from "./context/GlobalContext";
function Uploadtext() {
  const { ip, setGlobalVariable } = useContext(GlobalContext);
  const [csvFile, setCsvFile] = useState(null);
const handleFileChange = (e) => {
  setCsvFile(e.target.files[0]);
};

const handleFileUpload = async () => {
  if (!csvFile) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const csvData = reader.result;
    const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    try {
      await axios.post(`https://${ip}:5000/upload-csv`, parsedData.data);
      alert("Data uploaded successfully!");
    } catch (error) {
      alert("Error uploading data.");
    }
  };
  reader.readAsText(csvFile);
};
  return (
      <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-purple-950 to-blue-900  animate-gradient-x `}
      >
      <div className="text-5xl text-white">
        เพิ่มคำต้องห้ามในการตั้งชื่อ
      </div>
      <div>
        <div className="bg-blue-300 rounded-lg p-[20px]">
          <input type="file" onChange={handleFileChange} />
          <button className="bg-white rounded-lg p-2" onClick={handleFileUpload}>อัปโหลด</button>
        </div>
        {/* <div className="bg-blue-300 w-full rounded-lg p-[20px]">
          <input type="text" />
          <button className="bg-white rounded-lg p-2" onClick={handleFileUpload}>อัปโหลด</button>
        </div> */}
      </div>
    </div>
  );
}
export default Uploadtext;

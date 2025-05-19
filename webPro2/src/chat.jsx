import React, { useState, useEffect ,useContext} from "react";
import axios from "axios";
import { GlobalContext } from "./context/GlobalContext";
import MyIcon from './assets/user.svg'
import { div } from "@tensorflow/tfjs-core";
const PostWall = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState("");
  const { ip } = useContext(GlobalContext);
  const userId = localStorage.getItem("userid");

const fetchPosts = async () => {
  const res = await axios.get(`https://${ip}:5000/api/posts`);
  setPosts(res.data);
  const ress = await axios.get(`https://${ip}:5000/user/${userId}`);
  setUsername(ress.data.user.username);
  setImages(ress.data.image.imagePath);
};
const handlePost = async () => {
  if (!content.trim()) return;
  try {
    const res = await axios.post(`https://${ip}:5000/api/post`, {
      username,
      content,
      userId: userId,
      imagePath: images,
    });
    setContent("");
    fetchPosts();
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchPosts();
  const intervalId = setInterval(() => {
    fetchPosts();
  }, 3000);
  return () => clearInterval(intervalId);
}, []);

  return (
    <div className="flex bg-gray-800">
      <div className=" w-9/12 bg-white shadow rounded">
        <div className="flex flex-col max-h-[500px] overflow-y-auto space-y-2 pr-2">
          {posts
            .filter((post) => post.content && post.content.trim() !== "")
            .map((post) => (
              <div key={post._id} className="flex border-b py-2 justify-between px-5">
                {post.imagePath != null?
                <div className="flex flex-col items-center">
                  <p className="font-bold">{post.username}</p>
                  <div className='md:w-15 w-20 shadow-2xl rounded-full aspect-square overflow-hidden'>
    
                    <img
                    className="bg-black rounded-full w-full h-full object-cover"
                      src={`https://${ip}:5000/${post.imagePath}`}
                    >
                    </img>
                  </div>      
                    <p className="flex justify-end text-xs text-gray-500">
                      {new Date(post.timestamp).toLocaleString()}
                    </p>  
                </div>
                :
                <div className="flex flex-col items-center">
                  <p className="font-bold">{post.username}</p>
                  <div className='md:w-15 w-20 shadow-2xl rounded-full aspect-square overflow-hidden'>

                    <img
                    className="bg-black rounded-full w-full h-full object-cover"
                      src={MyIcon}
                    >
                    </img>
                  </div> 
                                        <p className="flex justify-end text-xs text-gray-500">
                      {new Date(post.timestamp).toLocaleString()}
                    </p>
                </div>
                }
                  <div className="flex flex-col  justify-center w-full items-end">

                    <p className="text-right text-2xl">ความคิดเห็น</p>
                    <p className="text-right rounded-lg border-solid border-2 w-full text-gray-500 p-3 max-w-[600px]">{post.content}</p>
                  </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col justify-between mx-auto ">
        <h1 className="text-3xl text-white font-bold mt-5">📃 กระดานโพสต์</h1>
        <div className="bg-gray-500 w-full h-full flex items-center justify-center m-5 mx-auto rounded-lg">
          ADS
        </div>
        <div className="mb-4 ">
          <textarea
            className="w-full border p-2"
            placeholder="คุณกำลังคิดอะไรอยู่?"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={handlePost}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            โพสต์
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostWall;

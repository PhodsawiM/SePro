import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { UserProvider } from './context/UserContext.jsx';
// import { IPProvider } from './IPContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <script src="https://cdn.jsdelivr.net/npm/@pytorch/pytorch@latest/dist/pytorch.min.js"></script>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)

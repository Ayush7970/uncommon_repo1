import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/newUser.css'
import App from './newUser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

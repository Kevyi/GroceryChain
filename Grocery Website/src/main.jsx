import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import NavbarTop from './components/NavbarTop.jsx'

//Uses index.css as main css file unless more specificity was added into other jsx files.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavbarTop></NavbarTop>
    <App/>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// checkout this post for why this additional import
// https://stackoverflow.com/questions/71008574/react-map-gl-marker-is-moving-when-zooming-the-map
import 'mapbox-gl/dist/mapbox-gl.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)


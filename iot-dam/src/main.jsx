import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <p>Bonuedie Ezra</p>
            <p>Boamah Samuel</p>
            <p>DESIGN AND IMPLEMENTATION OF AN IoT BASED REAL-TIME MONITORING AND EARLY WARNING SYSTEMS FOR IRRIGATION DAM</p>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2023 All Rights Reserved</p>
      </div>
    </footer>
  </React.StrictMode>,
)
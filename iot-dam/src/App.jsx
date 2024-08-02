import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [sensorVals, setSensorVals] = useState({
    temperature: { value: null, unit: "°C", icon: "temperature", threshold: 26 },
    turbidity: { value: null, unit: "NTU", icon: "turbidity", threshold: 3 },
    tankLevel: { value: null, unit: "%", icon: "water", maxThreshold: 95, minThreshold: 60 },
    canalLevel: { value: null, unit: "%", icon: "water", maxThreshold: 80, minThreshold: 60 },
    moistLevel: { value: null, unit: "%", icon: "moist", maxThreshold: 80, minThreshold: 60 },
  });

  const getSensorValues = async () => {
    try {
      const response = await fetch("https://api.waziup.io/api/v2/devices/IoT_Dam/sensors");
      const data = await response.json();

      const sensorData = {
        temperature: data.find(sensor => sensor.id === "TC"),
        turbidity: data.find(sensor => sensor.id === "TB"),
        tankLevel: data.find(sensor => sensor.id === "TL"),
        canalLevel: data.find(sensor => sensor.id === "CL"),
        moistLevel: data.find(sensor => sensor.id === "SM"),
      };

      setSensorVals(prevState => ({
        temperature: { ...prevState.temperature, value: sensorData.temperature.value.value },
        turbidity: { ...prevState.turbidity, value: sensorData.turbidity.value.value },
        tankLevel: { ...prevState.tankLevel, value: sensorData.tankLevel.value.value },
        canalLevel: { ...prevState.canalLevel, value: sensorData.canalLevel.value.value },
        moistLevel: { ...prevState.moistLevel, value: sensorData.moistLevel.value.value },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSensorValues();
    const interval = setInterval(getSensorValues, 2000); // Update every 2 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const checkThreshold = (sensor, isLevel = false) => {
    if (isLevel) {
      return (
        sensor.value !== null &&
        (sensor.value > sensor.maxThreshold || sensor.value < sensor.minThreshold)
      );
    }
    return sensor.value !== null && sensor.value > sensor.threshold;
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center">IoT Irrigation Dam Monitoring System</h1>
        <ul className="text-center">
          <li>Threshold for turbidity = 3 NTU</li>
          <li>Max Threshold for canal = 80%</li>
          <li>Min Threshold for canal = 60%</li>
          <li>Max Threshold for dam = 95%</li>
          <li>Max Threshold for dam = 95%</li>
        </ul>
        <div className="row">
          {/* Temperature Sensor */}
          <div className="col-md-3">
            <div className={`card ${checkThreshold(sensorVals.temperature) ? "bg-danger" : ""}`}>
              <div className="card-body">
                <h2 className="card-title">Temperature</h2>
                <p className="card-text">
                  {sensorVals.temperature.value !== null
                    ? `${sensorVals.temperature.value} ${sensorVals.temperature.unit}`
                    : "---"}
                </p>
                <p className="card-subtext">
                  <i className={`icon-${sensorVals.temperature.icon}`}></i>
                </p>
                {checkThreshold(sensorVals.temperature) && <p className="alert">Threshold breached!</p>}
              </div>
            </div>
          </div>

          {/* Turbidity Sensor */}
          <div className="col-md-3">
            <div className={`card ${checkThreshold(sensorVals.turbidity) ? "bg-danger" : ""}`}>
              <div className="card-body">
                <h2 className="card-title">Turbidity</h2>
                <p className="card-text">
                  {sensorVals.turbidity.value !== null
                    ? `${sensorVals.turbidity.value} ${sensorVals.turbidity.unit}`
                    : "---"}
                </p>
                <p className="card-subtext">
                  <i className={`icon-${sensorVals.turbidity.icon}`}></i>
                </p>
                {checkThreshold(sensorVals.turbidity) && <p className="alert">Threshold breached!</p>}
              </div>
            </div>
          </div>

          {/* Tank Level Sensor */}
          <div className="col-md-3">
            <div className={`card ${checkThreshold(sensorVals.tankLevel, true) ? "bg-danger" : ""}`}>
              <div className="card-body">
                <h2 className="card-title">Tank Level</h2>
                <p className="card-text">
                  {sensorVals.tankLevel.value !== null
                    ? `${sensorVals.tankLevel.value} ${sensorVals.tankLevel.unit}`
                    : "---"}
                </p>
                <p className="card-subtext">
                  <i className={`icon-${sensorVals.tankLevel.icon}`}></i>
                </p>
                {checkThreshold(sensorVals.tankLevel, true) && <p className="alert">Threshold breached!</p>}
              </div>
            </div>
          </div>

          {/* Canal Level Sensor */}
          <div className="col-md-3">
            <div className={`card ${checkThreshold(sensorVals.canalLevel, true) ? "bg-danger" : ""}`}>
              <div className="card-body">
                <h2 className="card-title">Canal Level</h2>
                <p className="card-text">
                  {sensorVals.canalLevel.value !== null
                    ? `${sensorVals.canalLevel.value} ${sensorVals.canalLevel.unit}`
                    : "---"}
                </p>
                <p className="card-subtext">
                  <i className={`icon-${sensorVals.canalLevel.icon}`}></i>
                </p>
                {checkThreshold(sensorVals.canalLevel, true) && <p className="alert">Threshold breached!</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Moist Level Sensor */}
      <div className="col-md-3">
            <div className={`card ${checkThreshold(sensorVals.moistLevel, true) ? "bg-danger" : ""}`}>
              <div className="card-body">
                <h2 className="card-title">Tank Level</h2>
                <p className="card-text">
                  {sensorVals.moistLevel.value !== null
                    ? `${sensorVals.moistLevel.value} ${sensorVals.moistLevel.unit}`
                    : "---"}
                </p>
                <p className="card-subtext">
                  <i className={`icon-${sensorVals.moistLevel.icon}`}></i>
                </p>
                {checkThreshold(sensorVals.moistLevel, true) && <p className="alert">Threshold breached!</p>}
              </div>
            </div>
          </div>
      <footer className="footer">
        <p>Bonuedie Ezra</p>
        <p>Boamah Samuel</p>
        <p>DESIGN AND IMPLEMENTATION OF AN IoT BASED REAL-TIME MONITORING AND EARLY WARNING SYSTEMS FOR IRRIGATION DAM</p>
      </footer>
    </div>
  );
}

export default App;

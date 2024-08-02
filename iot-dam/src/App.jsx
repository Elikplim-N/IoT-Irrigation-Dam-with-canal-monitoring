import React, { useState, useEffect } from "react";
import "./App.css";
import { debounce } from "lodash";

function App() {
  const [sensorVals, setSensorVals] = useState({
    temperature: { value: null, unit: "°C", icon: "temperature", threshold: 26 },
    turbidity: { value: null, unit: "NTU", icon: "turbidity", threshold: 3 },
    tankLevel: { value: null, unit: "%", icon: "water", maxThreshold: 95, minThreshold: 60 },
    canalLevel: { value: null, unit: "%", icon: "water", maxThreshold: 80, minThreshold: 60 },
    soilMoisture: { value: null, unit: "%", icon: "soil", threshold: 30 }
  });

  const [error, setError] = useState(null);

  const getSensorValues = async () => {
    const cachedData = sessionStorage.getItem("sensorData");
    if (cachedData) {
      setSensorVals(JSON.parse(cachedData));
      return;
    }

    try {
      const response = await fetch("https://api.waziup.io/api/v2/devices/IoT_Dam/sensors");
      if (!response.ok) {
        throw new Error("Failed to fetch sensor data");
      }

      const data = await response.json();
      sessionStorage.setItem("sensorData", JSON.stringify(data));

      const sensorData = {
        temperature: data.find(sensor => sensor.id === "TC"),
        turbidity: data.find(sensor => sensor.id === "TB"),
        tankLevel: data.find(sensor => sensor.id === "TL"),
        canalLevel: data.find(sensor => sensor.id === "CL"),
        soilMoisture: data.find(sensor => sensor.id === "SM")
      };

      setSensorVals(prevState => ({
        temperature: { ...prevState.temperature, value: sensorData.temperature?.value?.value || "---" },
        turbidity: { ...prevState.turbidity, value: sensorData.turbidity?.value?.value || "---" },
        tankLevel: { ...prevState.tankLevel, value: sensorData.tankLevel?.value?.value || "---" },
        canalLevel: { ...prevState.canalLevel, value: sensorData.canalLevel?.value?.value || "---" },
        soilMoisture: { ...prevState.soilMoisture, value: sensorData.soilMoisture?.value?.value || "---" }
      }));
    } catch (error) {
      console.log(error);
      setError("Error fetching sensor data");
    }
  };

  const debouncedGetSensorValues = debounce(getSensorValues, 5000); // Debounce by 5 seconds

  useEffect(() => {
    debouncedGetSensorValues();
    const interval = setInterval(debouncedGetSensorValues, 10000); // Update every 10 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [debouncedGetSensorValues]);

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
        {error && <div className="alert alert-danger">{error}</div>}
        <ul className="text-center">
          <li>Threshold for turbidity = 3 NTU</li>
          <li>Max Threshold for canal = 80%</li>
          <li>Min Threshold for canal = 60%</li>
          <li>Max Threshold for tank = 95%</li>
          <li>Min Threshold for tank = 60%</li>
          <li>Threshold for soil moisture = 30%</li>
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

          {/* Soil Moisture Sensor */}
          <div className="col-md-3">
            <div className={`card ${checkThreshold(sensorVals.soilMoisture) ? "bg-danger" : ""}`}>
              <div className="card-body">
                <h2 className="card-title">Soil Moisture</h2>
                <p className="card-text">
                  {sensorVals.soilMoisture.value !== null
                    ? `${sensorVals.soilMoisture.value} ${sensorVals.soilMoisture.unit}`
                    : "---"}
                </p>
                <p className="card-subtext">
                  <i className={`icon-${sensorVals.soilMoisture.icon}`}></i>
                </p>
                {checkThreshold(sensorVals.soilMoisture) && <p className="alert">Threshold breached!</p>}
              </div>
            </div>
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

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [sensorVals, setSensorVals] = useState({
    temperature: { value: null, unit: "°C", icon: "temperature" },
    turbidity: { value: null, unit: "NTU", icon: "turbidity" },
    tankLevel: { value: null, unit: "%", icon: "water" },
    canalLevel: { value: null, unit: "%", icon: "water" },
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
      };

      setSensorVals({
        temperature: { value: sensorData.temperature.value.value, unit: "°C", icon: "temperature" },
        turbidity: { value: sensorData.turbidity.value.value, unit: "NTU", icon: "turbidity" },
        tankLevel: { value: sensorData.tankLevel.value.value, unit: "%", icon: "water" },
        canalLevel: { value: sensorData.canalLevel.value.value, unit: "%", icon: "water" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSensorValues();
    const interval = setInterval(getSensorValues, 10000); // Update every 10 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center">Water Monitoring System</h1>
        <div className="row">
          {/* Temperature Sensor */}
          <div className="col-md-3">
            <div className="card">
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
              </div>
            </div>
          </div>

          {/* Turbidity Sensor */}
          <div className="col-md-3">
            <div className="card">
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
              </div>
            </div>
          </div>

          {/* Tank Level Sensor */}
          <div className="col-md-3">
            <div className="card">
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
              </div>
            </div>
          </div>

          {/* Canal Level Sensor */}
          <div className="col-md-3">
            <div className="card">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>Bonuedie Ezra</p>
        <p>Boamah Samuel</p>
        <p>© 2024 IoT Irrigation Dam Monitoring System</p>
      </footer>
    </div>
  );
}

export default App;

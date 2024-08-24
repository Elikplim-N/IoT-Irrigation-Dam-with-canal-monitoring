import React, { useState, useEffect } from "react";

function App() {
  const [sensorVals, setSensorVals] = useState({
    temperature: { value: null, unit: "°C", icon: "temperature", threshold: 26 },
    turbidity: { value: null, unit: "NTU", icon: "turbidity", threshold: 3 },
    tankLevel: { value: null, unit: "%", icon: "water", maxThreshold: 95, minThreshold: 60 },
    canalLevel: { value: null, unit: "%", icon: "water", maxThreshold: 80, minThreshold: 60 },
    humidity: { value: null, unit: "%", icon: "humidity", threshold: 40 }
  });

  const getSensorValues = async () => {
    try {
      const response = await fetch("https://api.waziup.io/api/v2/devices/IoT_Dam/sensors");
      const data = await response.json();
      console.log(data);

      const sensorData = {
        temperature: data.find(sensor => sensor.id === "TC"),
        turbidity: data.find(sensor => sensor.id === "TB"),
        tankLevel: data.find(sensor => sensor.id === "TL"),
        canalLevel: data.find(sensor => sensor.id === "CL"),
        humidity: data.find(sensor => sensor.id === "SM")
      };

      setSensorVals(prevState => ({
        temperature: { ...prevState.temperature, value: sensorData.temperature.value.value },
        turbidity: { ...prevState.turbidity, value: sensorData.turbidity.value.value },
        tankLevel: { ...prevState.tankLevel, value: sensorData.tankLevel.value.value },
        canalLevel: { ...prevState.canalLevel, value: sensorData.canalLevel.value.value },
        humidity: { ...prevState.humidity, value: sensorData.humidity.value.value }
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
      <h2> IoT Irrigation Dam  Monitoring System</h2>
      <div className="container">
        <h1 className="text-center text-primary mb-4">IoT Irrigation Dam Monitoring System</h1>
        <ol className="text-center mb-4" >
          <li>Threshold for turbidity = 3 NTU</li>
          <li>Max Threshold for canal = 80%</li>
          <li>Min Threshold for canal = 60%</li>
          <li>Max Threshold for dam = 95%</li>
          <li>Min Threshold for dam = 60%</li>
        </ol>
        <div className="row">
          {Object.keys(sensorVals).map((sensorKey) => {
            const sensor = sensorVals[sensorKey];
            const isLevelSensor = sensorKey === "tankLevel" || sensorKey === "canalLevel";
            const alertClass = checkThreshold(sensor, isLevelSensor) ? "bg-danger" : "";
            return (
              <div key={sensorKey} className="col-md-3">
                <div className={`card ${alertClass}`}>
                  <div className="card-body">
                    <h3 className="card-title">{sensorKey === "humidity" ? "Soil Moisture" : sensorKey.charAt(0).toUpperCase() + sensorKey.slice(1)}</h3>
                    <p className="card-text">{sensor.value !== null ? `${sensor.value} ${sensor.unit}` : "---"}</p>
                    <p className="card-subtext"><i className={`icon-${sensor.icon}`}></i></p>
                    {checkThreshold(sensor, isLevelSensor) && <p className="alert">Threshold breached!</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 IoT Irrigation Dam  Monitoring System</p>
      </footer>
    </div>
  );
}

export default App;

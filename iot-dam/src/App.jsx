import React, { useState, useEffect } from "react";

function App() {
  const [sensorVals, setSensorVals] = useState({
    temperature: { value: null, unit: "°C", icon: "temperature", threshold: 26 },
    turbidity: { value: null, unit: "NTU", icon: "turbidity", threshold: 3 },
    tankLevel: { value: null, unit: "%", icon: "water", maxThreshold: 95, minThreshold: 60 },
    canalLevel: { value: null, unit: "%", icon: "water", maxThreshold: 80, minThreshold: 60 },
    humidity: { value: null, unit: "%", icon: "humidity", threshold: 60 }
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
    <div className="lg:flex lg:items-center lg:justify-between p-4">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
          IoT Irrigation Dam Monitoring System
        </h2>
        <ul className="text-center mb-4">
          <li>Threshold for turbidity = 3 NTU</li>
          <li>Max Threshold for canal = 80%</li>
          <li>Min Threshold for canal = 60%</li>
          <li>Max Threshold for dam = 95%</li>
          <li>Min Threshold for dam = 60%</li>
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Temperature Sensor */}
          <div className={`p-4 border rounded ${checkThreshold(sensorVals.temperature) ? "bg-red-500 text-white" : "bg-white"}`}>
            <div className="text-center">
              <h3 className="text-lg font-bold">Temperature</h3>
              <p className="text-2xl">{sensorVals.temperature.value !== null ? `${sensorVals.temperature.value} ${sensorVals.temperature.unit}` : "---"}</p>
              <p className="text-sm"><i className={`icon-${sensorVals.temperature.icon}`}></i></p>
              {checkThreshold(sensorVals.temperature) && <p className="mt-2 text-sm">Threshold breached!</p>}
            </div>
          </div>

          {/* Turbidity Sensor */}
          <div className={`p-4 border rounded ${checkThreshold(sensorVals.turbidity) ? "bg-red-500 text-white" : "bg-white"}`}>
            <div className="text-center">
              <h3 className="text-lg font-bold">Turbidity</h3>
              <p className="text-2xl">{sensorVals.turbidity.value !== null ? `${sensorVals.turbidity.value} ${sensorVals.turbidity.unit}` : "---"}</p>
              <p className="text-sm"><i className={`icon-${sensorVals.turbidity.icon}`}></i></p>
              {checkThreshold(sensorVals.turbidity) && <p className="mt-2 text-sm">Threshold breached!</p>}
            </div>
          </div>

          {/* Tank Level Sensor */}
          <div className="block rounded-lg bg-white p-6 text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white" >
            <div className="text-center">
              <h3 className="text-lg font-bold">Tank Level</h3>
              <p className="text-2xl">{sensorVals.tankLevel.value !== null ? `${sensorVals.tankLevel.value} ${sensorVals.tankLevel.unit}` : "---"}</p>
              <p className="text-sm"><i className={`icon-${sensorVals.tankLevel.icon}`}></i></p>
              {checkThreshold(sensorVals.tankLevel, true) && <p className="mt-2 text-sm">Threshold breached!</p>}
            </div>
          </div>

          {/* Canal Level Sensor */}
          <div className={`p-4 border rounded ${checkThreshold(sensorVals.canalLevel, true) ? "bg-red-500 text-white" : "bg-white"}`}>
            <div className="text-center">
              <h3 className="text-lg font-bold">Canal Level</h3>
              <p className="text-2xl">{sensorVals.canalLevel.value !== null ? `${sensorVals.canalLevel.value} ${sensorVals.canalLevel.unit}` : "---"}</p>
              <p className="text-sm"><i className={`icon-${sensorVals.canalLevel.icon}`}></i></p>
              {checkThreshold(sensorVals.canalLevel, true) && <p className="mt-2 text-sm">Threshold breached!</p>}
            </div>
          </div>

          {/* Humidity Sensor */}
          <div className={`p-4 border rounded ${checkThreshold(sensorVals.humidity) ? "bg-red-500 text-white" : "bg-white"}`}>
            <div className="text-center">
              <h3 className="text-lg font-bold">Humidity</h3>
              <p className="text-2xl">{sensorVals.humidity.value !== null ? `${sensorVals.humidity.value} ${sensorVals.humidity.unit}` : "---"}</p>
              <p className="text-sm"><i className={`icon-${sensorVals.humidity.icon}`}></i></p>
              {checkThreshold(sensorVals.humidity) && <p className="mt-2 text-sm">Threshold breached!</p>}
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-4 text-center">
        <p>Bonuedie Ezra</p>
        <p>Boamah Samuel</p>
        <p>DESIGN AND IMPLEMENTATION OF AN IoT BASED REAL-TIME MONITORING AND EARLY WARNING SYSTEMS FOR IRRIGATION DAM</p>
      </footer>
    </div>
  );
}

export default App;

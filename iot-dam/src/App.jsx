import React, { useState, useEffect } from "react";
import SensorCard from "./SensorCard";

function App() {
  const [sensorVals, setSensorVals] = useState({
    temperature: { value: null, unit: "°C", icon: "temperature", threshold: 26 },
    turbidity: { value: null, unit: "NTU", icon: "turbidity", threshold: 3 },
    tankLevel: { value: null, unit: "%", icon: "water", maxThreshold: 95, minThreshold: 60 },
    canalLevel: { value: null, unit: "%", icon: "water", maxThreshold: 80, minThreshold: 60 },
    ph: { value: null, unit: "pH", icon: "ph", threshold: 7 },
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
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">IoT Irrigation Dam Monitoring System</h1>
      <ul className="text-center mb-6">
        <li>Threshold for turbidity = 3 NTU</li>
        <li>Max Threshold for canal = 80%</li>
        <li>Min Threshold for canal = 60%</li>
        <li>Max Threshold for dam = 95%</li>
        <li>Min Threshold for dam = 60%</li>
      </ul>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SensorCard sensor={sensorVals.temperature} checkThreshold={checkThreshold} />
        <SensorCard sensor={sensorVals.turbidity} checkThreshold={checkThreshold} />
        <SensorCard sensor={sensorVals.tankLevel} checkThreshold={checkThreshold} isLevel />
        <SensorCard sensor={sensorVals.canalLevel} checkThreshold={checkThreshold} isLevel />
        <SensorCard sensor={sensorVals.humidity} checkThreshold={checkThreshold} />
      </div>
      <footer className="mt-8 text-center">
        <p>Bonuedie Ezra</p>
        <p>Boamah Samuel</p>
        <p>DESIGN AND IMPLEMENTATION OF AN IoT BASED REAL-TIME MONITORING AND EARLY WARNING SYSTEMS FOR IRRIGATION DAM</p>
      </footer>
    </div>
  );
}

export default App;

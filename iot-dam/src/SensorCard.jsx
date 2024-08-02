import React from "react";

const SensorCard = ({ sensor, checkThreshold, isLevel }) => {
  return (
    <div className={`p-4 border rounded ${checkThreshold(sensor, isLevel) ? "bg-red-500 text-white" : "bg-white"}`}>
      <div className="text-center">
        <h3 className="text-lg font-bold">{sensor.icon}</h3>
        <p className="text-2xl">{sensor.value !== null ? `${sensor.value} ${sensor.unit}` : "---"}</p>
        <p className="text-sm"><i className={`icon-${sensor.icon}`}></i></p>
        {checkThreshold(sensor, isLevel) && <p className="mt-2 text-sm">Threshold breached!</p>}
      </div>
    </div>
  );
};

export default SensorCard;

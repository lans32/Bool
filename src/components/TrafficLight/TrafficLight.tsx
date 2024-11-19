import React, { useState } from 'react';
import './TrafficLight.css';

const TrafficLight = () => {
  const [currentLight, setCurrentLight] = useState('red');

  // Функция смены сигнала
  const changeLight = () => {
    setCurrentLight((prevLight) => {
      if (prevLight === 'red') return 'yellow';
      if (prevLight === 'yellow') return 'green';
      return 'red';
    });
  };

  return (
    <div className="traffic-light" onClick={changeLight}>
      <div className={`light red ${currentLight === 'red' ? 'active' : ''}`}></div>
      <div className={`light yellow ${currentLight === 'yellow' ? 'active' : ''}`}></div>
      <div className={`light green ${currentLight === 'green' ? 'active' : ''}`}></div>
    </div>
  );
};

export default TrafficLight;

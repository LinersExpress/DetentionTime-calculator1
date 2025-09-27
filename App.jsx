import React, { useState } from 'react';
import './style.css';

function App() {
  const [offDuty, setOffDuty] = useState('');
  const [onDuty, setOnDuty] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [totalOffDuty, setTotalOffDuty] = useState('');
  const [detentionTime, setDetentionTime] = useState('');
  const [amountEarned, setAmountEarned] = useState('');

  const calculateTime = () => {
    const off = new Date(offDuty);
    const on = new Date(onDuty);
    const rate = parseFloat(hourlyRate);

    if (isNaN(off.getTime()) || isNaN(on.getTime()) || isNaN(rate)) {
      alert('Please enter valid dates and hourly rate.');
      return;
    }

    const diffMs = on - off;
    if (diffMs <= 0) {
      alert('On duty time must be after off duty time.');
      return;
    }

    const totalHours = diffMs / (1000 * 60 * 60);
    const detentionHours = Math.max(0, totalHours - 15);
    const earned = detentionHours * rate;

    const formatTime = (hrs) => {
      const h = Math.floor(hrs);
      const m = Math.round((hrs - h) * 60);
      return `${h}h ${m}m (${hrs.toFixed(2)})`;
    };

    setTotalOffDuty(formatTime(totalHours));
    setDetentionTime(formatTime(detentionHours));
    setAmountEarned(`$${earned.toFixed(2)}`);
  };

  return (
    <div className="container">
      <h1>Detention Time Calculator</h1>

      <label htmlFor="offDuty">Off Duty Date & Time</label>
      <input
        type="datetime-local"
        id="offDuty"
        value={offDuty}
        onChange={(e) => setOffDuty(e.target.value)}
      />

      <label htmlFor="onDuty">On Duty Date & Time</label>
      <input
        type="datetime-local"
        id="onDuty"
        value={onDuty}
        onChange={(e) => setOnDuty(e.target.value)}
      />

      <label htmlFor="rate">Hourly Rate</label>
      <input
        type="number"
        id="rate"
        step="0.01"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
      />
      <small>
        Engineers  $44.71  
        <br />7/1/26: $46.39  
        <br />7/1/27: $48.01  
        <br />7/1/28: $49.57  
        <br />7/1/29: $51.06
      </small>

      <button onClick={calculateTime}>Calculate</button>

      {totalOffDuty && (
        <div className="results">
          <p>Total Off Duty Time: {totalOffDuty}</p>
          <p>Detention Time: {detentionTime}</p>
          <p>Amount Earned: {amountEarned}</p>
        </div>
      )}
    </div>
  );
}

export default App;

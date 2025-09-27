import React, { useState, useEffect } from 'react';
import './style.css';

const App = () => {
  const [offDuty, setOffDuty] = useState('');
  const [onDuty, setOnDuty] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [results, setResults] = useState(null);

  const rateSchedule = [
    { date: '2026-07-01', rate: 46.39 },
    { date: '2027-07-01', rate: 48.01 },
    { date: '2028-07-01', rate: 49.57 },
    { date: '2029-07-01', rate: 51.06 }
  ];

  const baseRate = 44.71;

  // Automatically update the hourly rate when onDuty changes
  useEffect(() => {
    if (!onDuty) return;

    const dutyDate = new Date(onDuty);
    let selectedRate = baseRate;

    for (const rate of rateSchedule) {
      const rateDate = new Date(rate.date);
      if (dutyDate >= rateDate) {
        selectedRate = rate.rate;
      }
    }

    setHourlyRate(selectedRate.toFixed(2));
  }, [onDuty]);

  const calculateTime = () => {
    const start = new Date(offDuty);
    const end = new Date(onDuty);

    if (isNaN(start) || isNaN(end) || end <= start) {
      alert('Please enter valid dates and times.');
      return;
    }

    const diffMs = end - start;
    const totalMinutes = Math.floor(diffMs / 60000);
    const detentionMinutes = Math.max(totalMinutes - 900, 0);

    const formatTime = (mins) => {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      const decimal = (mins / 60).toFixed(2);
      return `${hours}h ${minutes}m (${decimal})`;
    };

    const earned = ((detentionMinutes / 60) * parseFloat(hourlyRate)).toFixed(2);

    setResults({
      total: formatTime(totalMinutes),
      detention: formatTime(detentionMinutes),
      earned: `$${earned}`
    });
  };

  return (
    <div className="container">
      <h1>Detention Time Calculator</h1>

      <label>Off Duty Time</label>
      <input
        type="datetime-local"
        value={offDuty}
        onChange={(e) => setOffDuty(e.target.value)}
      />

      <label>On Duty Time</label>
      <input
        type="datetime-local"
        value={onDuty}
        onChange={(e) => setOnDuty(e.target.value)}
      />

      <label>Hourly Rate</label>
      <input
        type="number"
        step="0.01"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
      />

      <small>
        Engineers $44.71  
        <br />7/1/26 → $46.39  
        <br />7/1/27 → $48.01  
        <br />7/1/28 → $49.57  
        <br />7/1/29 → $51.06
      </small>

      <button onClick={calculateTime}>Calculate</button>

      {results && (
        <div className="results">
          <p>Total Off Duty: {results.total}</p>
          <p>Detention Time: {results.detention}</p>
          <p>Amount Earned: {results.earned}</p>
        </div>
      )}
    </div>
  );
};

export default App;

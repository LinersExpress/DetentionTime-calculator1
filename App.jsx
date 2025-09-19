import React, { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [hourlyRate, setHourlyRate] = useState(44.71);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [offDutyTime, setOffDutyTime] = useState(0);
  const [totalDetention, setTotalDetention] = useState(0);
  const [amountEarned, setAmountEarned] = useState(0);

  // Automatically update hourly rate based on contract dates
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JS months are 0-based
    const day = today.getDate();

    if (year > 2029 || (year === 2029 && month >= 7 && day >= 1)) {
      setHourlyRate(51.06);
    } else if (year === 2028 && month >= 7 && day >= 1) {
      setHourlyRate(49.57);
    } else if (year === 2027 && month >= 7 && day >= 1) {
      setHourlyRate(48.01);
    } else if (year === 2026 && month >= 7 && day >= 1) {
      setHourlyRate(46.39);
    } else {
      setHourlyRate(44.71);
    }
  }, []);

  const calculateDetention = () => {
    if (!startTime || !endTime) {
      alert("Please enter both start and end times.");
      return;
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (end <= start) {
      alert("End time must be later than start time.");
      return;
    }

    const totalMinutes = (end - start) / (1000 * 60);
    const detentionMinutes = Math.max(0, totalMinutes - offDutyTime);
    const detentionHours = detentionMinutes / 60;

    setTotalDetention(detentionHours);
    setAmountEarned((detentionHours * hourlyRate).toFixed(2));
  };

  return (
    <div className="container">
      <h1>Detention Time Calculator</h1>

      <label>Hourly Rate ($):</label>
      <input
        type="number"
        value={hourlyRate}
        step="0.01"
        onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
      />
      <small>
        Engineers $44.71  
        <br /> 7/1/26 → $46.39  
        <br /> 7/1/27 → $48.01  
        <br /> 7/1/28 → $49.57  
        <br /> 7/1/29 → $51.06
      </small>

      <label>Start Time:</label>
      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

      <label>End Time:</label>
      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

      <label>Off Duty Time (minutes):</label>
      <input
        type="number"
        value={offDutyTime}
        onChange={(e) => setOffDutyTime(parseInt(e.target.value) || 0)}
      />

      <button onClick={calculateDetention}>Calculate</button>

      {totalDetention > 0 && (
        <div className="results">
          <p>Total Off Duty Time: {offDutyTime} minutes</p>
          <p>Total Detention Time: {totalDetention.toFixed(2)} hours</p>
          <p>Amount Earned: ${amountEarned}</p>
        </div>
      )}
    </div>
  );
}

export default App;

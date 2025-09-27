import React, { useState, useEffect } from "react";
import "./style.css";

const App = () => {
  const [offDuty, setOffDuty] = useState("");
  const [onDuty, setOnDuty] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [results, setResults] = useState(null);

  // Automatically set default hourly rate based on today's date
  useEffect(() => {
    const today = new Date();
    const rateTable = [
      { date: new Date("2029-07-01"), rate: 51.06 },
      { date: new Date("2028-07-01"), rate: 49.57 },
      { date: new Date("2027-07-01"), rate: 48.01 },
      { date: new Date("2026-07-01"), rate: 46.39 },
      { date: new Date("2024-07-01"), rate: 44.71 }
    ];
    const applicable = rateTable.find(entry => today >= entry.date);
    if (applicable) setHourlyRate(applicable.rate.toFixed(2));
  }, []);

  const calculate = () => {
    if (!offDuty || !onDuty || !hourlyRate) return;

    const offTime = new Date(offDuty);
    const onTime = new Date(onDuty);

    if (isNaN(offTime) || isNaN(onTime) || offTime >= onTime) {
      alert("Please enter valid date and time values.");
      return;
    }

    const totalMs = onTime - offTime;
    const totalMinutes = Math.floor(totalMs / 60000);
    const detentionMinutes = Math.max(totalMinutes - 900, 0); // 15 hours = 900 minutes

    const formatHM = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const d = (minutes / 60).toFixed(2);
      return `${h}h ${m}m (${d})`;
    };

    const earned = (detentionMinutes / 60) * parseFloat(hourlyRate);

    setResults({
      totalTime: formatHM(totalMinutes),
      detentionTime: formatHM(detentionMinutes),
      earned: `$${earned.toFixed(2)}`
    });
  };

  return (
    <div className="container">
      <h1>Detention Time Calculator</h1>

      <label>Previous Off Duty Date & Time</label>
      <input
        type="datetime-local"
        value={offDuty}
        onChange={(e) => setOffDuty(e.target.value)}
      />

      <label>On Duty Date & Time</label>
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
        Engineers &nbsp; $44.71  
        <br />
        7/1/26 &nbsp; $46.39  
        <br />
        7/1/27 &nbsp; $48.01  
        <br />
        7/1/28 &nbsp; $49.57  
        <br />
        7/1/29 &nbsp; $51.06
      </small>

      <button onClick={calculate}>Calculate</button>

      {results && (
        <div className="results">
          <p>⏰ <strong>Off Duty:</strong> {results.totalTime}</p>
          <p>🕐 <strong>Detention Time:</strong> {results.detentionTime}</p>
          <p>💵 <strong>Amount Earned:</strong> {results.earned}</p>
        </div>
      )}
    </div>
  );
};

export default App;

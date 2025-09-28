import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [offDutyDateTime, setOffDutyDateTime] = useState("");
  const [onDutyDateTime, setOnDutyDateTime] = useState("");
  const [hourlyRate, setHourlyRate] = useState("44.71");
  const [offDutyDuration, setOffDutyDuration] = useState("");
  const [detentionDuration, setDetentionDuration] = useState("");
  const [amountEarned, setAmountEarned] = useState("");

  const rateSchedule = [
    { date: "2029-07-01", rate: 51.06 },
    { date: "2028-07-01", rate: 49.57 },
    { date: "2027-07-01", rate: 48.01 },
    { date: "2026-07-01", rate: 46.39 },
    { date: "2025-07-01", rate: 44.71 }
  ];

  useEffect(() => {
    if (onDutyDateTime) {
      const dutyDate = new Date(onDutyDateTime);
      const matchedRate = rateSchedule.find(schedule => dutyDate >= new Date(schedule.date));
      if (matchedRate) {
        setHourlyRate(matchedRate.rate.toFixed(2));
      }
    }
  }, [onDutyDateTime]);

  const formatDuration = (ms) => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const decimalHours = (ms / 3600000).toFixed(2);
    return `${hours}h ${minutes}m (${decimalHours})`;
  };

  const handleCalculate = () => {
    const start = new Date(offDutyDateTime);
    const end = new Date(onDutyDateTime);

    if (isNaN(start) || isNaN(end) || end <= start || isNaN(parseFloat(hourlyRate))) return;

    const offDutyMs = end - start;
    const detentionMs = Math.max(offDutyMs - 10 * 3600000, 0); // 10 hours = 36000000 ms
    const detentionHrs = detentionMs / 3600000;
    const earned = (detentionHrs * parseFloat(hourlyRate)).toFixed(2);

    setOffDutyDuration(formatDuration(offDutyMs));
    setDetentionDuration(formatDuration(detentionMs));
    setAmountEarned(`$${earned}`);
  };

  return (
    <div className="container">
      <h1>Detention Time Calculator</h1>

      <label>Previous Off Duty Date & Time</label>
      <input
        type="datetime-local"
        value={offDutyDateTime}
        onChange={(e) => setOffDutyDateTime(e.target.value)}
        className="narrow-input"
      />

      <label>On Duty Date & Time</label>
      <input
        type="datetime-local"
        value={onDutyDateTime}
        onChange={(e) => setOnDutyDateTime(e.target.value)}
        className="narrow-input"
      />

      <label>Hourly Rate</label>
      <input
        type="number"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
        className="narrow-input"
      />

      <small>
        Engineers &nbsp; $44.71<br />
        7/1/26 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $46.39<br />
        7/1/27 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $48.01<br />
        7/1/28 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $49.57<br />
        7/1/29 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $51.06
      </small>

      <button onClick={handleCalculate}>Calculate</button>

      {(offDutyDuration || detentionDuration || amountEarned) && (
        <div className="results">
          {offDutyDuration && (
            <p>⏰ <strong>Off Duty:</strong> {offDutyDuration}</p>
          )}
          {detentionDuration && (
            <p>🕰️ <strong>Detention Time:</strong> {detentionDuration}</p>
          )}
          {amountEarned && (
            <p>💵 <strong>Amount Earned:</strong> {amountEarned}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

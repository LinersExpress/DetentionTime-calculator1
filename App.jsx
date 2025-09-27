import React, { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [offDutyDate, setOffDutyDate] = useState("");
  const [offDutyTime, setOffDutyTime] = useState("");
  const [onDutyDate, setOnDutyDate] = useState("");
  const [onDutyTime, setOnDutyTime] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [results, setResults] = useState(null);

  // Automatically update hourly rate based on date
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    let rate = 44.71;
    if (year > 2029 || (year === 2029 && month >= 6)) rate = 51.06;
    else if (year === 2028 && month >= 6) rate = 49.57;
    else if (year === 2027 && month >= 6) rate = 48.01;
    else if (year === 2026 && month >= 6) rate = 46.39;

    setHourlyRate(rate.toFixed(2));
  }, []);

  const calculateTime = () => {
    const offDuty = new Date(`${offDutyDate}T${offDutyTime}`);
    const onDuty = new Date(`${onDutyDate}T${onDutyTime}`);
    const totalMs = onDuty - offDuty;

    if (isNaN(totalMs) || totalMs <= 0) {
      setResults({ error: "Invalid time range." });
      return;
    }

    const totalMinutes = Math.floor(totalMs / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const minutesLeft = totalMinutes % 60;
    const totalDecimal = (totalMinutes / 60).toFixed(2);

    const detentionMinutes = Math.max(totalMinutes - 900, 0);
    const detentionHours = Math.floor(detentionMinutes / 60);
    const detentionLeft = detentionMinutes % 60;
    const detentionDecimal = (detentionMinutes / 60).toFixed(2);

    const earned = (detentionMinutes / 60) * parseFloat(hourlyRate || 0);

    setResults({
      total: `${totalHours}h ${minutesLeft}m (${totalDecimal})`,
      detention: `${detentionHours}h ${detentionLeft}m (${detentionDecimal})`,
      earned: earned.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    });
  };

  return (
    <div className="container">
      <h1 style={{ color: "#007acc", textAlign: "center" }}>
        Detention Time Calculator
      </h1>

      <label>Previous Off Duty Date</label>
      <input type="date" value={offDutyDate} onChange={(e) => setOffDutyDate(e.target.value)} />

      <label>Previous Off Duty Time</label>
      <input type="time" value={offDutyTime} onChange={(e) => setOffDutyTime(e.target.value)} />

      <label>On Duty Date</label>
      <input type="date" value={onDutyDate} onChange={(e) => setOnDutyDate(e.target.value)} />

      <label>On Duty Time</label>
      <input type="time" value={onDutyTime} onChange={(e) => setOnDutyTime(e.target.value)} />

      <label>Hourly Rate</label>
      <input
        type="number"
        step="0.01"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
      />
      <small>
        Engineers  $44.71<br />
          7/1/26    $46.39<br />
          7/1/27    $48.01<br />
          7/1/28    $49.57<br />
          7/1/29    $51.06
      </small>

      <button onClick={calculateTime}>Calculate</button>

      {results && (
        <div className="results">
          {results.error ? (
            <p style={{ color: "red" }}>{results.error}</p>
          ) : (
            <>
              <p>🕒 <strong>Off Duty:</strong> {results.total}</p>
              <p>⏱️ <strong>Detention Time:</strong> {results.detention}</p>
              <p>💵 <strong>Amount Earned:</strong> {results.earned}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

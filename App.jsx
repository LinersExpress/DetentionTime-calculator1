import React, { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [hourlyRate, setHourlyRate] = useState(44.71);
  const [offDutyTime, setOffDutyTime] = useState("");
  const [onDutyTime, setOnDutyTime] = useState("");
  const [totalOffDuty, setTotalOffDuty] = useState(0);
  const [totalDetention, setTotalDetention] = useState(0);
  const [amountEarned, setAmountEarned] = useState(0);

  // Auto-update hourly rate by contract dates
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
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
    if (!offDutyTime || !onDutyTime) {
      alert("Please enter both off duty and on duty times.");
      return;
    }

    const offDuty = new Date(offDutyTime);
    const onDuty = new Date(onDutyTime);

    if (onDuty <= offDuty) {
      alert("On duty time must be later than off duty time.");
      return;
    }

    // total off duty hours
    const totalHours = (onDuty - offDuty) / (1000 * 60 * 60);

    // detention = total - 15 hours grace
    const detentionHours = totalHours > 15 ? totalHours - 15 : 0;

    setTotalOffDuty(totalHours);
    setTotalDetention(detentionHours);
    setAmountEarned((detentionHours * hourlyRate).toFixed(2));
  };

  return (
    <div className="container">
      <h1>Detention Time Calculator</h1>

      <label>Off Duty Start (24h format):</label>
      <input
        type="datetime-local"
        value={offDutyTime}
        onChange={(e) => setOffDutyTime(e.target.value)}
      />

      <label>On Duty Start (24h format):</label>
      <input
        type="datetime-local"
        value={onDutyTime}
        onChange={(e) => setOnDutyTime(e.target.value)}
      />

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

      <button onClick={calculateDetention}>Calculate</button>

      {totalOffDuty > 0 && (
        <div className="results">
          <p>Total Off Duty Time: {totalOffDuty.toFixed(2)} hours</p>
          <p>Total Detention Time (after 15 hrs): {totalDetention.toFixed(2)} hours</p>
          <p>Amount Earned: ${amountEarned}</p>
        </div>
      )}
    </div>
  );
}

export default App;

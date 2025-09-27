import React, { useState, useEffect } from 'react';

const App = () => {
  const [offDuty, setOffDuty] = useState('');
  const [onDuty, setOnDuty] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [results, setResults] = useState(null);

  // Auto-set default hourly rate based on today's date
  useEffect(() => {
    const today = new Date();
    let rate = 44.71;

    if (today >= new Date('2029-07-01')) rate = 51.06;
    else if (today >= new Date('2028-07-01')) rate = 49.57;
    else if (today >= new Date('2027-07-01')) rate = 48.01;
    else if (today >= new Date('2026-07-01')) rate = 46.39;

    setHourlyRate(rate.toFixed(2));
  }, []);

  const calculate = () => {
    if (!offDuty || !onDuty || !hourlyRate) {
      setResults(null);
      return;
    }

    const start = new Date(offDuty);
    const end = new Date(onDuty);
    const totalMs = end - start;

    if (totalMs <= 0) {
      setResults(null);
      return;
    }

    const totalMinutes = Math.floor(totalMs / 60000);
    const detentionMinutes = Math.max(0, totalMinutes - 600); // 10 hours = 600 minutes

    const offDutyHours = Math.floor(totalMinutes / 60);
    const offDutyMins = totalMinutes % 60;
    const decimalOffDuty = (totalMinutes / 60).toFixed(2);

    const detentionHours = Math.floor(detentionMinutes / 60);
    const detentionMins = detentionMinutes % 60;
    const decimalDetention = (detentionMinutes / 60).toFixed(2);

    const amount = ((detentionMinutes / 60) * parseFloat(hourlyRate)).toFixed(2);

    setResults({
      offDuty: `${offDutyHours}h ${offDutyMins}m (${decimalOffDuty})`,
      detention: `${detentionHours}h ${detentionMins}m (${decimalDetention})`,
      amount: `$${amount}`,
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
        Engineers  $44.71<br />
        7/1/26    $46.39<br />
        7/1/27    $48.01<br />
        7/1/28    $49.57<br />
        7/1/29    $51.06
      </small>

      <button onClick={calculate}>Calculate</button>

      {results && (
        <div className="results">
          <p>⏰ <strong>Off Duty:</strong> {results.offDuty}</p>
          <p>🕓 <strong>Detention Time:</strong> {results.detention}</p>
          <p>💵 <strong>Amount Earned:</strong> {results.amount}</p>
        </div>
      )}
    </div>
  );
};

export default App;

import React, { useState } from 'react';

function App() { const [offDuty, setOffDuty] = useState(''); const [onDuty, setOnDuty] = useState(''); const [hourlyRate, setHourlyRate] = useState(44.71); const [totalOffDutyTime, setTotalOffDutyTime] = useState(0); const [detentionTime, setDetentionTime] = useState(0); const [amountEarned, setAmountEarned] = useState(0);

const calculate = () => { const offDutyTime = new Date(offDuty); const onDutyTime = new Date(onDuty); const diffMs = onDutyTime - offDutyTime;

if (isNaN(diffMs) || diffMs < 0) return;

const diffMinutes = Math.floor(diffMs / 60000);
const detentionMinutes = Math.max(0, diffMinutes - 900); // 15 hrs = 900 min
const amount = (detentionMinutes / 60) * hourlyRate;

setTotalOffDutyTime(diffMinutes);
setDetentionTime(detentionMinutes);
setAmountEarned(amount);

};

const formatDuration = (minutes) => { const h = Math.floor(minutes / 60); const m = minutes % 60; return ${h}h ${m}m; };

return ( <div className="container"> <h1>Detention Time Calculator</h1>

<label>Previous Off Duty</label>
  <input type="datetime-local" value={offDuty} onChange={(e) => setOffDuty(e.target.value)} />

  <label>On Duty</label>
  <input type="datetime-local" value={onDuty} onChange={(e) => setOnDuty(e.target.value)} />

  <label>Hourly Rate</label>
  <input
    type="number"
    value={hourlyRate}
    step="0.01"
    onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
  />

  <small>
    Engineers $44.71  
    <br />7/1/26 &nbsp; $46.39  
    <br />7/1/27 &nbsp; $48.01  
    <br />7/1/28 &nbsp; $49.57  
    <br />7/1/29 &nbsp; $51.06
  </small>

  <button onClick={calculate}>Calculate</button>

  {totalOffDutyTime > 0 && (
    <div className="summary-card">
      <p>
        <strong>🕒 Off Duty:</strong> {formatDuration(totalOffDutyTime)}
        ({(totalOffDutyTime / 60).toFixed(2)})
      </p>
      <p>
        <strong>⏱️ Detention Time:</strong> {formatDuration(detentionTime)}
        ({(detentionTime / 60).toFixed(2)})
      </p>
      <p>
        <strong>💵 Amount Earned:</strong> ${amountEarned.toFixed(2)}
      </p>
    </div>
  )}
</div>

); }

export default App;


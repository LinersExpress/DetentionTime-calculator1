import { useState } from 'react';
import './style.css';

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function App() {
  const [offDutyDateTime, setOffDutyDateTime] = useState('');
  const [onDutyDateTime, setOnDutyDateTime] = useState('');
  const [hourlyRate, setHourlyRate] = useState(44.71);
  const [totalOffDutyTime, setTotalOffDutyTime] = useState(0);
  const [detentionTime, setDetentionTime] = useState(0);
  const [amountEarned, setAmountEarned] = useState(0);

  const calculate = () => {
    const offDuty = new Date(offDutyDateTime);
    const onDuty = new Date(onDutyDateTime);
    const diffMinutes = Math.floor((onDuty - offDuty) / 60000);

    const detentionThreshold = 15 * 60;
    const detention = Math.max(diffMinutes - detentionThreshold, 0);
    const earned = (detention / 60) * hourlyRate;

    setTotalOffDutyTime(diffMinutes);
    setDetentionTime(detention);
    setAmountEarned(earned);
  };

  return (
    <div className="container">
      <h1>Detention Time Calculator</h1>

      <label>Previous Off Duty Date and Time</label>
      <input
        type="datetime-local"
        value={offDutyDateTime}
        onChange={(e) => setOffDutyDateTime(e.target.value)}
      />

      <label>On Duty Date and Time</label>
      <input
        type="datetime-local"
        value={onDutyDateTime}
        onChange={(e) => setOnDutyDateTime(e.target.value)}
      />

      <label>Hourly Rate</label>
      <input
        type="number"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
        step="0.01"
      />

      <small>
        Engineers  $44.71<br/>
        7/1/26    $46.39<br/>
        7/1/27    $48.01<br/>
        7/1/28    $49.57<br/>
        7/1/29    $51.06
      </small>

      <button onClick={calculate}>Calculate</button>

      {totalOffDutyTime > 0 && (
        <div className="summary-card">
          <p><strong>🕒 Off Duty:</strong> {formatDuration(totalOffDutyTime)}</p>
          <p><strong>⏱️ Detention Time:</strong> {formatDuration(detentionTime)}</p>
          <p><strong>💵 Amount Earned:</strong> ${amountEarned.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;

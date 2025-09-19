import { useState } from 'react';
import './App.css';

// Function to pick the right hourly rate by date
function getRateForDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // months are 0-indexed
  const day = date.getDate();

  // Switch dates for rate changes
  if (year > 2029 || (year === 2029 && month >= 7 && day >= 1)) return 51.06;
  if (year > 2028 || (year === 2028 && month >= 7 && day >= 1)) return 49.57;
  if (year > 2027 || (year === 2027 && month >= 7 && day >= 1)) return 48.01;
  if (year > 2026 || (year === 2026 && month >= 7 && day >= 1)) return 46.39;
  return 44.71; // default base rate
}

function App() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [detention, setDetention] = useState(0);
  const [offDuty, setOffDuty] = useState(0);
  const [earned, setEarned] = useState(0);

  const calculate = () => {
    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate - startDate) / (1000 * 60 * 60);

    const detentionHours = Math.max(0, hours - offDuty);
    const rate = getRateForDate(startDate);
    const pay = detentionHours * rate;

    setDetention(detentionHours);
    setEarned(pay);
  };

  return (
    <div className="App">
      <h1>Detention Time Calculator</h1>

      <div>
        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div>
        <label>End Time:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <div>
        <label>Off Duty Hours:</label>
        <input
          type="number"
          value={offDuty}
          onChange={(e) => setOffDuty(Number(e.target.value))}
        />
      </div>

      <button onClick={calculate}>Calculate</button>

      <div className="results">
        <p>Total Off Duty: {offDuty} hrs</p>
        <p>Total Detention: {detention.toFixed(2)} hrs</p>
        <p>Amount Earned: ${earned.toFixed(2)}</p>
      </div>

      <small>
        Hourly Rate Schedule:
        <br />
        Engineers $44.71
        <br />
        7/1/26 → $46.39
        <br />
        7/1/27 → $48.01
        <br />
        7/1/28 → $49.57
        <br />
        7/1/29 → $51.06
      </small>
    </div>
  );
}

export default App;

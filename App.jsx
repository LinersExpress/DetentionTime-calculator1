import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [offDuty, setOffDuty] = useState('');
  const [onDuty, setOnDuty] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [result, setResult] = useState(null);

  const rateByDate = [
    { date: new Date('2029-07-01'), rate: 51.06 },
    { date: new Date('2028-07-01'), rate: 49.57 },
    { date: new Date('2027-07-01'), rate: 48.01 },
    { date: new Date('2026-07-01'), rate: 46.39 },
    { date: new Date('2025-07-01'), rate: 44.71 },
  ];

  useEffect(() => {
    if (offDuty) {
      const offDutyDate = new Date(offDuty);
      const matchedRate = rateByDate.find(({ date }) => offDutyDate >= date);
      if (matchedRate) {
        setHourlyRate(matchedRate.rate.toFixed(2));
      }
    }
  }, [offDuty]);

  const calculate = () => {
    if (!offDuty || !onDuty || !hourlyRate) return;

    const off = new Date(offDuty);
    const on = new Date(onDuty);
    const rate = parseFloat(hourlyRate);

    const totalMinutes = Math.floor((on - off) / 60000);
    const detentionMinutes = Math.max(totalMinutes - 600, 0); // Subtract 10 hours (600 mins)

    const formatTime = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const d = (minutes / 60).toFixed(2);
      return `${h}h ${m}m (${d})`;
    };

    const pay = ((detentionMinutes / 60) * rate).toFixed(2);

    setResult({
      totalTime: formatTime(totalMinutes),
      detention: formatTime(detentionMinutes),
      earned: `$${pay}`,
    });
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Detention Time Calculator</h1>

      <div style={styles.field}>
        <label style={styles.label}>Previous Off Duty Date & Time</label>
        <input
          type="datetime-local"
          value={offDuty}
          onChange={(e) => setOffDuty(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>On Duty Date & Time</label>
        <input
          type="datetime-local"
          value={onDuty}
          onChange={(e) => setOnDuty(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Hourly Rate</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          style={styles.input}
        />
        <div style={styles.rateTable}>
          Engineers  $44.71<br />
          7/1/26      $46.39<br />
          7/1/27      $48.01<br />
          7/1/28      $49.57<br />
          7/1/29      $51.06
        </div>
      </div>

      <button onClick={calculate} style={styles.button}>Calculate</button>

      {result && (
        <div style={styles.card}>
          <p><span role="img" aria-label="off">⏰</span> <strong>Off Duty:</strong> {result.totalTime}</p>
          <p><span role="img" aria-label="detention">🕰️</span> <strong>Detention Time:</strong> {result.detention}</p>
          <p><span role="img" aria-label="money">💵</span> <strong>Amount Earned:</strong> {result.earned}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '1rem',
    fontFamily: 'sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  field: {
    marginBottom: '1rem',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  label: {
    display: 'block',
    marginBottom: '0.3rem',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    maxWidth: '100%',
    padding: '0.6rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#111',
    color: '#fff',
  },
  rateTable: {
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    lineHeight: '1.4',
    color: '#ccc',
  },
  button: {
    display: 'block',
    margin: '1rem auto',
    padding: '0.75rem 1.5rem',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: '#111111',
    border: '1px solid #444',
    borderRadius: '12px',
    padding: '1rem',
    marginTop: '1.5rem',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

export default App;

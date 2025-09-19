import React, { useEffect, useState } from "react";

const RATE_SCHEDULE = [
  { start: new Date("2029-07-01T00:00:00"), rate: 51.06 },
  { start: new Date("2028-07-01T00:00:00"), rate: 49.57 },
  { start: new Date("2027-07-01T00:00:00"), rate: 48.01 },
  { start: new Date("2026-07-01T00:00:00"), rate: 46.39 },
  { start: new Date("2000-01-01T00:00:00"), rate: 44.71 },
];

function getRateForDate(d = new Date()) {
  for (const tier of RATE_SCHEDULE) {
    if (d >= tier.start) return tier.rate;
  }
  return RATE_SCHEDULE.at(-1).rate;
}

function formatHoursMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${h}h ${m}m`;
}

export default function App() {
  const [offDuty, setOffDuty] = useState("");
  const [onDuty, setOnDuty] = useState("");
  const [autoRate, setAutoRate] = useState(true);
  const [rate, setRate] = useState(() => getRateForDate());
  const [results, setResults] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!autoRate || !onDuty) return;
    setRate(getRateForDate(new Date(onDuty)));
  }, [onDuty, autoRate]);

  function calculate() {
    if (!offDuty || !onDuty) return;
    const off = new Date(offDuty);
    const on = new Date(onDuty);
    const totalOffDuty = (on - off) / 60000; // minutes
    const totalOffDutyHours = totalOffDuty / 60;
    const detentionHours = Math.max(0, totalOffDutyHours - 15);
    const detentionPay = detentionHours * rate;
    setResults({ totalOffDuty, detentionHours, detentionPay });
  }

  return (
    <div className="container">
      <div className="header">
        <div className="h1">Detention Time Calculator</div>
        <div className="toggles">
          <label className="toggle">
            <input type="checkbox" checked={autoRate} onChange={e=>setAutoRate(e.target.checked)} /> Auto rate
          </label>
          <label className="toggle">
            <input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)} /> Dark
          </label>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <label className="label">Off Duty Date & Time (24h)</label>
          <input className="input" type="datetime-local" value={offDuty} onChange={e=>setOffDuty(e.target.value)} />
        </div>
        <div className="row">
          <label className="label">On Duty Date & Time (24h)</label>
          <input className="input" type="datetime-local" value={onDuty} onChange={e=>setOnDuty(e.target.value)} />
        </div>
        <div className="row">
          <label className="label">Hourly Rate ($)</label>
          <input className="number" type="number" step="0.01" value={rate} onChange={e=>setRate(parseFloat(e.target.value)||0)} />
          <div className="meta">
            <div><strong>Engineers</strong></div>
            <div>$44.71</div>
            <div>7/1/26  $46.39</div>
            <div>7/1/27  $48.01</div>
            <div>7/1/28  $49.57</div>
            <div>7/1/29  $51.06</div>
            <div style={{marginTop:"4px", fontStyle:"italic", fontSize:"11px"}}>When Auto rate is on, the rate updates based on the On Duty date above. You can override it manually anytime.</div>
          </div>
        </div>
        <button className="button" onClick={calculate}>Calculate</button>
      </div>

      {results && (
        <div className="card results">
          <p><strong>Total Time Off Duty:</strong> {formatHoursMinutes(results.totalOffDuty)}</p>
          <p><strong>Detention Time:</strong> {results.detentionHours.toFixed(2)} hours</p>
          <p className="earned">Total Earned: ${results.detentionPay.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
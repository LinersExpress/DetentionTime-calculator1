import React, { useState, useEffect } from "react"; import "./App.css";

function App() { const [offDutyDateTime, setOffDutyDateTime] = useState(""); const [onDutyDateTime, setOnDutyDateTime] = useState(""); const [hourlyRate, setHourlyRate] = useState("44.71"); const [results, setResults] = useState(null);

useEffect(() => { const now = new Date(); const offset = now.getTimezoneOffset(); const localISOTime = new Date(now.getTime() - offset * 60000) .toISOString() .slice(0, 16); setOnDutyDateTime(localISOTime); }, []);

const handleCalculate = () => { const start = new Date(offDutyDateTime); const end = new Date(onDutyDateTime);

if (isNaN(start) || isNaN(end) || end <= start) {
  alert("Please enter valid start and end times.");
  return;
}

const totalMinutes = Math.floor((end - start) / 60000);
const totalHoursDecimal = (totalMinutes / 60).toFixed(2);
const totalHours = Math.floor(totalMinutes / 60);
const totalRemainingMinutes = totalMinutes % 60;

const detentionMinutes = Math.max(totalMinutes - 600, 0);
const detentionHoursDecimal = (detentionMinutes / 60).toFixed(2);
const detentionHours = Math.floor(detentionMinutes / 60);
const detentionRemainingMinutes = detentionMinutes % 60;

const amountEarned = (detentionMinutes / 60) * parseFloat(hourlyRate);

setResults({
  totalHours,
  totalRemainingMinutes,
  totalHoursDecimal,
  detentionHours,
  detentionRemainingMinutes,
  detentionHoursDecimal,
  amountEarned: amountEarned.toFixed(2),
});

};

return ( <div className="min-h-screen bg-black text-white p-4"> <div className="max-w-md mx-auto"> <h1 className="text-4xl font-bold mb-4">Detention Time Calculator</h1>

<label className="block mb-2 font-semibold">
      Previous Off Duty Date & Time
    </label>
    <input
      type="datetime-local"
      className="w-full p-2 mb-4 rounded bg-zinc-900 text-white border border-zinc-700"
      value={offDutyDateTime}
      onChange={(e) => setOffDutyDateTime(e.target.value)}
    />

    <label className="block mb-2 font-semibold">On Duty Date & Time</label>
    <input
      type="datetime-local"
      className="w-full p-2 mb-4 rounded bg-zinc-900 text-white border border-zinc-700"
      value={onDutyDateTime}
      onChange={(e) => setOnDutyDateTime(e.target.value)}
    />

    <label className="block mb-2 font-semibold">Hourly Rate</label>
    <input
      type="number"
      className="w-full p-2 mb-1 rounded bg-zinc-900 text-white border border-zinc-700"
      value={hourlyRate}
      onChange={(e) => setHourlyRate(e.target.value)}
    />

    <div className="text-sm text-gray-400 mb-4">
      Engineers $44.71<br />7/1/26 $46.39<br />7/1/27 $48.01<br />7/1/28
      $49.57<br />7/1/29 $51.06
    </div>

    <button
      onClick={handleCalculate}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
    >
      Calculate
    </button>

    {results && (
      <div className="mt-6 p-4 bg-zinc-900 rounded-lg shadow text-lg">
        <p className="mb-2">
          <span role="img" aria-label="clock">⏰</span> <strong>Off Duty:</strong> {results.totalHours}h {results.totalRemainingMinutes}m ({results.totalHoursDecimal})
        </p>
        <p className="mb-2">
          <span role="img" aria-label="timer">🕓</span> <strong>Detention Time:</strong> {results.detentionHours}h {results.detentionRemainingMinutes}m ({results.detentionHoursDecimal})
        </p>
        <p>
          <span role="img" aria-label="money">💵</span> <strong>Amount Earned:</strong> ${results.amountEarned}
        </p>
      </div>
    )}
  </div>
</div>

); }

export default App;


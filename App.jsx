import React, { useState, useEffect } from "react";

function App() {
  const [offDutyDateTime, setOffDutyDateTime] = useState("");
  const [onDutyDateTime, setOnDutyDateTime] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset);
    setOffDutyDateTime(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    if (onDutyDateTime) {
      const selectedDate = new Date(onDutyDateTime);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();

      let newRate = 44.71;
      if (year > 2029 || (year === 2029 && month >= 6 && day >= 1)) newRate = 51.06;
      else if (year === 2028 && month >= 6 && day >= 1) newRate = 49.57;
      else if (year === 2027 && month >= 6 && day >= 1) newRate = 48.01;
      else if (year === 2026 && month >= 6 && day >= 1) newRate = 46.39;

      setHourlyRate(newRate.toFixed(2));
    }
  }, [onDutyDateTime]);

  const handleCalculate = () => {
    const start = new Date(offDutyDateTime);
    const end = new Date(onDutyDateTime);

    if (isNaN(start) || isNaN(end) || end <= start) {
      alert("Please enter valid date & time values.");
      return;
    }

    const totalMs = end - start;
    const totalMin = Math.floor(totalMs / 60000);
    const detentionMin = Math.max(0, totalMin - 600);
    const totalHours = Math.floor(totalMin / 60);
    const totalRemainingMin = totalMin % 60;
    const detentionHours = Math.floor(detentionMin / 60);
    const detentionRemainingMin = detentionMin % 60;
    const detentionDecimal = (detentionMin / 60).toFixed(2);
    const totalDecimal = (totalMin / 60).toFixed(2);
    const earned = (detentionMin / 60) * parseFloat(hourlyRate || 0);

    setResult({
      total: `${totalHours}h ${totalRemainingMin}m (${totalDecimal})`,
      detention: `${detentionHours}h ${detentionRemainingMin}m (${detentionDecimal})`,
      earned: `$${earned.toFixed(2)}`
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Detention Time Calculator</h1>

        <label className="block mb-2 font-semibold">Previous Off Duty Date & Time</label>
        <input
          type="datetime-local"
          value={offDutyDateTime}
          onChange={(e) => setOffDutyDateTime(e.target.value)}
          className="w-[90%] mb-4 p-2 bg-neutral-900 text-white border border-gray-700 rounded"
        />

        <label className="block mb-2 font-semibold">On Duty Date & Time</label>
        <input
          type="datetime-local"
          value={onDutyDateTime}
          onChange={(e) => setOnDutyDateTime(e.target.value)}
          className="w-[90%] mb-4 p-2 bg-neutral-900 text-white border border-gray-700 rounded"
        />

        <label className="block mb-2 font-semibold">Hourly Rate</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          className="w-[90%] mb-4 p-2 bg-neutral-900 text-white border border-gray-700 rounded"
        />

        <div className="text-sm text-gray-400 mb-4">
          Engineers  $44.71<br />
          7/1/26    $46.39<br />
          7/1/27    $48.01<br />
          7/1/28    $49.57<br />
          7/1/29    $51.06
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-neutral-900 border border-gray-700">
            <p className="mb-2">
              <span className="text-red-500">⏰ <strong>Off Duty:</strong></span> {result.total}
            </p>
            <p className="mb-2">
              <span className="text-gray-300">🕰️ <strong>Detention Time:</strong></span> {result.detention}
            </p>
            <p>
              <span className="text-green-400">💵 <strong>Amount Earned:</strong></span> {result.earned}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

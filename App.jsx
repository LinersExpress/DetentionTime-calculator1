import React, { useState, useEffect } from "react";

function App() {
  const [offDutyDateTime, setOffDutyDateTime] = useState("");
  const [onDutyDateTime, setOnDutyDateTime] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [offDutyDuration, setOffDutyDuration] = useState("");
  const [detentionDuration, setDetentionDuration] = useState("");
  const [amountEarned, setAmountEarned] = useState(null);

  const rateSchedule = [
    { date: "2029-07-01", rate: 51.06 },
    { date: "2028-07-01", rate: 49.57 },
    { date: "2027-07-01", rate: 48.01 },
    { date: "2026-07-01", rate: 46.39 },
    { date: "2025-07-01", rate: 44.71 },
  ];

  useEffect(() => {
    if (offDutyDateTime) {
      const currentDate = new Date(offDutyDateTime);
      const matchedRate = rateSchedule.find(schedule => currentDate >= new Date(schedule.date));
      if (matchedRate) setHourlyRate(matchedRate.rate.toFixed(2));
    }
  }, [offDutyDateTime]);

  const formatDuration = (ms) => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const decimalHours = (ms / 3600000).toFixed(2);
    return `${hours}h ${minutes}m (${decimalHours})`;
  };

  const handleCalculate = () => {
    const start = new Date(offDutyDateTime);
    const end = new Date(onDutyDateTime);
    if (isNaN(start) || isNaN(end) || end <= start || isNaN(parseFloat(hourlyRate))) return;

    const msDifference = end - start;
    const detentionMs = Math.max(0, msDifference - 10 * 60 * 60 * 1000);
    setOffDutyDuration(formatDuration(msDifference));
    setDetentionDuration(formatDuration(detentionMs));

    const hours = detentionMs / 3600000;
    setAmountEarned((hours * parseFloat(hourlyRate)).toFixed(2));
  };

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh", color: "#ffffff", padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Detention Time Calculator</h1>

      <label style={{ display: "block", marginTop: "1rem", fontWeight: "bold" }}>Previous Off Duty Date & Time</label>
      <input
        type="datetime-local"
        value={offDutyDateTime}
        onChange={(e) => setOffDutyDateTime(e.target.value)}
        style={{ width: "90%", maxWidth: "320px", padding: "0.5rem", backgroundColor: "#1a1a1a", color: "#ffffff", border: "1px solid #444", borderRadius: "6px" }}
      />

      <label style={{ display: "block", marginTop: "1rem", fontWeight: "bold" }}>On Duty Date & Time</label>
      <input
        type="datetime-local"
        value={onDutyDateTime}
        onChange={(e) => setOnDutyDateTime(e.target.value)}
        style={{ width: "90%", maxWidth: "320px", padding: "0.5rem", backgroundColor: "#1a1a1a", color: "#ffffff", border: "1px solid #444", borderRadius: "6px" }}
      />

      <label style={{ display: "block", marginTop: "1rem", fontWeight: "bold" }}>Hourly Rate</label>
      <input
        type="number"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
        style={{ width: "90%", maxWidth: "200px", padding: "0.5rem", backgroundColor: "#1a1a1a", color: "#ffffff", border: "1px solid #444", borderRadius: "6px" }}
      />

      <div style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: "#aaa" }}>
        Engineers ${rateSchedule[4].rate.toFixed(2)}<br />
        7/1/26 ${rateSchedule[3].rate.toFixed(2)}<br />
        7/1/27 ${rateSchedule[2].rate.toFixed(2)}<br />
        7/1/28 ${rateSchedule[1].rate.toFixed(2)}<br />
        7/1/29 ${rateSchedule[0].rate.toFixed(2)}
      </div>

      <button
        onClick={handleCalculate}
        style={{
          marginTop: "1.5rem",
          backgroundColor: "#007bff",
          color: "#ffffff",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "6px",
          fontSize: "1.2rem",
          width: "90%",
          maxWidth: "320px"
        }}
      >
        Calculate
      </button>

      {(offDutyDuration || detentionDuration || amountEarned) && (
        <div style={{ marginTop: "2rem", backgroundColor: "#1a1a1a", padding: "1rem", borderRadius: "8px", border: "1px solid #333" }}>
          {offDutyDuration && (
            <div style={{ marginBottom: "0.5rem" }}>
              ⏰ <strong>Off Duty:</strong> {offDutyDuration}
            </div>
          )}
          {detentionDuration && (
            <div style={{ marginBottom: "0.5rem" }}>
              🕰️ <strong>Detention Time:</strong> {detentionDuration}
            </div>
          )}
          {amountEarned && (
            <div>
              💵 <strong>Amount Earned:</strong> ${amountEarned}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';

export default function AgeCalculator({ copyToClipboard, showToast }) {
  const [dob, setDob] = useState('');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const calc = (() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const target = new Date(toDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const heartbeats = totalHours * 60 * 70;

    // Next birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= target) nextBday.setFullYear(target.getFullYear() + 1);
    const daysToNextBday = Math.ceil((nextBday - target) / (1000 * 60 * 60 * 24));

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDay = dayNames[birth.getDay()];
    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, heartbeats, daysToNextBday, birthDay, zodiac };
  })();

  function getZodiac(month, day) {
    const signs = [
      [1, 20, 'Capricorn ♑'], [2, 19, 'Aquarius ♒'], [3, 20, 'Pisces ♓'],
      [4, 20, 'Aries ♈'], [5, 21, 'Taurus ♉'], [6, 21, 'Gemini ♊'],
      [7, 22, 'Cancer ♋'], [8, 23, 'Leo ♌'], [9, 23, 'Virgo ♍'],
      [10, 23, 'Libra ♎'], [11, 22, 'Scorpio ♏'], [12, 22, 'Sagittarius ♐'], [12, 31, 'Capricorn ♑']
    ];
    for (const [m, d, sign] of signs) {
      if (month < m || (month === m && day <= d)) return sign;
    }
    return 'Capricorn ♑';
  }

  const fmtNum = n => n.toLocaleString('en-IN');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="pane">
        <div className="pane-header"><span className="pane-title">Enter Dates</span></div>
        <div className="pane-body" style={{ gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="input-label">Date of Birth</label>
              <input className="input-field" type="date" value={dob} onChange={e => setDob(e.target.value)} max={toDate} />
            </div>
            <div>
              <label className="input-label">Calculate Age As Of</label>
              <input className="input-field" type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setToDate(new Date().toISOString().split('T')[0])}>Today</button>
          </div>
        </div>
      </div>

      {calc && (
        <>
          {/* Main Age Display */}
          <div className="pane" style={{ background: 'var(--accent-purple-dim)', borderColor: 'var(--accent-purple)' }}>
            <div className="pane-body" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Your Age</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { val: calc.years, label: 'Years' },
                  { val: calc.months, label: 'Months' },
                  { val: calc.days, label: 'Days' },
                ].map(({ val, label }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 52, fontWeight: 900, color: 'var(--accent-purple-light)', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>{val}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-row" style={{ flexWrap: 'wrap' }}>
            {[
              { label: 'Total Days Lived', val: fmtNum(calc.totalDays), color: 'var(--accent-cyan)' },
              { label: 'Total Weeks', val: fmtNum(calc.totalWeeks), color: 'var(--accent-emerald)' },
              { label: 'Total Months', val: fmtNum(calc.totalMonths), color: 'var(--accent-amber)' },
              { label: 'Total Hours', val: fmtNum(calc.totalHours), color: 'var(--text-secondary)' },
              { label: '💓 Heartbeats Est.', val: fmtNum(calc.heartbeats), color: 'var(--accent-rose)' },
              { label: '🎂 Days to Birthday', val: `${fmtNum(calc.daysToNextBday)} days`, color: 'var(--accent-purple-light)' },
            ].map(({ label, val, color }) => (
              <div key={label} className="stat-card" style={{ flex: '1 1 150px' }}>
                <div className="stat-label">{label}</div>
                <div className="stat-value" style={{ color, fontSize: 18 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Fun Facts */}
          <div className="pane">
            <div className="pane-header"><span className="pane-title">Fun Facts</span></div>
            <div className="pane-body" style={{ gap: 10 }}>
              {[
                { icon: '📅', label: 'Born on', val: calc.birthDay },
                { icon: '⭐', label: 'Zodiac Sign', val: calc.zodiac },
                { icon: '🎂', label: 'Next Birthday', val: `${calc.daysToNextBday} days away` },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-primary)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{icon} {label}</span>
                  <strong style={{ color: 'var(--text-heading)', fontSize: 14 }}>{val}</strong>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {dob && !calc && <div style={{ textAlign: 'center', color: 'var(--accent-rose)', padding: 20 }}>⚠ Invalid dates or Date of birth cannot be after the target date</div>}
    </div>
  );
}

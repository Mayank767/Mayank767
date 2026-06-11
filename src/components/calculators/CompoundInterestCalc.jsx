import React, { useState, useMemo } from 'react';

const formatINR = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);

const FREQUENCIES = [
  { label: 'Monthly', value: 12 },
  { label: 'Quarterly', value: 4 },
  { label: 'Half-Yearly', value: 2 },
  { label: 'Yearly', value: 1 },
];

function DonutChart({ principal, interest, size = 180 }) {
  const total = principal + interest;
  if (total === 0) return null;
  const principalPct = principal / total;
  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 28;
  const circumference = 2 * Math.PI * radius;
  const principalDash = circumference * principalPct;
  const interestDash = circumference * (1 - principalPct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Interest arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--accent-purple)"
          strokeWidth={stroke}
          strokeDasharray={`${interestDash} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        {/* Principal arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--accent-rose)"
          strokeWidth={stroke}
          strokeDasharray={`${principalDash} ${circumference}`}
          strokeDashoffset={-interestDash}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text-heading)" fontSize="14" fontWeight="700">
          {formatINR(total)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="11">
          Maturity Amount
        </text>
      </svg>
      <div style={{ display: 'flex', gap: 20 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-rose)', display: 'inline-block' }} />
          Principal
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }} />
          Interest
        </span>
      </div>
    </div>
  );
}

export default function CompoundInterestCalc({ copyToClipboard, showToast }) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [timePeriod, setTimePeriod] = useState(5);
  const [frequency, setFrequency] = useState(12);
  const [showTable, setShowTable] = useState(false);

  const results = useMemo(() => {
    const P = Number(principal) || 0;
    const annualRate = Number(rate) || 0;
    const t = Number(timePeriod) || 0;
    const n = Number(frequency);
    const r = annualRate / 100;

    // A = P(1 + r/n)^(nt)
    let maturityAmount = 0;
    if (P > 0 && t > 0) {
      maturityAmount = P * Math.pow(1 + r / n, n * t);
    }

    const totalInterest = maturityAmount - P;

    // Year-by-year breakdown
    const yearlyData = [];
    for (let y = 1; y <= t; y++) {
      const amount = P * Math.pow(1 + r / n, n * y);
      const interest = amount - P;
      const prevAmount = y === 1 ? P : P * Math.pow(1 + r / n, n * (y - 1));
      const yearInterest = amount - prevAmount;
      yearlyData.push({
        year: y,
        openingBalance: prevAmount,
        interestEarned: yearInterest,
        closingBalance: amount,
        totalInterest: interest,
      });
    }

    return { principal: P, totalInterest, maturityAmount, yearlyData };
  }, [principal, rate, timePeriod, frequency]);

  const selectedFreqLabel = FREQUENCIES.find((f) => f.value === frequency)?.label || 'Monthly';

  const handleCopyResults = () => {
    const text = `Compound Interest Calculator Results\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPrincipal: ${formatINR(results.principal)}\nAnnual Rate: ${rate}%\nTime Period: ${timePeriod} years\nCompounding: ${selectedFreqLabel}\n\nTotal Interest: ${formatINR(results.totalInterest)}\nMaturity Amount: ${formatINR(results.maturityAmount)}`;
    copyToClipboard(text);
    showToast('Results copied to clipboard!');
  };

  return (
    <div className="pane" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="pane-header">
        <span className="pane-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Compound Interest Calculator
        </span>
        <button className="btn btn-sm" onClick={handleCopyResults}>
          Copy Results
        </button>
      </div>

      <div className="pane-body">
        <div className="split-pane">
          {/* Left: Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="input-field">
              <label className="input-label">Principal Amount (₹)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                min={0}
                step={10000}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--bg-elevated)',
                  borderRadius: 8,
                  color: 'var(--text-heading)',
                  fontSize: 15,
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            <div className="input-field">
              <label className="input-label">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Math.max(0, Math.min(100, Number(e.target.value))))}
                min={0}
                max={100}
                step={0.25}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--bg-elevated)',
                  borderRadius: 8,
                  color: 'var(--text-heading)',
                  fontSize: 15,
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            <div className="input-field">
              <label className="input-label">
                Time Period: <strong style={{ color: 'var(--accent-purple)' }}>{timePeriod} {timePeriod === 1 ? 'Year' : 'Years'}</strong>
              </label>
              <input
                type="range"
                className="slider"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                min={1}
                max={30}
                step={1}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>1 Yr</span>
                <span>10 Yrs</span>
                <span>20 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>

            <div className="input-field">
              <label className="input-label">Compounding Frequency</label>
              <div className="tab-group" style={{ display: 'flex', gap: 0 }}>
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    className={`tab-btn${frequency === f.value ? ' active' : ''}`}
                    onClick={() => setFrequency(f.value)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      fontSize: 12,
                      fontWeight: frequency === f.value ? 600 : 400,
                      background: frequency === f.value ? 'var(--accent-purple)' : 'var(--bg-primary)',
                      color: frequency === f.value ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--bg-elevated)',
                      cursor: 'pointer',
                      borderRadius:
                        f.value === 12
                          ? '8px 0 0 8px'
                          : f.value === 1
                          ? '0 8px 8px 0'
                          : '0',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Donut Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <DonutChart principal={results.principal} interest={results.totalInterest} />
          </div>
        </div>

        {/* Results Cards */}
        <div className="stats-row" style={{ marginTop: 24 }}>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-rose)' }}>
            <div className="stat-label">Principal Amount</div>
            <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
              {formatINR(results.principal)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Initial investment
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-purple)' }}>
            <div className="stat-label">Total Interest</div>
            <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
              {formatINR(results.totalInterest)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {results.principal > 0 ? ((results.totalInterest / results.principal) * 100).toFixed(1) : 0}% of principal
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--text-heading)', background: 'var(--bg-elevated)' }}>
            <div className="stat-label">Maturity Amount</div>
            <div className="stat-value" style={{ color: 'var(--text-heading)' }}>
              {formatINR(results.maturityAmount)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {selectedFreqLabel} compounding
            </div>
          </div>
        </div>

        {/* Effective Rate Info */}
        <div style={{
          marginTop: 16,
          padding: '10px 16px',
          background: 'var(--bg-elevated)',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Effective Annual Rate</span>
          <span style={{ color: 'var(--accent-purple)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            {((Math.pow(1 + (rate / 100) / frequency, frequency) - 1) * 100).toFixed(2)}%
          </span>
        </div>

        {/* Year-by-Year Table (Collapsible) */}
        <div style={{ marginTop: 20 }}>
          <button
            className="btn btn-sm"
            onClick={() => setShowTable((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              width: '100%',
              justifyContent: 'center',
              padding: '10px 0',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: showTable ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {showTable ? 'Hide' : 'Show'} Year-by-Year Breakdown
          </button>

          {showTable && (
            <div
              style={{
                marginTop: 12,
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--bg-elevated)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    {['Year', 'Opening Bal.', 'Interest', 'Closing Bal.'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 12px',
                          textAlign: h === 'Year' ? 'left' : 'right',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                          fontSize: 11,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((row) => (
                    <tr
                      key={row.year}
                      style={{
                        borderTop: '1px solid var(--bg-elevated)',
                        background: row.year % 2 === 0 ? 'var(--bg-surface)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '9px 12px', color: 'var(--text-heading)' }}>{row.year}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>
                        {formatINR(row.openingBalance)}
                      </td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', color: 'var(--accent-purple)' }}>
                        {formatINR(row.interestEarned)}
                      </td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', color: 'var(--text-heading)', fontWeight: 600 }}>
                        {formatINR(row.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Formula reference */}
        <div
          style={{
            marginTop: 20,
            padding: '12px 16px',
            background: 'var(--bg-surface)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: 'var(--text-heading)' }}>Formula:</strong> A = P(1 + r/n)<sup>nt</sup>
          <br />
          <span>
            where P = {formatINR(principal)}, r = {rate}%, n = {frequency} ({selectedFreqLabel}), t = {timePeriod} yrs
          </span>
        </div>
      </div>
    </div>
  );
}

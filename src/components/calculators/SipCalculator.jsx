import React, { useState, useMemo } from 'react';

const formatINR = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);

function DonutChart({ invested, returns, size = 180 }) {
  const total = invested + returns;
  if (total === 0) return null;
  const investedPct = invested / total;
  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 28;
  const circumference = 2 * Math.PI * radius;
  const investedDash = circumference * investedPct;
  const returnsDash = circumference * (1 - investedPct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Returns arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--accent-purple)"
          strokeWidth={stroke}
          strokeDasharray={`${returnsDash} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        {/* Invested arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--accent-rose)"
          strokeWidth={stroke}
          strokeDasharray={`${investedDash} ${circumference}`}
          strokeDashoffset={-returnsDash}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text-heading)" fontSize="14" fontWeight="700">
          {formatINR(total)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="11">
          Total Value
        </text>
      </svg>
      <div style={{ display: 'flex', gap: 20 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-rose)', display: 'inline-block' }} />
          Invested
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }} />
          Returns
        </span>
      </div>
    </div>
  );
}

export default function SipCalculator({ copyToClipboard, showToast }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const results = useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const annualRate = Number(annualReturn) || 0;
    const n = (Number(years) || 0) * 12;
    const r = annualRate / 12 / 100;

    let totalValue = 0;
    if (r > 0 && n > 0) {
      totalValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    } else if (r === 0) {
      totalValue = P * n;
    }

    const totalInvested = P * n;
    const estimatedReturns = totalValue - totalInvested;

    // Year-by-year breakdown
    const yearlyData = [];
    for (let y = 1; y <= (Number(years) || 0); y++) {
      const months = y * 12;
      let fv = 0;
      if (r > 0) {
        fv = P * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
      } else {
        fv = P * months;
      }
      const invested = P * months;
      yearlyData.push({
        year: y,
        invested,
        value: fv,
        returns: fv - invested,
      });
    }

    return { totalInvested, estimatedReturns, totalValue, yearlyData };
  }, [monthlyInvestment, annualReturn, years]);

  const handleCopyResults = () => {
    const text = `SIP Calculator Results\n━━━━━━━━━━━━━━━━━━━━━\nMonthly Investment: ${formatINR(monthlyInvestment)}\nExpected Return: ${annualReturn}% p.a.\nDuration: ${years} years\n\nTotal Invested: ${formatINR(results.totalInvested)}\nEstimated Returns: ${formatINR(results.estimatedReturns)}\nTotal Value: ${formatINR(results.totalValue)}`;
    copyToClipboard(text);
    showToast('Results copied to clipboard!');
  };

  return (
    <div className="pane" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="pane-header">
        <span className="pane-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          SIP Calculator
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
              <label className="input-label">Monthly Investment (₹)</label>
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                min={0}
                step={500}
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
              <label className="input-label">Expected Annual Return (%)</label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Math.max(0, Math.min(50, Number(e.target.value))))}
                min={0}
                max={50}
                step={0.5}
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
                Investment Duration: <strong style={{ color: 'var(--accent-purple)' }}>{years} {years === 1 ? 'Year' : 'Years'}</strong>
              </label>
              <input
                type="range"
                className="slider"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min={1}
                max={40}
                step={1}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>1 Yr</span>
                <span>10 Yrs</span>
                <span>20 Yrs</span>
                <span>30 Yrs</span>
                <span>40 Yrs</span>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div>
              <label className="label" style={{ marginBottom: 8, display: 'block', fontSize: 12, color: 'var(--text-muted)' }}>Quick Presets</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: '₹1K / 5Y', m: 1000, y: 5 },
                  { label: '₹5K / 10Y', m: 5000, y: 10 },
                  { label: '₹10K / 15Y', m: 10000, y: 15 },
                  { label: '₹25K / 20Y', m: 25000, y: 20 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    className="btn btn-sm"
                    onClick={() => {
                      setMonthlyInvestment(preset.m);
                      setYears(preset.y);
                    }}
                    style={{ fontSize: 11 }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Donut Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <DonutChart invested={results.totalInvested} returns={results.estimatedReturns} />
          </div>
        </div>

        {/* Results Cards */}
        <div className="stats-row" style={{ marginTop: 24 }}>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-rose)' }}>
            <div className="stat-label">Total Invested</div>
            <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
              {formatINR(results.totalInvested)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {formatINR(monthlyInvestment)} × {years * 12} months
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-purple)' }}>
            <div className="stat-label">Estimated Returns</div>
            <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
              {formatINR(results.estimatedReturns)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {results.totalInvested > 0 ? ((results.estimatedReturns / results.totalInvested) * 100).toFixed(1) : 0}% gain
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--text-heading)', background: 'var(--bg-elevated)' }}>
            <div className="stat-label">Total Value</div>
            <div className="stat-value" style={{ color: 'var(--text-heading)' }}>
              {formatINR(results.totalValue)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              After {years} {years === 1 ? 'year' : 'years'}
            </div>
          </div>
        </div>

        {/* Year-by-Year Table (Collapsible) */}
        <div style={{ marginTop: 24 }}>
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
            {showTable ? 'Hide' : 'Show'} Year-by-Year Growth
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
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Invested</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Returns</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Value</th>
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
                      <td style={{ padding: '9px 14px', color: 'var(--text-heading)' }}>{row.year}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--accent-rose)' }}>{formatINR(row.invested)}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--accent-purple)' }}>{formatINR(row.returns)}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text-heading)', fontWeight: 600 }}>{formatINR(row.value)}</td>
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
          <strong style={{ color: 'var(--text-heading)' }}>Formula:</strong> FV = P × [(1+r)<sup>n</sup> – 1] / r × (1+r)
          <br />
          <span>where P = Monthly Investment, r = Monthly Rate ({(annualReturn / 12).toFixed(4)}%), n = Total Months ({years * 12})</span>
        </div>
      </div>
    </div>
  );
}

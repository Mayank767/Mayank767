import React, { useState, useMemo, useEffect } from 'react';

export default function EmiCalculator({ copyToClipboard, showToast }) {
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('60');
  const [tenureType, setTenureType] = useState('months');
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    let script = document.getElementById('faq-schema-emi');
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-schema-emi';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is the EMI calculated mathematically?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "EMI is calculated using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]. Here P is the Principal loan amount, R is the monthly interest rate, and N is the total number of monthly installments."
          }
        },
        {
          "@type": "Question",
          "name": "What is an amortization schedule?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off."
          }
        },
        {
          "@type": "Question",
          "name": "Does the interest component change over time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. In the early years of your loan, a large portion of your EMI goes towards paying the interest. As you continue to pay off the principal, the interest component decreases and the principal component increases."
          }
        }
      ]
    });

    return () => {
      const existingScript = document.getElementById('faq-schema-emi');
      if (existingScript) existingScript.remove();
    };
  }, []);

  const calc = useMemo(() => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 12 / 100;
    const N = tenureType === 'years' ? parseFloat(tenure) * 12 : parseFloat(tenure);
    if (!P || isNaN(R) || !N || isNaN(P) || isNaN(N)) return null;
    let emi, totalPayment, totalInterest;
    if (R === 0) {
      emi = P / N;
      totalPayment = P;
      totalInterest = 0;
    } else {
      emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      totalPayment = emi * N;
      totalInterest = totalPayment - P;
    }
    return { emi, totalPayment, totalInterest, months: N, principal: P };
  }, [principal, rate, tenure, tenureType]);

  const table = useMemo(() => {
    if (!calc) return [];
    const { emi, months, principal: P } = calc;
    const R = parseFloat(rate) / 12 / 100;
    const rows = [];
    let balance = P;
    for (let i = 1; i <= months; i++) {
      const interest = balance * R;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      rows.push({ month: i, emi, interest, principalPaid, balance: Math.max(0, balance) });
    }
    return rows;
  }, [calc, rate]);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const pct = calc ? ((calc.principal / calc.totalPayment) * 100).toFixed(1) : 50;
  const interestPct = calc ? (100 - parseFloat(pct)).toFixed(1) : 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Inputs */}
      <div className="pane">
        <div className="pane-header"><span className="pane-title">Loan Details</span></div>
        <div className="pane-body" style={{ gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="input-label">Loan Amount (₹)</label>
              <input className="input-field" type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="500000" min="0" />
            </div>
            <div>
              <label className="input-label">Annual Interest Rate (%)</label>
              <input className="input-field" type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="8.5" step="0.1" min="0" />
            </div>
          </div>
          <div>
            <label className="input-label">Loan Tenure</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input className="input-field" type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="60" min="1" style={{ flex: 1 }} />
              <div className="tab-group">
                <button className={`tab-btn ${tenureType === 'months' ? 'active' : ''}`} onClick={() => setTenureType('months')}>Months</button>
                <button className={`tab-btn ${tenureType === 'years' ? 'active' : ''}`} onClick={() => setTenureType('years')}>Years</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {calc && (
        <>
          <div className="stats-row">
            <div className="stat-card" style={{ borderColor: 'var(--accent-purple)', background: 'var(--accent-purple-dim)' }}>
              <div className="stat-label">Monthly EMI</div>
              <div className="stat-value" style={{ color: 'var(--accent-purple-light)', fontSize: 28 }}>{fmt(calc.emi)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Interest</div>
              <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>{fmt(calc.totalInterest)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Payment</div>
              <div className="stat-value">{fmt(calc.totalPayment)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Loan Tenure</div>
              <div className="stat-value">{calc.months} months</div>
            </div>
          </div>

          {/* Visual breakdown */}
          <div className="pane">
            <div className="pane-header"><span className="pane-title">Payment Breakdown</span></div>
            <div className="pane-body">
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* SVG Donut */}
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
                  <circle cx="70" cy="70" r="55" fill="none" stroke="var(--accent-rose)" strokeWidth="20" />
                  <circle cx="70" cy="70" r="55" fill="none" stroke="var(--accent-purple)" strokeWidth="20"
                    strokeDasharray={`${parseFloat(pct) * 3.456} ${(100 - parseFloat(pct)) * 3.456}`}
                    strokeDashoffset="86.4" transform="rotate(-90 70 70)" />
                  <text x="70" y="66" textAnchor="middle" fill="var(--text-heading)" fontSize="13" fontWeight="700">{fmt(calc.emi)}</text>
                  <text x="70" y="82" textAnchor="middle" fill="var(--text-muted)" fontSize="10">per month</text>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <span style={{ width: 12, height: 12, background: 'var(--accent-purple)', borderRadius: 3, display: 'inline-block' }} />
                        Principal Amount
                      </span>
                      <strong style={{ color: 'var(--accent-purple-light)' }}>{pct}%</strong>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-purple)', borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{fmt(calc.principal)}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <span style={{ width: 12, height: 12, background: 'var(--accent-rose)', borderRadius: 3, display: 'inline-block' }} />
                        Total Interest
                      </span>
                      <strong style={{ color: 'var(--accent-rose)' }}>{interestPct}%</strong>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${interestPct}%`, background: 'var(--accent-rose)', borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{fmt(calc.totalInterest)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Table */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Amortization Schedule</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowTable(v => !v)}>
                {showTable ? '▲ Hide' : '▼ Show'} Table
              </button>
            </div>
            {showTable && (
              <div className="pane-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto', maxHeight: 360 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)' }}>
                      <tr>
                        {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700, borderBottom: '1px solid var(--border-primary)', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-surface)' }}>
                          <td style={{ padding: '8px 14px', textAlign: 'right', color: 'var(--text-muted)' }}>{row.month}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', color: 'var(--text-primary)' }}>{fmt(row.emi)}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', color: 'var(--accent-cyan)' }}>{fmt(row.principalPaid)}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', color: 'var(--accent-rose)' }}>{fmt(row.interest)}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 600 }}>{fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* SEO & Info Section */}
      <div className="seo-content" style={{ marginTop: '20px', padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px', fontSize: '1.5rem' }}>Understanding the EMI Calculation Logic</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>The EMI Formula Breakdown</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>
              The mathematical formula used to calculate the Equated Monthly Installment is:
            </p>
            <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '6px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent-purple-light)', marginBottom: '12px' }}>
              E = P × R × [ (1+R)^N / ((1+R)^N - 1) ]
            </div>
            <ul style={{ fontSize: '13px', lineHeight: 1.6, margin: 0, paddingLeft: '20px' }}>
              <li><strong>E:</strong> Equated Monthly Installment (EMI)</li>
              <li><strong>P:</strong> Principal Loan Amount</li>
              <li><strong>R:</strong> Monthly Interest Rate (Annual Rate / 12 / 100)</li>
              <li><strong>N:</strong> Loan Tenure in Months</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>Worked Example</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>Let's calculate the EMI for a <strong>₹5,00,000</strong> loan at <strong>8.5%</strong> annual interest for <strong>5 years</strong> (60 months):</p>
            <ul style={{ fontSize: '13px', lineHeight: 1.6, margin: 0, paddingLeft: '20px', fontFamily: 'var(--font-mono)' }}>
              <li>P = 500000</li>
              <li>R = 8.5 / 12 / 100 = 0.007083</li>
              <li>N = 60</li>
              <li style={{ marginTop: '8px', color: 'var(--accent-cyan)' }}>E = 500000 × 0.007083 × [(1.007083)^60 / ((1.007083)^60 - 1)]</li>
              <li style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--accent-purple-light)' }}>EMI ≈ ₹10,258</li>
            </ul>
          </div>
        </div>

        <h3 style={{ color: 'var(--text-heading)', marginBottom: '16px', fontSize: '1.2rem' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.05rem' }}>How is the EMI calculated mathematically?</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>EMI is calculated using the formula: <code>EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]</code>. Here P is the Principal loan amount, R is the monthly interest rate, and N is the total number of monthly installments.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.05rem' }}>What is an amortization schedule?</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off. Our calculator generates this automatically so you can track your outstanding balance.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.05rem' }}>Does the interest component change over time?</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>Yes. In the early years of your loan, a large portion of your EMI goes towards paying the interest. As you continue to pay off the principal, the interest component decreases and the principal component increases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

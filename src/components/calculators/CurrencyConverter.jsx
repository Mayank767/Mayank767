import React, { useState, useEffect, useCallback } from 'react';

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
];

const QUICK_PAIRS = [
  { from: 'USD', to: 'INR' }, { from: 'EUR', to: 'INR' }, { from: 'GBP', to: 'INR' },
  { from: 'AED', to: 'INR' }, { from: 'USD', to: 'EUR' }, { from: 'USD', to: 'GBP' },
];

export default function CurrencyConverter({ copyToClipboard, showToast }) {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchRates = useCallback(async (base) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setRates({ ...data.rates, [base]: 1 });
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch (e) {
      setError('Failed to fetch rates. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(from); }, [from, fetchRates]);

  const converted = rates && rates[to] ? (parseFloat(amount) * rates[to]).toFixed(4) : null;
  const fromCur = CURRENCIES.find(c => c.code === from);
  const toCur = CURRENCIES.find(c => c.code === to);

  const swap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  const fmtNum = (n, decimals = 4) => {
    const num = parseFloat(n);
    if (isNaN(num)) return '—';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    return num.toLocaleString('en-IN', { maximumFractionDigits: decimals });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Main Converter */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Currency Converter</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {lastUpdated && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated: {lastUpdated}</span>}
            <button className="btn btn-secondary btn-sm" onClick={() => fetchRates(from)} disabled={loading}>
              {loading ? '⏳' : '🔄'} Refresh
            </button>
          </div>
        </div>
        <div className="pane-body" style={{ gap: 16 }}>
          {error && <div style={{ color: 'var(--accent-rose)', fontSize: 13, padding: '10px 14px', background: 'var(--accent-rose-dim)', borderRadius: 8 }}>⚠ {error}</div>}

          {/* Amount */}
          <div>
            <label className="input-label">Amount</label>
            <input className="input-field" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1" min="0" style={{ fontSize: 20, fontWeight: 700 }} />
          </div>

          {/* Currency Pair */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end' }}>
            <div>
              <label className="input-label">From</label>
              <select className="input-field" value={from} onChange={e => setFrom(e.target.value)} style={{ fontSize: 15 }}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
              </select>
            </div>
            <button className="btn btn-secondary" onClick={swap} style={{ marginBottom: 0, padding: '10px 16px', fontSize: 20 }} title="Swap currencies">⇄</button>
            <div>
              <label className="input-label">To</label>
              <select className="input-field" value={to} onChange={e => setTo(e.target.value)} style={{ fontSize: 15 }}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Result */}
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>⏳ Fetching live rates...</div>
          ) : converted !== null && (
            <div style={{ background: 'var(--accent-purple-dim)', border: '1px solid var(--accent-purple)', borderRadius: 12, padding: '24px 20px', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => { copyToClipboard(converted); showToast('Amount copied!'); }}>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                {fmtNum(amount, 2)} {fromCur?.flag} {from} =
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--accent-purple-light)', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                {fmtNum(converted, 2)}
              </div>
              <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 8 }}>{toCur?.flag} {to} — {toCur?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
                1 {from} = {rates?.[to] ? fmtNum(rates[to]) : '—'} {to} · Click to copy
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Pairs */}
      {rates && (
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Quick Reference (1 unit)</span></div>
          <div className="pane-body" style={{ gap: 8 }}>
            {QUICK_PAIRS.filter(p => rates[p.from] !== undefined && rates[p.to] !== undefined).map(pair => {
              const rate = pair.from === from ? rates[pair.to] : (1 / rates[pair.from]) * rates[pair.to];
              const f = CURRENCIES.find(c => c.code === pair.from);
              const t = CURRENCIES.find(c => c.code === pair.to);
              return (
                <div key={pair.from + pair.to}
                  onClick={() => { setFrom(pair.from); setTo(pair.to); }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 8, cursor: 'pointer', transition: 'all 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{f?.flag} 1 {pair.from}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-heading)' }}>= {f?.flag !== t?.flag ? t?.flag : ''} {fmtNum(rate, 2)} {pair.to}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        📡 Powered by <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan-light)' }}>Frankfurter API</a> · ECB reference rates · Updated daily
      </div>
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function PasswordInput({ id, label, value, onChange, placeholder, required }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="input-label" htmlFor={id}>{label}</label>
      <div style={{ position: 'relative', marginTop: 6 }}>
        <input
          id={id}
          className="input-field"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          style={{ paddingRight: 44, fontFamily: 'var(--font-mono)' }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1, padding: 4,
          }}
          title={show ? 'Hide' : 'Show'}
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
}

function LockTab({ showToast }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isLocking, setIsLocking] = useState(false);
  const fileInputRef = useRef(null);

  const loadFile = useCallback((f) => {
    if (!(f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
      showToast('Please upload a valid PDF file.', 'error');
      return;
    }
    setFile(f);
  }, [showToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
    e.target.value = '';
  };

  const lockPdf = async () => {
    if (!file) return;
    if (!userPassword.trim()) {
      showToast('Please enter a user password.', 'error');
      return;
    }
    setIsLocking(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const saveOptions = {
        userPassword: userPassword,
      };
      if (ownerPassword.trim()) {
        saveOptions.ownerPassword = ownerPassword;
      }
      const outBytes = await pdfDoc.save(saveOptions);
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `locked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('PDF locked and downloaded! 🔒', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to lock PDF. Please try again.', 'error');
    } finally {
      setIsLocking(false);
    }
  };

  const reset = () => { setFile(null); setUserPassword(''); setOwnerPassword(''); };
  const passwordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 4) return { label: 'Weak', color: 'var(--accent-rose)' };
    if (pw.length < 8) return { label: 'Fair', color: 'var(--accent-amber)' };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 8) return { label: 'Strong', color: 'var(--accent-cyan)' };
    return { label: 'Good', color: '#22c55e' };
  };
  const strength = passwordStrength(userPassword);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Drop Zone / File */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-rose)' : 'var(--border-primary)'}`,
            borderRadius: 12,
            padding: '32px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? 'rgba(244,63,94,0.06)' : 'var(--bg-elevated)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔓</div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>
            Drop an unlocked PDF to protect
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Single PDF file</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-secondary)',
          borderRadius: 10, padding: '12px 16px',
        }}>
          <span style={{ fontSize: '1.6rem' }}>📄</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {file.name}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>
              {formatSize(file.size)}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={reset} style={{ color: 'var(--accent-rose)' }}>
            ✕
          </button>
        </div>
      )}

      {/* Password Fields */}
      {file && (
        <>
          <PasswordInput
            id="user-password"
            label="🔑 User Password (open password) *"
            value={userPassword}
            onChange={setUserPassword}
            placeholder="Required to open the PDF"
          />
          {strength && (
            <div style={{ marginTop: -10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-secondary)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: strength.color,
                  width: strength.label === 'Weak' ? '25%' : strength.label === 'Fair' ? '50%' : strength.label === 'Good' ? '75%' : '100%',
                  transition: 'width 0.3s, background 0.3s',
                }} />
              </div>
              <span style={{ color: strength.color, fontSize: '0.78rem', fontWeight: 600, minWidth: 48 }}>
                {strength.label}
              </span>
            </div>
          )}

          <PasswordInput
            id="owner-password"
            label="🛡️ Owner Password (permissions) — Optional"
            value={ownerPassword}
            onChange={setOwnerPassword}
            placeholder="Prevents editing/printing/copying"
          />

          <div style={{
            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5,
          }}>
            🔒 <strong>User password</strong> is required to open the file.&nbsp;
            <strong>Owner password</strong> restricts editing, printing, and copying.
          </div>

          <button
            className="btn btn-primary"
            onClick={lockPdf}
            disabled={!userPassword.trim() || isLocking}
            style={{ width: '100%' }}
          >
            {isLocking ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block'
                }} />
                Locking PDF…
              </span>
            ) : '🔒 Lock & Download PDF'}
          </button>
        </>
      )}
    </div>
  );
}

function UnlockTab({ showToast }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const fileInputRef = useRef(null);

  const loadFile = useCallback((f) => {
    if (!(f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
      showToast('Please upload a valid PDF file.', 'error');
      return;
    }
    setFile(f);
  }, [showToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
    e.target.value = '';
  };

  const unlockPdf = async () => {
    if (!file) return;
    setIsUnlocking(true);
    try {
      const bytes = await file.arrayBuffer();
      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(bytes, {
          password: password || undefined,
          ignoreEncryption: false,
        });
      } catch {
        // Try with ignoreEncryption as fallback
        try {
          pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        } catch {
          showToast('Incorrect password or unsupported encryption.', 'error');
          setIsUnlocking(false);
          return;
        }
      }

      // Re-save without password options
      const outBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unlocked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Password removed and PDF downloaded! 🔓', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to unlock PDF. Check the password and try again.', 'error');
    } finally {
      setIsUnlocking(false);
    }
  };

  const reset = () => { setFile(null); setPassword(''); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Note */}
      <div style={{
        background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--accent-amber)', lineHeight: 1.5,
      }}>
        ⚠️ This tool can only remove passwords you already know. It cannot brute-force protected PDFs.
      </div>

      {/* Drop Zone / File */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-cyan)' : 'var(--border-primary)'}`,
            borderRadius: 12,
            padding: '32px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? 'rgba(6,182,212,0.06)' : 'var(--bg-elevated)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔐</div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>
            Drop a password-protected PDF
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Single PDF file</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-secondary)',
          borderRadius: 10, padding: '12px 16px',
        }}>
          <span style={{ fontSize: '1.6rem' }}>🔐</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {file.name}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>
              {formatSize(file.size)}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={reset} style={{ color: 'var(--accent-rose)' }}>✕</button>
        </div>
      )}

      {file && (
        <>
          <PasswordInput
            id="current-password"
            label="🔑 Current Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter the PDF's current password"
          />

          <button
            className="btn btn-primary"
            onClick={unlockPdf}
            disabled={isUnlocking}
            style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent-cyan), #0891b2)' }}
          >
            {isUnlocking ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block'
                }} />
                Removing Password…
              </span>
            ) : '🔓 Remove Password & Download'}
          </button>
        </>
      )}
    </div>
  );
}

export default function PdfPassword({ copyToClipboard, showToast }) {
  const [activeTab, setActiveTab] = useState('lock');

  return (
    <div className="pane" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="pane-header">
        <span className="pane-title">🔐 PDF Password</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Lock or unlock PDF files
        </span>
      </div>
      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Tabs */}
        <div className="tab-group" style={{ display: 'flex', gap: 6 }}>
          <button
            className={`tab-btn${activeTab === 'lock' ? ' active' : ''}`}
            onClick={() => setActiveTab('lock')}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 8,
              background: activeTab === 'lock' ? 'var(--accent-purple-dim)' : 'var(--bg-elevated)',
              border: `1.5px solid ${activeTab === 'lock' ? 'var(--accent-purple)' : 'var(--border-secondary)'}`,
              color: activeTab === 'lock' ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            🔒 Lock PDF
          </button>
          <button
            className={`tab-btn${activeTab === 'unlock' ? ' active' : ''}`}
            onClick={() => setActiveTab('unlock')}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 8,
              background: activeTab === 'unlock' ? 'rgba(6,182,212,0.12)' : 'var(--bg-elevated)',
              border: `1.5px solid ${activeTab === 'unlock' ? 'var(--accent-cyan)' : 'var(--border-secondary)'}`,
              color: activeTab === 'unlock' ? 'var(--accent-cyan-light)' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            🔓 Remove Password
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'lock' ? (
          <LockTab showToast={showToast} />
        ) : (
          <UnlockTab showToast={showToast} />
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

import React, { useState, useMemo, useCallback } from 'react';

const STYLES = [
  { id: 'tutorial', label: '📖 Tutorial' },
  { id: 'clickbait', label: '🔥 Clickbait' },
  { id: 'professional', label: '💼 Professional' },
  { id: 'listicle', label: '📋 Listicle' },
  { id: 'howto', label: '🛠️ How-To' },
  { id: 'review', label: '⭐ Review' },
  { id: 'comparison', label: '⚖️ Comparison' },
  { id: 'story', label: '📖 Story' },
];

const POWER_WORDS = [
  'ultimate', 'secret', 'proven', 'insane', 'shocking', 'amazing', 'powerful',
  'essential', 'complete', 'master', 'hack', 'best', 'worst', 'never', 'always',
  'free', 'instant', 'easy', 'fast', 'new', 'top', 'epic', 'mind-blowing',
  'incredible', 'unbelievable', 'crucial', 'critical', 'game-changer', 'mistake',
  'avoid', 'stop', 'truth', 'real', 'honest', 'guaranteed', 'finally',
];

const YEAR = new Date().getFullYear();

const TITLE_TEMPLATES = {
  tutorial: [
    (t) => `${t} Tutorial for Beginners (${YEAR} Edition)`,
    (t) => `Learn ${t} in 10 Minutes - Complete Tutorial`,
    (t) => `${t} Crash Course - Everything You Need to Know`,
    (t) => `The Only ${t} Tutorial You'll Ever Need`,
    (t) => `${t} Step-by-Step Tutorial for Complete Beginners`,
    (t) => `Master ${t} in One Video - Full Tutorial ${YEAR}`,
    (t) => `${t} Tutorial: From Zero to Hero`,
    (t) => `Complete ${t} Guide - No Experience Needed`,
    (t) => `${t} Made Simple - Beginner Friendly Tutorial`,
    (t) => `${t} Full Course (${YEAR}) - Learn Everything!`,
    (t) => `${t} Explained in 15 Minutes`,
    (t) => `Your First ${t} Project - Hands-On Tutorial`,
    (t) => `${t} Fundamentals Every Beginner Must Know`,
    (t) => `${t} Tutorial: Build Your First Project Today`,
  ],
  clickbait: [
    (t) => `I Tried ${t} for 30 Days - Here's What Happened`,
    (t) => `You Won't BELIEVE What ${t} Can Do!`,
    (t) => `${t} Changed My Life Forever (Not Clickbait)`,
    (t) => `The TRUTH About ${t} Nobody Tells You`,
    (t) => `I Wish I Knew This About ${t} Sooner...`,
    (t) => `${t} is a LIE? What They Don't Want You to Know`,
    (t) => `This ${t} Hack Will BLOW YOUR MIND 🤯`,
    (t) => `I Quit ${t} After Discovering This...`,
    (t) => `${t} in ${YEAR} - It's Worse Than You Think`,
    (t) => `Why Everyone is WRONG About ${t}`,
    (t) => `${t} Secret That Pros Don't Share`,
    (t) => `I Spent $10,000 on ${t} So You Don't Have To`,
    (t) => `The DARK Side of ${t} Nobody Talks About`,
    (t) => `${t} Exposed: What Really Happens Behind the Scenes`,
  ],
  professional: [
    (t) => `${t}: A Comprehensive Guide for ${YEAR}`,
    (t) => `Understanding ${t} - Key Concepts and Best Practices`,
    (t) => `${t} in ${YEAR}: Trends, Insights & Analysis`,
    (t) => `The Complete Guide to ${t} for Professionals`,
    (t) => `${t}: What Every Professional Should Know`,
    (t) => `${t} Best Practices and Industry Standards`,
    (t) => `An Introduction to ${t} - Professional Overview`,
    (t) => `${t}: Essential Skills for Career Growth`,
    (t) => `The State of ${t} in ${YEAR} - Expert Analysis`,
    (t) => `${t} Strategies That Drive Real Results`,
    (t) => `Advanced ${t} Techniques for Experienced Users`,
    (t) => `${t}: Building a Strong Foundation`,
    (t) => `How ${t} is Shaping the Future of the Industry`,
    (t) => `${t} Deep Dive: Expert-Level Insights`,
  ],
  listicle: [
    (t) => `10 ${t} Tips That Will Change Your Life`,
    (t) => `7 ${t} Mistakes You're Making Right Now`,
    (t) => `15 Insane ${t} Hacks You Need to Try`,
    (t) => `5 ${t} Secrets Only Experts Know`,
    (t) => `Top 10 ${t} Tools Every Pro Uses in ${YEAR}`,
    (t) => `8 Reasons Why ${t} is Taking Over in ${YEAR}`,
    (t) => `12 ${t} Facts That Will Surprise You`,
    (t) => `20 Must-Know ${t} Tips for Beginners`,
    (t) => `6 ${t} Trends You Can't Ignore`,
    (t) => `The 9 Best ${t} Resources for ${YEAR}`,
    (t) => `11 Mind-Blowing ${t} Examples`,
    (t) => `3 ${t} Rules That Changed Everything for Me`,
    (t) => `Top 5 ${t} Channels You Should Follow`,
    (t) => `25 ${t} Ideas to Inspire Your Next Project`,
  ],
  howto: [
    (t) => `How to ${t} in ${YEAR} (Step-by-Step Guide)`,
    (t) => `How to ${t} Like a Pro - Complete Walkthrough`,
    (t) => `How to ${t} the RIGHT Way (Most People Do It Wrong)`,
    (t) => `How to ${t} in Under 5 Minutes`,
    (t) => `How to ${t} for FREE - No Experience Needed`,
    (t) => `How to ${t} Without Any Special Tools`,
    (t) => `How to Get Started with ${t} Today`,
    (t) => `How to ${t} - The Easiest Method Ever`,
    (t) => `How to ${t} Fast - Proven Method That Works`,
    (t) => `How to ${t} on a Budget (${YEAR} Guide)`,
    (t) => `How to Actually ${t} - No BS Guide`,
    (t) => `How to ${t}: Beginner's Roadmap`,
    (t) => `How to ${t} Like the Pros Do It`,
    (t) => `Stop Making These ${t} Mistakes!`,
  ],
  review: [
    (t) => `${t} Review: Is It Worth It in ${YEAR}?`,
    (t) => `${t} - Honest Review After 6 Months of Use`,
    (t) => `${t} Review: The Good, The Bad & The Ugly`,
    (t) => `Is ${t} Worth the Hype? Brutally Honest Review`,
    (t) => `${t} Review ${YEAR} - Everything You Need to Know`,
    (t) => `${t}: 1 Year Later - Still Worth It?`,
    (t) => `${t} Unboxing & First Impressions`,
    (t) => `Why I Switched to ${t} (And Why You Should Too)`,
    (t) => `${t} Review: Should You Buy It?`,
    (t) => `${t} Deep Dive Review - Pros, Cons & Verdict`,
    (t) => `I Used ${t} for 100 Days - My Honest Review`,
    (t) => `${t} vs The Competition - Which is Better?`,
    (t) => `The Real Truth About ${t} - No Sponsorship`,
    (t) => `${t} in ${YEAR}: Still the Best Choice?`,
  ],
  comparison: [
    (t) => `${t}: Which One Should You Choose in ${YEAR}?`,
    (t) => `The Ultimate ${t} Comparison - Winner Revealed!`,
    (t) => `${t} Showdown: We Tested Them All`,
    (t) => `Best ${t} Options Compared - Side by Side`,
    (t) => `${t} Battle: Premium vs Budget - Worth the Price?`,
    (t) => `${t}: Free vs Paid - The Definitive Comparison`,
    (t) => `I Tested Every ${t} Option So You Don't Have To`,
    (t) => `${t} Face-Off: Which One Wins?`,
    (t) => `Comparing the Best ${t} in ${YEAR}`,
    (t) => `${t}: Old vs New - Is Upgrading Worth It?`,
    (t) => `Top 5 ${t} Options Ranked from Worst to Best`,
    (t) => `${t} Comparison: Which One Saves You More?`,
    (t) => `${t} Head to Head - Performance Test Results`,
    (t) => `Best ${t} for Every Budget (${YEAR} Guide)`,
  ],
  story: [
    (t) => `I Tried ${t} for 30 Days - Here's What Happened`,
    (t) => `How ${t} Completely Changed My Career`,
    (t) => `My ${t} Journey: From Failure to Success`,
    (t) => `The Day ${t} Changed Everything for Me`,
    (t) => `Why I Dropped Everything for ${t}`,
    (t) => `${t} Ruined My Life (In the Best Way Possible)`,
    (t) => `I Was Wrong About ${t} - Here's Why`,
    (t) => `From Zero to Expert: My ${t} Story`,
    (t) => `How I Made $10K with ${t} in 3 Months`,
    (t) => `The Biggest ${t} Lesson I Learned the Hard Way`,
    (t) => `What Happened When I Said Yes to ${t}`,
    (t) => `I Failed at ${t} 100 Times - Then This Happened`,
    (t) => `My Honest Experience with ${t} After 1 Year`,
    (t) => `How ${t} Saved Me From Burning Out`,
  ],
};

const YT_CHAR_LIMIT = 100;

function scoreTitle(title) {
  let score = 50;
  const lower = title.toLowerCase();
  const len = title.length;

  // Length scoring
  if (len >= 40 && len <= 70) score += 15;
  else if (len >= 30 && len <= 80) score += 8;
  else if (len > 100) score -= 10;

  // Power words
  let pwCount = 0;
  POWER_WORDS.forEach(pw => {
    if (lower.includes(pw)) pwCount++;
  });
  score += Math.min(pwCount * 6, 20);

  // Numbers
  if (/\d/.test(title)) score += 8;

  // Emoji
  if (/[\u{1F600}-\u{1FFFF}]/u.test(title)) score += 3;

  // Parentheses (adds context)
  if (/\(.*\)/.test(title)) score += 5;

  // Uppercase words (attention)
  const upperWords = title.split(' ').filter(w => w === w.toUpperCase() && w.length > 2);
  if (upperWords.length > 0 && upperWords.length <= 3) score += 5;

  // Year reference
  if (title.includes(String(YEAR))) score += 4;

  // Starts with "How to"
  if (lower.startsWith('how to')) score += 3;

  // Question mark
  if (title.includes('?')) score += 3;

  return Math.max(0, Math.min(100, score));
}

function getScoreColor(score) {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f0ad4e';
  if (score >= 40) return 'var(--accent-cyan)';
  return 'var(--accent-rose)';
}

function getScoreLabel(score) {
  if (score >= 80) return '🔥 Excellent';
  if (score >= 60) return '👍 Good';
  if (score >= 40) return '👌 Okay';
  return '😕 Weak';
}

export default function YoutubeTitleGen({ copyToClipboard, showToast }) {
  const [topic, setTopic] = useState('');
  const [activeStyle, setActiveStyle] = useState('tutorial');
  const [sortBy, setSortBy] = useState('score');

  const generatedTitles = useMemo(() => {
    const t = topic.trim() || 'Your Topic';
    const templates = TITLE_TEMPLATES[activeStyle] || [];
    return templates.map(fn => {
      const title = fn(t);
      const score = scoreTitle(title);
      return { title, score };
    });
  }, [topic, activeStyle]);

  const sortedTitles = useMemo(() => {
    const sorted = [...generatedTitles];
    if (sortBy === 'score') sorted.sort((a, b) => b.score - a.score);
    else if (sortBy === 'length') sorted.sort((a, b) => a.title.length - b.title.length);
    return sorted;
  }, [generatedTitles, sortBy]);

  const handleCopy = useCallback((title) => {
    copyToClipboard(title);
    showToast('Title copied to clipboard!');
  }, [copyToClipboard, showToast]);

  const handleCopyAll = useCallback(() => {
    const all = sortedTitles.map(t => t.title).join('\n');
    copyToClipboard(all);
    showToast('All titles copied!');
  }, [sortedTitles, copyToClipboard, showToast]);

  const avgScore = useMemo(() => {
    if (generatedTitles.length === 0) return 0;
    return Math.round(generatedTitles.reduce((s, t) => s + t.score, 0) / generatedTitles.length);
  }, [generatedTitles]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Input */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">🎬 YouTube Title Generator</span>
        </div>
        <div className="pane-body">
          <div className="input-field">
            <label className="input-label">Video Topic / Keyword</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., React, Cooking, Photography, AI..."
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-heading)',
                fontSize: '15px',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {STYLES.map(st => (
              <button
                key={st.id}
                className={activeStyle === st.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                onClick={() => setActiveStyle(st.id)}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{sortedTitles.length}</div>
          <div className="stat-label">Titles Generated</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: getScoreColor(avgScore) }}>{avgScore}</div>
          <div className="stat-label">Avg Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{YT_CHAR_LIMIT}</div>
          <div className="stat-label">Char Limit</div>
        </div>
      </div>

      {/* Titles */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Generated Titles</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div className="tab-group">
              <button className={`tab-btn ${sortBy === 'score' ? 'active' : ''}`} onClick={() => setSortBy('score')}>By Score</button>
              <button className={`tab-btn ${sortBy === 'length' ? 'active' : ''}`} onClick={() => setSortBy('length')}>By Length</button>
              <button className={`tab-btn ${sortBy === 'default' ? 'active' : ''}`} onClick={() => setSortBy('default')}>Default</button>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleCopyAll}>📋 Copy All</button>
          </div>
        </div>
        <div className="pane-body" style={{ maxHeight: '520px', overflowY: 'auto' }}>
          {sortedTitles.map((item, i) => {
            const overLimit = item.title.length > YT_CHAR_LIMIT;
            return (
              <div
                key={i}
                onClick={() => handleCopy(item.title)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  marginBottom: '6px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
              >
                {/* Score badge */}
                <div style={{
                  minWidth: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${getScoreColor(item.score)}`,
                }}>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: getScoreColor(item.score), fontFamily: 'var(--font-mono)' }}>
                    {item.score}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-heading)', marginBottom: '4px', lineHeight: 1.4 }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px',
                      color: overLimit ? 'var(--accent-rose)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {item.title.length}/{YT_CHAR_LIMIT} chars
                      {overLimit && ' ⚠️'}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: getScoreColor(item.score),
                      fontWeight: 600,
                    }}>
                      {getScoreLabel(item.score)}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => { e.stopPropagation(); handleCopy(item.title); }}
                  title="Copy title"
                >
                  📋
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoring info */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">📊 Scoring Criteria</span>
        </div>
        <div className="pane-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
          }}>
            {[
              { label: 'Optimal Length (40-70 chars)', icon: '📏', points: '+15' },
              { label: 'Power Words', icon: '💪', points: '+6 each' },
              { label: 'Contains Numbers', icon: '🔢', points: '+8' },
              { label: 'Has Parentheses', icon: '📎', points: '+5' },
              { label: 'Year Reference', icon: '📅', points: '+4' },
              { label: 'Question Mark', icon: '❓', points: '+3' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}>
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{ color: '#22c55e', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{item.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

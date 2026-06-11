import React, { useState, useMemo, useCallback } from 'react';

const PLATFORMS = [
  { id: 'instagram', label: '📸 Instagram', limit: 30, note: 'Max 30 hashtags per post' },
  { id: 'twitter', label: '🐦 Twitter/X', limit: 5, note: 'Best: 1-3 hashtags per tweet' },
  { id: 'linkedin', label: '💼 LinkedIn', limit: 10, note: 'Best: 3-5 hashtags per post' },
  { id: 'tiktok', label: '🎵 TikTok', limit: 20, note: 'Best: 4-8 hashtags per video' },
];

const COMPETITION = {
  popular: { label: 'Popular', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '🔴' },
  medium: { label: 'Medium', color: '#f0ad4e', bg: 'rgba(240,173,78,0.12)', icon: '🟡' },
  niche: { label: 'Niche', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: '🟢' },
};

const HASHTAG_DB = {
  tech: {
    popular: ['#technology', '#tech', '#innovation', '#gadgets', '#coding', '#programming', '#software', '#ai', '#developer', '#digital'],
    medium: ['#techlife', '#devlife', '#coderlife', '#techworld', '#techtips', '#programminglife', '#codelife', '#techcommunity', '#webdevelopment', '#appdevelopment', '#machinelearning', '#datascience', '#cybersecurity', '#cloudcomputing'],
    niche: ['#techstartups', '#indiehacker', '#buildinpublic', '#100daysofcode', '#codingjourney', '#devtools', '#opensource', '#learntocode', '#frontenddeveloper', '#backenddeveloper', '#fullstackdev', '#reactjs', '#pythonprogramming', '#rustlang'],
  },
  travel: {
    popular: ['#travel', '#travelphotography', '#travelgram', '#wanderlust', '#explore', '#adventure', '#vacation', '#tourism', '#travelblogger', '#instatravel'],
    medium: ['#traveltheworld', '#traveldiaries', '#traveladdict', '#travelholic', '#travellife', '#backpacking', '#roadtrip', '#solotravel', '#traveltips', '#travelinspo', '#bucketlist', '#travelcouple', '#luxurytravel', '#digitalnomad'],
    niche: ['#hiddengems', '#offthebeatenpath', '#sustainabletravel', '#slowtravel', '#travellocal', '#vanlife', '#worldnomads', '#travelon', '#globetrotter', '#passportstamps', '#travelbug', '#exploretocreate', '#roamtheplanet', '#traveldeeper'],
  },
  food: {
    popular: ['#food', '#foodporn', '#foodie', '#instafood', '#yummy', '#delicious', '#foodphotography', '#cooking', '#homemade', '#foodstagram'],
    medium: ['#foodlover', '#foodblogger', '#chef', '#recipe', '#healthyfood', '#baking', '#dinner', '#lunch', '#breakfast', '#dessert', '#vegan', '#plantbased', '#mealprep', '#streetfood'],
    niche: ['#foodielife', '#homecooking', '#cookingathome', '#recipeoftheday', '#foodfromabove', '#onmytable', '#feedfeed', '#buzzfeast', '#beautifulcuisines', '#eeeeeats', '#forkyeah', '#infatuation', '#tastingtable', '#heresmyfood'],
  },
  fitness: {
    popular: ['#fitness', '#workout', '#gym', '#fit', '#motivation', '#bodybuilding', '#training', '#health', '#fitnessmotivation', '#exercise'],
    medium: ['#fitlife', '#gymlife', '#fitnessjourney', '#personaltrainer', '#weightlifting', '#crossfit', '#yoga', '#cardio', '#gains', '#fitfam', '#strength', '#healthylifestyle', '#abs', '#muscle'],
    niche: ['#homeworkout', '#calisthenics', '#powerlifting', '#functionalfitness', '#fitover40', '#morningworkout', '#legday', '#chestday', '#preworkout', '#fitnesscoach', '#onlinecoaching', '#transformationtuesday', '#progresspic', '#naturalbodybuilding'],
  },
  fashion: {
    popular: ['#fashion', '#style', '#ootd', '#fashionblogger', '#love', '#model', '#beauty', '#outfit', '#fashionista', '#streetstyle'],
    medium: ['#fashionstyle', '#mensfashion', '#womensfashion', '#fashioninspo', '#styleinspo', '#outfitoftheday', '#lookoftheday', '#fashionphotography', '#fashionweek', '#vintage', '#trendy', '#chic', '#designer', '#sustainable'],
    niche: ['#slowfashion', '#ethicalfashion', '#sustainablefashion', '#capsulewardrobe', '#thriftedstyle', '#vintagestyle', '#minimalistfashion', '#streetwearculture', '#darkacademia', '#cottagecore', '#y2kfashion', '#affordablefashion', '#outfitinspo', '#fashiondiaries'],
  },
  photography: {
    popular: ['#photography', '#photooftheday', '#photo', '#nature', '#picoftheday', '#photographer', '#portrait', '#landscape', '#canon', '#nikon'],
    medium: ['#photographylovers', '#streetphotography', '#naturephotography', '#travelphotography', '#portraitphotography', '#landscapephotography', '#photographylife', '#urbanphotography', '#mobilephotography', '#lightroom', '#goldenhour', '#sunset', '#blackandwhite', '#editorial'],
    niche: ['#shotonfilm', '#35mm', '#filmisnotdead', '#analogphotography', '#minimalistphotography', '#architecturephotography', '#astrophotography', '#macrophotography', '#droneshot', '#longexposure', '#moodyports', '#visualsoflife', '#createcommune', '#artofvisuals'],
  },
  business: {
    popular: ['#business', '#entrepreneur', '#motivation', '#success', '#marketing', '#money', '#startup', '#hustle', '#inspiration', '#leadership'],
    medium: ['#businessowner', '#smallbusiness', '#digitalmarketing', '#socialmediamarketing', '#ecommerce', '#branding', '#businesstips', '#growthmindset', '#sidehustle', '#passiveincome', '#investing', '#networking', '#ceo', '#womeninbusiness'],
    niche: ['#startuplife', '#buildinpublic', '#solopreneur', '#saas', '#founderstory', '#bootstrapped', '#productivityhacks', '#remotework', '#businesscoach', '#scalingup', '#revenuegoals', '#bizdev', '#thoughtleadership', '#personalbranding'],
  },
  motivation: {
    popular: ['#motivation', '#inspiration', '#success', '#mindset', '#goals', '#quotes', '#believe', '#life', '#love', '#positivevibes'],
    medium: ['#motivationalquotes', '#selfimprovement', '#personaldevelopment', '#growthmindset', '#dailymotivation', '#selflove', '#mentalhealth', '#positivity', '#nevergiveup', '#grind', '#discipline', '#ambition', '#focus', '#determination'],
    niche: ['#morningroutine', '#5amclub', '#manifestation', '#selfcare', '#mindfulness', '#gratitude', '#journaling', '#affirmations', '#levelup', '#glowup', '#maincharacter', '#innerpeace', '#healingjourney', '#selfworth'],
  },
  gaming: {
    popular: ['#gaming', '#gamer', '#videogames', '#game', '#ps5', '#xbox', '#pc', '#twitch', '#streamer', '#esports'],
    medium: ['#gamingcommunity', '#gaminglife', '#pcgaming', '#consolegaming', '#gamedev', '#indiegame', '#retrogaming', '#gamingsetup', '#gameplay', '#gamers', '#nintendoswitch', '#playstation', '#xboxseries', '#steamdeck'],
    niche: ['#gamingpc', '#battleroyale', '#rpg', '#fps', '#mmorpg', '#cozygaming', '#gamingmemes', '#gamingclips', '#speedrun', '#letsplay', '#gamereview', '#indiedev', '#gamedesign', '#pixelart'],
  },
  coding: {
    popular: ['#coding', '#programming', '#developer', '#code', '#python', '#javascript', '#webdev', '#coder', '#software', '#tech'],
    medium: ['#codinglife', '#programmer', '#frontend', '#backend', '#fullstack', '#react', '#nodejs', '#html', '#css', '#java', '#typescript', '#github', '#vscode', '#api'],
    niche: ['#100daysofcode', '#codenewbie', '#learncoding', '#devto', '#codingbootcamp', '#womenintech', '#codeeveryday', '#cleancode', '#codingchallenge', '#algorithims', '#leetcode', '#hacktoberfest', '#webdeveloper', '#techtwitter'],
  },
  design: {
    popular: ['#design', '#graphicdesign', '#art', '#designer', '#creative', '#ui', '#ux', '#logo', '#branding', '#illustration'],
    medium: ['#uidesign', '#uxdesign', '#webdesign', '#appdesign', '#logodesign', '#designinspiration', '#dribbble', '#behance', '#figma', '#typography', '#productdesign', '#interiordesign', '#motiondesign', '#3ddesign'],
    niche: ['#designthinking', '#designsystem', '#uiux', '#dailyui', '#designcommunity', '#designprocess', '#userresearch', '#prototyping', '#uxresearch', '#accessibledesign', '#designtokens', '#colorpalette', '#icondesign', '#microinteractions'],
  },
  marketing: {
    popular: ['#marketing', '#digitalmarketing', '#socialmedia', '#business', '#branding', '#advertising', '#contentmarketing', '#seo', '#marketingtips', '#onlinemarketing'],
    medium: ['#emailmarketing', '#influencermarketing', '#marketingstrategy', '#contentcreator', '#socialmediamarketing', '#growthhacking', '#ppc', '#analytics', '#copywriting', '#marketingdigital', '#affiliatemarketing', '#brandstrategy', '#funnelmarketing', '#leadgeneration'],
    niche: ['#marketingagency', '#b2bmarketing', '#personalbranding', '#communitybuilding', '#ugc', '#microinfluencer', '#conversionrate', '#abtest', '#retargeting', '#marketinghacks', '#contentplan', '#engagementrate', '#organicreach', '#viralmarketing'],
  },
};

const NICHE_LIST = Object.keys(HASHTAG_DB);

function matchNiches(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const matches = [];
  // Direct match
  NICHE_LIST.forEach(niche => {
    if (niche.includes(q) || q.includes(niche)) {
      matches.push(niche);
    }
  });
  // Keyword matching
  const keywordMap = {
    tech: ['software', 'computer', 'digital', 'app', 'web', 'startup', 'ai', 'machine learning', 'data', 'cloud', 'cyber', 'technology'],
    travel: ['trip', 'vacation', 'adventure', 'explore', 'wanderlust', 'backpack', 'hotel', 'flight', 'destination', 'nomad'],
    food: ['cook', 'recipe', 'eat', 'restaurant', 'chef', 'bake', 'meal', 'kitchen', 'foodie', 'cuisine', 'dinner', 'lunch'],
    fitness: ['gym', 'workout', 'exercise', 'health', 'muscle', 'weight', 'run', 'yoga', 'train', 'sport', 'body', 'lift'],
    fashion: ['clothes', 'outfit', 'style', 'wear', 'dress', 'shoes', 'model', 'trend', 'brand', 'clothing', 'accessories'],
    photography: ['photo', 'camera', 'lens', 'shot', 'portrait', 'landscape', 'film', 'capture', 'visual', 'image'],
    business: ['entrepreneur', 'company', 'brand', 'startup', 'money', 'invest', 'finance', 'income', 'revenue', 'ceo'],
    motivation: ['inspire', 'quote', 'mindset', 'goals', 'success', 'growth', 'positive', 'self', 'mental', 'discipline'],
    gaming: ['game', 'play', 'esport', 'console', 'pc', 'stream', 'twitch', 'xbox', 'playstation', 'nintendo', 'rpg'],
    coding: ['code', 'program', 'develop', 'javascript', 'python', 'react', 'frontend', 'backend', 'fullstack', 'algorithm'],
    design: ['graphic', 'ui', 'ux', 'logo', 'illustrat', 'figma', 'creative', 'layout', 'typography', 'color'],
    marketing: ['seo', 'content', 'social media', 'advertis', 'brand', 'campaign', 'email', 'funnel', 'lead', 'conversion'],
  };
  Object.entries(keywordMap).forEach(([niche, keywords]) => {
    if (!matches.includes(niche)) {
      if (keywords.some(kw => q.includes(kw) || kw.includes(q))) {
        matches.push(niche);
      }
    }
  });
  if (matches.length === 0) {
    // Fallback: return closest matches
    matches.push('tech', 'business', 'marketing');
  }
  return [...new Set(matches)];
}

export default function HashtagGen({ copyToClipboard, showToast }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [filterLevel, setFilterLevel] = useState('all');

  const currentPlatform = useMemo(() => PLATFORMS.find(p => p.id === platform), [platform]);

  const generatedHashtags = useMemo(() => {
    const niches = matchNiches(topic);
    if (niches.length === 0) return { popular: [], medium: [], niche: [] };

    const result = { popular: new Set(), medium: new Set(), niche: new Set() };

    niches.forEach(n => {
      const db = HASHTAG_DB[n];
      if (db) {
        db.popular.forEach(h => result.popular.add(h));
        db.medium.forEach(h => result.medium.add(h));
        db.niche.forEach(h => result.niche.add(h));
      }
    });

    // Add topic-specific hashtag
    const topicClean = topic.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (topicClean) {
      result.niche.add(`#${topicClean}`);
      result.medium.add(`#${topicClean}tips`);
      result.niche.add(`#${topicClean}life`);
    }

    return {
      popular: [...result.popular],
      medium: [...result.medium],
      niche: [...result.niche],
    };
  }, [topic]);

  const displayHashtags = useMemo(() => {
    let tags = [];
    if (filterLevel === 'all' || filterLevel === 'popular') {
      tags.push(...generatedHashtags.popular.map(h => ({ tag: h, level: 'popular' })));
    }
    if (filterLevel === 'all' || filterLevel === 'medium') {
      tags.push(...generatedHashtags.medium.map(h => ({ tag: h, level: 'medium' })));
    }
    if (filterLevel === 'all' || filterLevel === 'niche') {
      tags.push(...generatedHashtags.niche.map(h => ({ tag: h, level: 'niche' })));
    }

    // Limit based on platform
    const limit = currentPlatform?.limit || 30;
    return tags.slice(0, limit);
  }, [generatedHashtags, filterLevel, currentPlatform]);

  const allTagsText = useMemo(() => {
    return displayHashtags.map(h => h.tag).join(' ');
  }, [displayHashtags]);

  const handleCopyTag = useCallback((tag) => {
    copyToClipboard(tag);
    showToast('Hashtag copied!');
  }, [copyToClipboard, showToast]);

  const handleCopyAll = useCallback(() => {
    if (allTagsText) {
      copyToClipboard(allTagsText);
      showToast(`${displayHashtags.length} hashtags copied!`);
    }
  }, [allTagsText, displayHashtags.length, copyToClipboard, showToast]);

  const totalCount = generatedHashtags.popular.length + generatedHashtags.medium.length + generatedHashtags.niche.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Input */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title"># Hashtag Generator</span>
        </div>
        <div className="pane-body">
          <div className="input-field">
            <label className="input-label">Topic / Niche</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., tech, travel, food, fitness, fashion..."
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
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '10px',
          }}>
            {NICHE_LIST.map(n => (
              <button
                key={n}
                className="btn btn-ghost btn-sm"
                style={{
                  textTransform: 'capitalize',
                  fontSize: '12px',
                  opacity: topic.toLowerCase().includes(n) ? 1 : 0.7,
                  borderColor: topic.toLowerCase().includes(n) ? 'var(--accent-purple)' : 'var(--border-primary)',
                }}
                onClick={() => setTopic(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Platform</span>
        </div>
        <div className="pane-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                className={platform === p.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                onClick={() => setPlatform(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          {currentPlatform && (
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              💡 {currentPlatform.note}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{displayHashtags.length}</div>
          <div className="stat-label">Selected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COMPETITION.popular.color }}>{generatedHashtags.popular.length}</div>
          <div className="stat-label">🔴 Popular</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COMPETITION.medium.color }}>{generatedHashtags.medium.length}</div>
          <div className="stat-label">🟡 Medium</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COMPETITION.niche.color }}>{generatedHashtags.niche.length}</div>
          <div className="stat-label">🟢 Niche</div>
        </div>
      </div>

      <div className="split-pane">
        {/* Hashtags Display */}
        <div className="pane" style={{ flex: 2 }}>
          <div className="pane-header">
            <span className="pane-title">Generated Hashtags</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div className="tab-group">
                <button className={`tab-btn ${filterLevel === 'all' ? 'active' : ''}`} onClick={() => setFilterLevel('all')}>All</button>
                <button className={`tab-btn ${filterLevel === 'popular' ? 'active' : ''}`} onClick={() => setFilterLevel('popular')}>🔴</button>
                <button className={`tab-btn ${filterLevel === 'medium' ? 'active' : ''}`} onClick={() => setFilterLevel('medium')}>🟡</button>
                <button className={`tab-btn ${filterLevel === 'niche' ? 'active' : ''}`} onClick={() => setFilterLevel('niche')}>🟢</button>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleCopyAll}>📋 Copy All</button>
            </div>
          </div>
          <div className="pane-body">
            {!topic.trim() ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px', fontSize: '14px' }}>
                Enter a topic or click a niche to generate hashtags
              </p>
            ) : displayHashtags.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>
                No hashtags match current filter
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {displayHashtags.map((item, i) => {
                  const comp = COMPETITION[item.level];
                  return (
                    <button
                      key={i}
                      onClick={() => handleCopyTag(item.tag)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: `1px solid ${comp.color}`,
                        background: comp.bg,
                        color: comp.color,
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'var(--font-mono)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 2px 8px ${comp.bg}`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      title={`${comp.label} competition — Click to copy`}
                    >
                      {item.tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Copy Output */}
        <div className="pane" style={{ flex: 1 }}>
          <div className="pane-header">
            <span className="pane-title">📋 Copy Output</span>
          </div>
          <div className="pane-body">
            <div className="code-output" style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: '300px',
              overflowY: 'auto',
              fontSize: '13px',
              lineHeight: 1.6,
            }}>
              {allTagsText || 'Hashtags will appear here...'}
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(COMPETITION).map(([key, val]) => (
                  <div key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}>
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: val.color,
                      display: 'inline-block',
                    }} />
                    <span style={{ fontWeight: 600 }}>{val.label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      — {key === 'popular' ? 'High reach, high competition' : key === 'medium' ? 'Balanced reach & competition' : 'Targeted, low competition'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

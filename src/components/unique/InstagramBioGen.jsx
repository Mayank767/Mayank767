import React, { useState, useMemo, useCallback } from 'react';

const CATEGORIES = [
  { id: 'developer', label: '💻 Developer' },
  { id: 'student', label: '🎓 Student' },
  { id: 'business', label: '💼 Business' },
  { id: 'aesthetic', label: '🌸 Aesthetic' },
  { id: 'fitness', label: '💪 Fitness' },
  { id: 'travel', label: '✈️ Travel' },
  { id: 'foodie', label: '🍕 Foodie' },
  { id: 'gamer', label: '🎮 Gamer' },
  { id: 'artist', label: '🎨 Artist' },
  { id: 'motivational', label: '🔥 Motivational' },
];

const BIO_DATABASE = {
  developer: [
    "💻 Code. Coffee. Repeat. ☕",
    "🚀 Building the future, one commit at a time",
    "👨‍💻 Full-stack developer | Open source enthusiast",
    "🐛 I don't have bugs, I have unexpected features",
    "⌨️ Turning caffeine into code since '09",
    "🧑‍💻 console.log('Hello World') was just the beginning",
    "💡 Making pixels dance & servers sing",
    "🔧 Breaking things in production so you don't have to",
    "📱 App developer by day, debugger by night",
    "🌐 Building cool stuff on the internet",
    "🤖 AI/ML enthusiast | Python lover 🐍",
    "⚡ React dev | TypeScript fan | CSS wizard",
    "🎯 Clean code advocate | DRY principle follower",
    "🛠️ DevOps engineer | Automating all the things",
    "🔥 Shipping code & breaking prod since day one",
    "💾 git commit -m 'fixed everything' 🤞",
    "🏗️ Software architect | Cloud native builder",
  ],
  student: [
    "📚 Studying hard, procrastinating harder",
    "🎓 Future CEO, current GPA survivor",
    "📖 Books, coffee, and existential crises",
    "🧠 Learning something new every day (allegedly)",
    "🎒 Class of 2027 | Making memories 💫",
    "📝 Notes? I prefer vibes-based learning",
    "🏫 Surviving college one all-nighter at a time",
    "🎓 Engineering student | Sleep is optional",
    "📊 Business major | Future Fortune 500",
    "🔬 Science nerd | Lab coat enthusiast",
    "💤 Professional napper between lectures",
    "📱 Studying the art of doing nothing productively",
    "🎓 Med school survivor | Future Dr. 🩺",
    "📚 Law student | Objection is my love language",
    "🧮 Math major | Solving problems nobody asked for",
    "🎭 Drama student by choice, drama queen by nature",
    "🌟 Dean's list material (on a good semester)",
  ],
  business: [
    "📈 Entrepreneur | Building empires from scratch",
    "💼 CEO & Founder | Turning ideas into income",
    "🚀 Startup founder | Disrupting industries",
    "💰 Helping businesses scale 10x | DM for collabs",
    "🎯 Digital marketing expert | ROI obsessed",
    "📊 Data-driven decisions, heart-driven leadership",
    "🏢 Built a 7-figure brand from my laptop",
    "💡 Serial entrepreneur | 3x founder",
    "🤝 Connecting people & creating opportunities",
    "📱 E-commerce specialist | Shopify partner",
    "🎙️ Business coach | Podcast host",
    "💳 Fintech enthusiast | Making money move faster",
    "📉 Failed forward. Rose higher. Never stopped.",
    "🌍 Building brands that matter globally",
    "⚡ Growth hacker | Scaling startups since 2018",
    "🔑 Unlock your business potential | Free resources ⬇️",
    "💎 Luxury brand consultant | Premium results only",
  ],
  aesthetic: [
    "🌸 Living life in pastel colors",
    "✨ Chasing sunsets & good vibes only",
    "🦋 Becoming the person I always dreamed of",
    "🌙 Moonchild with stardust in her veins",
    "🍃 Slow living in a fast world",
    "☁️ Head in the clouds, feet on the ground",
    "🌻 Blooming where I'm planted",
    "🎀 Soft life enthusiast | Main character energy",
    "🌊 Salt in the air, sand in my hair",
    "🕯️ Cozy vibes & warm aesthetics",
    "🌿 Plant mom | Cottagecore dreamer",
    "💫 Creating magic in the mundane",
    "🦢 Gracefully navigating this beautiful chaos",
    "🌸 Soft girl era | Living my best life",
    "🍂 Autumn soul in a summer world",
    "✨ Curating a life I don't need a vacation from",
    "🌈 Finding beauty in everyday moments",
  ],
  fitness: [
    "💪 Eat. Train. Sleep. Repeat.",
    "🏋️ Lifting heavy things & putting them down",
    "🥗 Fitness coach | Nutrition nerd",
    "🏃 Marathon runner | Chasing PRs not people",
    "💯 No shortcuts, just hard work",
    "🔥 Transforming bodies & mindsets",
    "🏆 Certified PT | Online coaching available",
    "🧘 Yoga lover | Flexibility is freedom",
    "💪 Building muscle & destroying excuses",
    "🥊 Boxing enthusiast | Fighting for my goals",
    "🏊 Swimmer | Every lap counts",
    "🚴 Cyclist | Life is better on two wheels",
    "⚡ CrossFit athlete | WOD warrior",
    "🍗 Meal prep king | Macros are my love language",
    "🏋️ From couch potato to gym rat 🐀",
    "💪 Your only limit is you | DM for programs",
    "🎯 1% better every single day",
  ],
  travel: [
    "✈️ Passport stamp collector | 30+ countries",
    "🌍 Wanderlust soul | Exploring the unknown",
    "🗺️ Not all who wander are lost (but I usually am)",
    "🏔️ Adventure seeker | Mountain lover",
    "🌴 Trading my 9-5 for palm trees & sunsets",
    "📸 Travel photographer | Capturing moments",
    "🎒 Backpacker life | Budget travel tips",
    "🏝️ Island hopper | Beach bum certified",
    "🚂 Slow traveler | It's about the journey",
    "✨ Collecting memories, not things",
    "🛫 Currently somewhere beautiful ✨",
    "🗼 City explorer | Culture enthusiast",
    "🌅 Chasing sunrises across time zones",
    "🏕️ Glamping > Camping | Outdoors with style",
    "🌊 Scuba diver | Exploring the deep blue",
    "🚐 Van life | Home is where I park it",
    "✈️ Will travel for food 🍜",
  ],
  foodie: [
    "🍕 Professional taste tester (self-appointed)",
    "👨‍🍳 Home chef | Recipe developer",
    "🍜 Eating my way through every city",
    "🎂 Baker by passion | Sugar addict",
    "🌮 Taco enthusiast | Guac is extra & so am I",
    "☕ Coffee snob | Latte art lover",
    "🍣 Sushi is my personality",
    "🍰 Life is short, eat dessert first",
    "🔥 Spicy food warrior | Hot sauce collection",
    "🥘 Comfort food advocate | Grandma's recipes",
    "🍷 Wine & dine connoisseur",
    "📸 Food photographer | Making you hungry since '20",
    "🥑 Plant-based foodie | Vegan recipes",
    "🍝 Carb loader | Pasta is my love language",
    "🧁 Cupcake queen | Frosting is everything",
    "🍔 Burger critic | Rating every bite",
    "🫖 Tea lover | Brewing happiness one cup at a time",
  ],
  gamer: [
    "🎮 Pro gamer | Ranked #1 in my living room",
    "🕹️ Retro gaming enthusiast | Pixel art lover",
    "⚔️ RPG addict | Side quest completionist",
    "🏆 Esports competitor | Grinding to the top",
    "🎯 FPS main | Headshot machine",
    "🌍 Open world explorer | 100% completion",
    "🎮 Twitch streamer | Live every night at 9pm",
    "🃏 Card game master | Deck builder",
    "🏎️ Racing game fanatic | Speed is everything",
    "👾 Indie game supporter | Hidden gems finder",
    "🎮 GG EZ | But actually it wasn't easy",
    "⭐ Achievement hunter | All trophies unlocked",
    "🔫 Battle royale survivor | Last one standing",
    "🧙 Fantasy gamer | Magic & mayhem",
    "🎮 Cozy gamer | Stardew Valley is life",
    "🕹️ Game developer by day, gamer by night",
    "🏰 Strategy game king | 4X enthusiast",
  ],
  artist: [
    "🎨 Creating art that speaks louder than words",
    "✏️ Illustrator | Bringing imagination to life",
    "🖌️ Abstract thinker | Colorful creator",
    "📷 Photographer | Capturing souls through lenses",
    "🎭 Mixed media artist | Rules are meant to be broken",
    "🎨 Commissions open | DM for custom art",
    "✍️ Calligraphy artist | Making words beautiful",
    "🖼️ Gallery owner | Supporting local artists",
    "🎨 Digital artist | Procreate & Photoshop wizard",
    "🌈 Color theory nerd | Palette obsessed",
    "🖊️ Comic artist | Stories in every frame",
    "🎨 Watercolor dreamer | Brush in hand, heart full",
    "📐 Graphic designer | Pixel perfect or bust",
    "🎨 Art teacher | Inspiring the next generation",
    "✨ Resin art creator | Turning chaos into beauty",
    "🎨 Street artist | The world is my canvas",
    "🖌️ Portrait artist | Every face tells a story",
  ],
  motivational: [
    "🔥 Dream big. Work hard. Stay humble.",
    "💪 Your only limit is your mind",
    "⚡ Turning setbacks into comebacks",
    "🎯 Focused on growth, not perfection",
    "🌟 Be the energy you want to attract",
    "💎 Pressure makes diamonds",
    "🚀 Built different. Wired for greatness.",
    "🦁 Born to stand out, not fit in",
    "✨ Creating the life I always dreamed of",
    "🔥 Winners don't quit. Quitters don't win.",
    "💯 100% accountability. Zero excuses.",
    "🌊 Ride the wave or get swept away",
    "⭐ Making impossible look routine",
    "🎯 Goals don't work unless you do",
    "💪 Stronger than yesterday, weaker than tomorrow",
    "🔥 Hustle in silence, let success make noise",
    "🌟 The comeback is always stronger than the setback",
  ],
};

const INSTAGRAM_LIMIT = 150;

export default function InstagramBioGen({ copyToClipboard, showToast }) {
  const [activeCategory, setActiveCategory] = useState('developer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLines, setSelectedLines] = useState([]);
  const [customBio, setCustomBio] = useState('');

  const filteredBios = useMemo(() => {
    const bios = BIO_DATABASE[activeCategory] || [];
    if (!searchQuery.trim()) return bios;
    const q = searchQuery.toLowerCase();
    return bios.filter(b => b.toLowerCase().includes(q));
  }, [activeCategory, searchQuery]);

  const mixedBio = useMemo(() => {
    return selectedLines.join('\n');
  }, [selectedLines]);

  const handleCopyBio = useCallback((bio) => {
    copyToClipboard(bio);
    showToast('Bio copied to clipboard!');
  }, [copyToClipboard, showToast]);

  const toggleLineSelection = useCallback((bio) => {
    setSelectedLines(prev => {
      if (prev.includes(bio)) {
        return prev.filter(l => l !== bio);
      }
      return [...prev, bio];
    });
  }, []);

  const handleCopyMixed = useCallback(() => {
    if (mixedBio) {
      copyToClipboard(mixedBio);
      showToast('Mixed bio copied!');
    }
  }, [mixedBio, copyToClipboard, showToast]);

  const handleCopyCustom = useCallback(() => {
    if (customBio) {
      copyToClipboard(customBio);
      showToast('Custom bio copied!');
    }
  }, [customBio, copyToClipboard, showToast]);

  const getCharColor = useCallback((len) => {
    if (len <= 100) return 'var(--accent-cyan)';
    if (len <= 140) return '#f0ad4e';
    return 'var(--accent-rose)';
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Category Tabs */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">📸 Instagram Bio Generator</span>
        </div>
        <div className="pane-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={activeCategory === cat.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="input-field">
            <label className="input-label">🔍 Search Bios</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter bios by keyword..."
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-heading)',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </div>

      <div className="split-pane">
        {/* Bios List */}
        <div className="pane" style={{ flex: 1 }}>
          <div className="pane-header">
            <span className="pane-title">Bios — {CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
            <span className="label" style={{ background: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }}>
              {filteredBios.length} bios
            </span>
          </div>
          <div className="pane-body" style={{ maxHeight: '480px', overflowY: 'auto' }}>
            {filteredBios.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No bios match your search.</p>
            )}
            {filteredBios.map((bio, i) => {
              const isSelected = selectedLines.includes(bio);
              const charLen = bio.length;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    marginBottom: '6px',
                    background: isSelected ? 'var(--accent-purple-light)' : 'var(--bg-primary)',
                    border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <label className="checkbox-label" style={{ minWidth: '20px', marginTop: '2px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleLineSelection(bio)}
                    />
                  </label>
                  <div style={{ flex: 1 }} onClick={() => handleCopyBio(bio)}>
                    <div style={{ fontSize: '14px', color: 'var(--text-heading)', marginBottom: '4px', lineHeight: 1.4 }}>
                      {bio}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: getCharColor(charLen), fontFamily: 'var(--font-mono)' }}>
                        {charLen}/{INSTAGRAM_LIMIT} chars
                      </span>
                      {charLen > INSTAGRAM_LIMIT && (
                        <span style={{ fontSize: '11px', color: 'var(--accent-rose)' }}>⚠️ Over limit</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => { e.stopPropagation(); handleCopyBio(bio); }}
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mix & Match + Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {/* Mix & Match */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">🔀 Mix & Match</span>
              {selectedLines.length > 0 && (
                <button className="btn btn-primary btn-sm" onClick={handleCopyMixed}>
                  📋 Copy Mixed
                </button>
              )}
            </div>
            <div className="pane-body">
              {selectedLines.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px' }}>
                  ☑️ Check bios on the left to combine them into a custom bio
                </p>
              ) : (
                <div>
                  {selectedLines.map((line, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      marginBottom: '4px',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      color: 'var(--text-heading)',
                    }}>
                      <span style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{i + 1}.</span>
                      <span style={{ flex: 1 }}>{line}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleLineSelection(line)} style={{ fontSize: '11px' }}>✕</button>
                    </div>
                  ))}
                  <div style={{ marginTop: '8px', fontSize: '12px', color: getCharColor(mixedBio.length), fontFamily: 'var(--font-mono)' }}>
                    Total: {mixedBio.length}/{INSTAGRAM_LIMIT} chars
                    {mixedBio.length > INSTAGRAM_LIMIT && (
                      <span style={{ color: 'var(--accent-rose)', marginLeft: '8px' }}>⚠️ Over Instagram limit!</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Bio */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">✏️ Custom Bio</span>
              {customBio && (
                <button className="btn btn-primary btn-sm" onClick={handleCopyCustom}>📋 Copy</button>
              )}
            </div>
            <div className="pane-body">
              <textarea
                className="textarea-code"
                value={customBio}
                onChange={e => setCustomBio(e.target.value)}
                placeholder="Write your custom bio here or edit a copied one..."
                rows={3}
                style={{
                  width: '100%',
                  resize: 'vertical',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  color: 'var(--text-heading)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ marginTop: '6px', fontSize: '12px', color: getCharColor(customBio.length), fontFamily: 'var(--font-mono)' }}>
                {customBio.length}/{INSTAGRAM_LIMIT} chars
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">👁️ Instagram Preview</span>
            </div>
            <div className="pane-body" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
                maxWidth: '340px',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid var(--border-primary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-rose))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}>
                    👤
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-heading)' }}>username</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Your Name</div>
                  </div>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-heading)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  minHeight: '40px',
                }}>
                  {customBio || mixedBio || (selectedLines.length === 0 ? 'Your bio will appear here...' : '')}
                </div>
                <div style={{
                  marginTop: '14px',
                  display: 'flex',
                  gap: '8px',
                }}>
                  <button style={{
                    flex: 1,
                    padding: '7px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-secondary)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-heading)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'default',
                  }}>
                    Follow
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '7px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-secondary)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-heading)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'default',
                  }}>
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

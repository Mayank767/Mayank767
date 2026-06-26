import React, { useMemo } from 'react';
import { ToolCard } from '../Landing';

export default function RelatedTools({ currentToolId, allTools = [], onSelect, favorites, toggleFavorite, usageCount }) {
  const related = useMemo(() => {
    const current = allTools.find(t => t.id === currentToolId);
    if (!current) return [];
    
    // Find tools in the same category, excluding the current tool
    const sameCategory = allTools.filter(t => t.category === current.category && t.id !== currentToolId);
    
    // Shuffle and pick up to 3 tools
    const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [currentToolId, allTools]);

  if (related.length === 0) return null;

  return (
    <div className="related-tools" style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border-secondary)' }}>
      <h3 style={{ marginBottom: '20px', color: 'var(--text-heading)', fontSize: '1.2rem' }}>Related {related[0].category} Tools</h3>
      <div className="tools-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {related.map((tool, i) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onSelect={onSelect}
            isFavorite={favorites.includes(tool.id)}
            onToggleFavorite={toggleFavorite}
            usageCount={usageCount[tool.id] || 0}
            visible={true}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

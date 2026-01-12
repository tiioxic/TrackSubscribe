import React from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, X as XIcon, TrendingUp, Bitcoin, ShoppingCart, Music, Film, Gamepad2, Zap, Briefcase, BookOpen, Smartphone, Hourglass } from 'lucide-react';
import { PERIODS, CATEGORY_EMOJIS } from '../hooks/useSubscriptions';

const ICONS_MAP = {
  TrendingUp, Bitcoin, ShoppingCart, Music, Film, Gamepad2, Zap, Briefcase, BookOpen, Smartphone
};

const SubscriptionCard = ({ subscription, onRemove, onEdit, index, showCategory = false, showStatus = false, layout = 'list' }) => {
  const { id, name, price, period, url, description, category, status, pauseAtRenewal, icon, iconName } = subscription;
  const isPaused = status === 'paused';

  // Format price
  const formattedPrice = parseFloat(price).toFixed(2);
  const periodLabel = period === 'Monthly' ? '/mo' : period === 'Yearly' ? '/an' : '/sem'; // Shortened

  // Icon Rendering Logic
  const renderIcon = () => {
    if (iconName && ICONS_MAP[iconName]) {
      const LuciferIcon = ICONS_MAP[iconName];
      return (
        <div className={`sub-icon-lucide-wrapper ${layout === 'grid' ? 'large' : ''}`}>
          <LuciferIcon size={layout === 'grid' ? 32 : 24} color="var(--accent-primary)" />
        </div>
      );
    }
    if (icon) {
      return <img src={icon} alt={name} className="sub-icon" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />;
    }
    return <div className="sub-icon-placeholder" style={icon ? { display: 'none' } : {}}>{name.charAt(0)}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} // Changed to y for grid feel
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      layout
      className={`subscription-item ${layout} ${isPaused ? 'paused' : ''}`}
    >
      {/* Icon / Avatar */}
      <div className="sub-icon-wrapper">
        {renderIcon()}

        {/* Category Emoji Badge */}
        {showCategory && category && (
          <div className="category-emoji-badge" title={category}>
            {CATEGORY_EMOJIS[category] || '📦'}
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="sub-info">
        <div className="sub-header-row">
          <h3 className="sub-name" title={name}>{name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {!!pauseAtRenewal && (
              <div
                title="Pause au prochain renouvellement"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '6px',
                  padding: '4px',
                  height: '22px',
                  width: '22px'
                }}
              >
                <Hourglass size={12} color="#f59e0b" />
              </div>
            )}
            {showStatus && (
              <span className={`status-badge ${status}`}>{status === 'active' ? 'Actif' : 'Pause'}</span>
            )}
          </div>
        </div>
        {url && (
          <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="sub-url">
            {new URL(url.startsWith('http') ? url : `https://${url}`).hostname}
          </a>
        )}
        {layout === 'grid' && description && (
          <p className="sub-description">{description}</p>
        )}
      </div>

      {/* Price Section */}
      <div className="sub-price">
        <span className="price-amount">{formattedPrice}€</span>
        <span className="price-period">{periodLabel}</span>
      </div>

      {/* Actions Overlay (Desktop) / Visible (Mobile) */}
      <div className="sub-actions-overlay">
        <button onClick={() => onEdit(subscription)} className="action-pill-btn" title="Modifier">
          <Edit2 size={12} /> Edit
        </button>
        <button onClick={() => onRemove(id)} className="action-pill-btn delete" title="Supprimer">
          <XIcon size={12} /> Delete
        </button>
      </div>

      <style>{`
        .subscription-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background-color: transparent; /* Clean look defaulting to bg-secondary via parent or just hover effect */
          padding: 12px 0; /* Minimal padding */
          border-bottom: 1px solid var(--border-subtle);
          border-radius: 0;
          margin-bottom: 0;
          position: relative;
          transition: all 0.2s;
          min-height: 72px;
        }
        
        /* Grid Layout Overrides */
        .subscription-item.grid {
            flex-direction: column;
            align-items: flex-start;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-lg);
            padding: 20px;
            gap: 16px;
            height: 100%;
        }
        
        .subscription-item.grid:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            border-color: var(--accent-primary);
            margin: 0; /* Reset margin override from list hover */
        }
        
        .subscription-item.list:last-child {
            border-bottom: none;
        }

        .subscription-item.list:hover {
            background-color: var(--bg-tertiary);
            padding-left: 12px;
            padding-right: 12px;
            border-radius: var(--radius-md);
            margin: 0 -12px; /* Negative margin to expand background without shifting content layout too much */
            border-bottom-color: transparent;
            z-index: 10;
        }

        .subscription-item.paused {
            opacity: 0.6;
            filter: grayscale(0.5);
        }

        /* Icon */
        .sub-icon-wrapper {
            position: relative;
            flex-shrink: 0;
            width: 48px;
            height: 48px;
        }
        
        .subscription-item.grid .sub-icon-wrapper {
            width: 56px;
            height: 56px;
            margin-bottom: 4px;
        }

        .sub-icon, .sub-icon-placeholder, .sub-icon-lucide-wrapper {
            width: 100%;
            height: 100%;
            border-radius: 12px;
            object-fit: cover;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .sub-icon-lucide-wrapper {
            background: linear-gradient(135deg, var(--bg-tertiary), #2a2a2a);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-subtle);
        }
        
        .sub-icon-lucide-wrapper.large {
             /* Explicitly larger for grid if needed, already handled by parent size */
        }
        
        .sub-icon-placeholder {
            background: linear-gradient(135deg, var(--bg-tertiary), #2a2a2a);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 1.2rem;
            border: 1px solid var(--border-subtle);
        }
        
        .category-emoji-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 22px;
            height: 22px;
            background-color: #333; /* Dark background for badge */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 2px solid var(--bg-secondary); /* Visual separation */
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 2;
        }

        /* Info */
        .sub-info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 4px;
            width: 100%;
        }

        .sub-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .sub-name {
            font-size: 1rem;
            font-weight: 500;
            color: white; /* Strong white */
            letter-spacing: -0.01em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .subscription-item.grid .sub-name {
            font-size: 1.1rem;
            font-weight: 600;
        }

        .sub-url {
            font-size: 0.85rem;
            color: var(--text-muted); /* Grey */
            text-decoration: none;
            opacity: 0.7;
            font-weight: 400;
        }
        
        .sub-url:hover {
            opacity: 1;
            text-decoration: underline;
        }
        
        .sub-description {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
        }

        /* Price */
        .sub-price {
            text-align: right;
            flex-shrink: 0;
            display: flex;
            align-items: baseline;
            gap: 4px;
        }
        
        .subscription-item.grid .sub-price {
            width: 100%;
            justify-content: flex-end; /* Or flex-start? Right aligns nicely */
            border-top: 1px solid var(--border-subtle);
            padding-top: 12px;
            margin-top: 4px;
        }

        .price-amount {
            font-weight: 500;
            color: var(--text-muted); /* Grey as per image */
            font-size: 1rem;
            letter-spacing: 0.02em;
        }
        
        .subscription-item.grid .price-amount {
            font-size: 1.25rem;
            color: var(--text-primary);
        }
        
        .price-period {
            font-size: 0.85rem;
            color: var(--text-muted);
            opacity: 0.7;
        }
        
        /* Status Badge */
        .status-badge {
            font-size: 0.7rem;
            padding: 2px 8px;
            border-radius: 99px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.active {
            background-color: rgba(16, 185, 129, 0.1); /* Green tint */
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .status-badge.paused {
            background-color: rgba(245, 158, 11, 0.1); /* Amber tint */
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.2);
        }

        /* Actions Overlay - Pill Shape */
        .sub-actions-overlay {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            background-color: rgba(60, 60, 60, 0.95); /* Dark pill background */
            backdrop-filter: blur(8px);
            padding: 4px 6px;
            border-radius: 999px; /* Pill */
            opacity: 0;
            pointer-events: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 20;
        }
        
        .subscription-item.grid .sub-actions-overlay {
            top: 16px; /* Top right in grid */
            right: 16px;
            transform: none;
            opacity: 0;
        }

        .subscription-item:hover .sub-actions-overlay {
            opacity: 1;
            pointer-events: auto;
            right: 12px; /* Slight slide in */
        }
        
        .subscription-item.grid:hover .sub-actions-overlay {
            right: 16px; /* No slide in grid */
        }

        .action-pill-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            font-size: 0.8rem;
            font-weight: 500;
            padding: 6px 10px;
            border-radius: 99px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .action-pill-btn:hover {
            background-color: rgba(255,255,255,0.1);
            color: white;
        }
        
        /* Mobile Responsive */
        @media (max-width: 600px) {
             .sub-actions-overlay {
                opacity: 1;
                pointer-events: auto;
                position: static;
                transform: none;
                background: transparent;
                box-shadow: none;
                padding: 0;
                margin-top: 8px;
                border: none;
                justify-content: flex-end;
                width: 100%;
             }
             
             .action-pill-btn {
                background-color: var(--bg-tertiary);
                border: 1px solid var(--border-subtle);
                color: var(--text-secondary);
             }
             
             .subscription-item.grid {
                /* On mobile grid might be too narrow? Let's check. 
                   Usually 1 col grid is fine. */
             }
             
             .subscription-item.list {
                flex-wrap: wrap; 
                border-bottom: 1px solid var(--border-subtle);
                margin: 0;
                padding: 16px 0;
             }
             
             .subscription-item.list:hover {
                margin: 0;
                padding: 16px 0;
                background: transparent;
             }
        }
      `}</style>
    </motion.div>
  );
};

export default SubscriptionCard;

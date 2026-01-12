import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Globe, Calendar, DollarSign, Type, PauseCircle, PlayCircle, Tag, TrendingUp, Bitcoin, ShoppingCart, Music, Film, Gamepad2, Zap, Briefcase, BookOpen, Smartphone, Hourglass } from 'lucide-react';

import { CATEGORY_EMOJIS } from '../hooks/useSubscriptions';

const PRESET_ICONS = [
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Bitcoin', icon: Bitcoin },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Music', icon: Music },
  { name: 'Film', icon: Film },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Zap', icon: Zap },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Smartphone', icon: Smartphone },
];

const SubscriptionModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: 'Monthly',
    url: '',
    startDate: new Date().toISOString().split('T')[0],
    description: '',
    status: 'active',
    category: 'Autre',
    pauseAtRenewal: false,
    iconName: null // Stores the Lucide icon name if manually selected
  });
  const [iconPreview, setIconPreview] = useState(null); // URL specific
  const [isLoadingIcon, setIsLoadingIcon] = useState(false);
  const [iconMode, setIconMode] = useState('auto'); // 'auto' (URL) or 'manual' (Grid)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          category: initialData.category || 'Autre',
          pauseAtRenewal: !!initialData.pauseAtRenewal, // Ensure boolean
          iconName: initialData.iconName || null
        });
        setIconPreview(initialData.icon);
        setIconMode(initialData.iconName ? 'manual' : 'auto');
      } else {
        setFormData({
          name: '',
          price: '',
          period: 'Monthly',
          url: '',
          startDate: new Date().toISOString().split('T')[0],
          description: '',
          status: 'active',
          category: 'Autre',
          pauseAtRenewal: false,
          iconName: null
        });
        setIconPreview(null);
        setIconMode('auto');
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fetch icon when URL changes if in auto mode
    if (name === 'url' && iconMode === 'auto' && value.length > 5 && value.includes('.')) {
      fetchIcon(value);
    }
  };

  const fetchIcon = async (url) => {
    setIsLoadingIcon(true);
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      setIconPreview(iconUrl);
      setFormData(prev => ({ ...prev, iconName: null })); // Clear manual icon if url found
    } catch (e) {
      console.error("Invalid URL");
    } finally {
      setIsLoadingIcon(false);
    }
  };

  const handleManualIconSelect = (iconName) => {
    setFormData(prev => ({ ...prev, iconName: iconName, url: '' })); // Clear URL if manual icon
    setIconPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      icon: iconPreview // Pass the URL if any
    });
  };

  const toggleStatus = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active'
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <div className="modal-header">
            <h2>{initialData ? 'Modifier l\'abonnement' : 'Nouvel Abonnement'}</h2>
            <button onClick={onClose} className="close-btn"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mode-toggle-group">
              <button type="button" className={`mode-btn ${iconMode === 'auto' ? 'active' : ''}`} onClick={() => setIconMode('auto')}>Par Site Web</button>
              <button type="button" className={`mode-btn ${iconMode === 'manual' ? 'active' : ''}`} onClick={() => setIconMode('manual')}>Icône Manuelle</button>
            </div>

            <div className="form-group icon-section">
              {iconMode === 'auto' ? (
                <>
                  <div className="icon-preview">
                    {isLoadingIcon ? (
                      <Loader2 className="animate-spin" />
                    ) : iconPreview ? (
                      <img src={iconPreview} alt="Preview" />
                    ) : (
                      <Globe size={24} />
                    )}
                  </div>
                  <div className="input-wrapper name-input">
                    <Type size={18} className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Nom du service (ex: Netflix)"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="manual-icon-grid">
                  {PRESET_ICONS.map(({ name, icon: Icon }) => (
                    <div
                      key={name}
                      className={`manual-icon-item ${formData.iconName === name ? 'selected' : ''}`}
                      onClick={() => handleManualIconSelect(name)}
                    >
                      <Icon size={20} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {iconMode === 'manual' && (
              <div className="form-group">
                <div className="input-wrapper">
                  <Type size={18} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom du service ou investissement"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper disabled-bg">
                  <DollarSign size={18} className="input-icon" />
                  <input
                    type="number"
                    name="price"
                    placeholder="Prix"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <select name="period" value={formData.period} onChange={handleChange}>
                  <option value="Monthly">Mensuel</option>
                  <option value="Yearly">Annuel</option>
                  <option value="Weekly">Hebdomadaire</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label"><Tag size={14} /> Catégorie</label>
                <select name="category" value={formData.category} onChange={handleChange} className="category-select">
                  {Object.keys(CATEGORY_EMOJIS).map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_EMOJIS[cat]} {cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="field-label"><Calendar size={14} /> Date début</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {iconMode === 'auto' && (
              <div className="form-group">
                <div className="input-wrapper">
                  <Globe size={18} className="input-icon" />
                  <input
                    type="text"
                    name="url"
                    placeholder="Site web (pour l'icône)"
                    value={formData.url}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <textarea
                name="description"
                placeholder="Notes ou Description (optionnel)"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            {initialData && (
              <div className="form-group status-toggle-group">
                <label>Statut de l'abonnement</label>
                <button type="button" className={`status-toggle-btn ${formData.status}`} onClick={toggleStatus}>
                  {formData.status === 'active' ? (
                    <> <PauseCircle size={18} /> Mettre en Pause (Immédiat) </>
                  ) : (
                    <> <PlayCircle size={18} /> Reprendre l'abonnement </>
                  )}
                </button>
              </div>
            )}

            <div className="form-group pause-renewal-group">
              <div className="switch-row">
                <div className="switch-label">
                  <div className="label-title"><Hourglass size={16} /> Pause au prochain renouvellement</div>
                  <div className="label-desc">Sera mis en pause automatiquement à la date d'échéance.</div>
                </div>
                <button
                  type="button"
                  className={`switch-btn ${formData.pauseAtRenewal ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, pauseAtRenewal: !prev.pauseAtRenewal }))}
                >
                  <div className="switch-handle"></div>
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              {initialData ? 'Sauvegarder les modifications' : 'Ajouter l\'abonnement'}
            </button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .mode-toggle-group {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            background: var(--bg-tertiary);
            padding: 4px;
            border-radius: var(--radius-md);
        }
        
        .mode-btn {
            flex: 1;
            background: transparent;
            border: none;
            padding: 8px;
            border-radius: 6px;
            font-size: 0.9rem;
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .mode-btn.active {
            background: var(--bg-secondary);
            color: var(--text-primary);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            font-weight: 500;
        }

        .manual-icon-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
            width: 100%;
        }
        
        .manual-icon-item {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-tertiary);
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
            cursor: pointer;
            color: var(--text-secondary);
            transition: all 0.2s;
        }
        
        .manual-icon-item:hover {
            border-color: var(--text-muted);
            color: var(--text-primary);
        }
        
        .manual-icon-item.selected {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
            background: rgba(var(--accent-primary-rgb), 0.1);
        }

        /* Existing styles below... */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 16px;
        }

        .modal-content {
            background-color: var(--bg-secondary);
            width: 100%;
            max-width: 500px;
            border-radius: var(--radius-xl);
            padding: 24px;
            border: 1px solid var(--border-subtle);
            box-shadow: var(--shadow-xl);
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .modal-header h2 {
            font-size: 1.25rem;
            margin: 0;
        }

        .close-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px;
        }

        .form-group {
            margin-bottom: 16px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        
        .field-label {
            font-size: 0.8rem;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .input-icon {
            position: absolute;
            left: 12px;
            color: var(--text-muted);
            pointer-events: none;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: border-color 0.2s;
        }
        
        .input-wrapper input {
            padding-left: 40px;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--accent-primary);
        }

        .icon-section {
            flex-direction: row;
            gap: 12px;
        }

        .icon-preview {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background-color: var(--bg-tertiary);
            border: 1px solid var(--border-subtle);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
            color: var(--text-secondary);
        }
        
        .icon-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .name-input {
            flex-grow: 1;
        }

        .category-select {
            /* Custom styling for select if needed */
        }
        
        .status-toggle-group {
            background-color: var(--bg-tertiary);
            padding: 12px;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
        }
        
        .status-toggle-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid transparent;
            transition: all 0.2s;
        }
        
        .status-toggle-btn.active {
            background-color: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
            border-color: rgba(245, 158, 11, 0.3);
        }
        
        .status-toggle-btn.paused {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border-color: rgba(16, 185, 129, 0.3);
        }
        
        .pause-renewal-group {
            background-color: var(--bg-tertiary);
            padding: 12px;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
            margin-top: -8px; /* Stick to status group if present, or textarea */
        }

        .switch-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .switch-label {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .label-title {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.9rem;
            color: var(--text-primary);
        }

        .label-desc {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-left: 22px;
        }

        .switch-btn {
            width: 44px;
            height: 24px;
            background-color: var(--border-focus);
            border-radius: 12px;
            border: none;
            padding: 2px;
            cursor: pointer;
            transition: background-color 0.3s;
            position: relative;
        }

        .switch-btn.active {
            background-color: var(--color-warning); /* Orange for pause intent */
        }

        .switch-handle {
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
            transform: translateX(0);
        }

        .switch-btn.active .switch-handle {
            transform: translateX(20px);
        }

        .submit-btn {
            width: 100%;
            padding: 14px;
            background-color: var(--text-primary);
            color: var(--bg-primary);
            border: none;
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 8px;
        }
        
        .submit-btn:hover {
            opacity: 0.9;
        }
        
        textarea {
            resize: vertical;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default SubscriptionModal;

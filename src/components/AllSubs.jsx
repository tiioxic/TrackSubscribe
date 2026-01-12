import React, { useState } from 'react';
import SubscriptionCard from './SubscriptionCard';
import { Search } from 'lucide-react';

const AllSubs = ({ subscriptions, onRemove, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubs = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="all-subs">
      <header className="page-header">
        <h1>Tous les Abonnements</h1>
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="subs-grid">
        {filteredSubs.length === 0 ? (
          <div className="empty-state">
            Aucun abonnement trouvé.
          </div>
        ) : (
          filteredSubs.map((sub, idx) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onRemove={onRemove}
              onEdit={onEdit}
              index={idx}
              showCategory={true}
              showStatus={true}
              layout="grid"
            />
          ))
        )}
      </div>

      <style>{`
        .all-subs {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .search-bar {
          position: relative;
          width: 100%;
          max-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .search-bar input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .search-bar input:focus {
           outline: 2px solid var(--accent-primary);
           border-color: transparent;
        }

        .subs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 48px;
            color: var(--text-muted);
            border: 1px dashed var(--border-subtle);
            border-radius: var(--radius-lg);
        }
      `}</style>
    </div>
  );
};

export default AllSubs;

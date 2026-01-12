import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AllSubs from './components/AllSubs';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import SubscriptionModal from './components/SubscriptionModal';
import useSubscriptions from './hooks/useSubscriptions';

import ExportModal from './components/ExportModal';

const App = () => {
  const { subscriptions, settings, addSubscription, updateSubscription, removeSubscription, updateSettings, totals } = useSubscriptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingSub, setEditingSub] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleOpenModal = (type) => {
    if (type === 'export') {
      setIsExportOpen(true);
    } else {
      setEditingSub(null);
      setIsModalOpen(true);
    }
  };

  const handleAddSubscription = async (newSub) => {
    await addSubscription(newSub);
    setIsModalOpen(false);
  };

  const handleEdit = (sub) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  const handleUpdateSubscription = async (updatedSub) => {
    await updateSubscription(updatedSub);
    setEditingSub(null);
    setIsModalOpen(false);
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
  }

  const handleDelete = async () => {
    if (itemToDelete) {
      await removeSubscription(itemToDelete);
      setItemToDelete(null);
    }
  }

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} onOpenModal={handleOpenModal}>
        {activeTab === 'dashboard' && (
          <Dashboard
            subscriptions={subscriptions}
            totals={totals}
            settings={settings}
            onRemove={confirmDelete}
            onEdit={handleEdit}
          />
        )}
        {activeTab === 'all-subs' && (
          <AllSubs
            subscriptions={subscriptions}
            onRemove={confirmDelete}
            onEdit={handleEdit}
          />
        )}
        {activeTab === 'calendar' && <Calendar subscriptions={subscriptions} />}
        {activeTab === 'settings' && <Settings settings={settings} onUpdateSettings={updateSettings} />}
      </Layout>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSub(null); }}
        onSubmit={editingSub ? handleUpdateSubscription : handleAddSubscription}
        initialData={editingSub}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        subscriptions={subscriptions}
        totals={totals}
      />

      {
        itemToDelete && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <div className="delete-icon-wrapper">
                <Trash2 size={32} />
              </div>
              <h3>Confirmer la suppression</h3>
              <p>Voulez-vous vraiment supprimer cet abonnement ?<br />Cette action est irréversible.</p>
              <div className="delete-actions">
                <button onClick={() => setItemToDelete(null)} className="cancel-btn">
                  Annuler
                </button>
                <button onClick={handleDelete} className="confirm-delete-btn">
                  Supprimer
                </button>
              </div>
            </div>
            <style>{`
              .modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: 16px;
                animation: fadeIn 0.2s ease-out;
              }
              
              .delete-modal {
                background-color: var(--bg-secondary);
                border: 1px solid var(--border-subtle);
                border-radius: 24px;
                padding: 32px;
                width: 100%;
                max-width: 400px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                transform: scale(0.95);
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
              }
              
              .delete-icon-wrapper {
                width: 64px;
                height: 64px;
                background-color: rgba(220, 38, 38, 0.1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ef4444;
                margin-bottom: 20px;
                border: 1px solid rgba(220, 38, 38, 0.2);
              }
              
              .delete-modal h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 8px;
              }
              
              .delete-modal p {
                color: var(--text-secondary);
                font-size: 0.95rem;
                margin-bottom: 24px;
                line-height: 1.5;
              }
              
              .delete-actions {
                display: flex;
                gap: 12px;
                width: 100%;
              }
              
              .delete-actions button {
                flex: 1;
                padding: 12px;
                border-radius: 12px;
                font-weight: 500;
                font-size: 1rem;
                cursor: pointer;
                border: none;
                transition: transform 0.1s, opacity 0.2s;
              }
              
              .delete-actions button:active {
                transform: scale(0.98);
              }
              
              .cancel-btn {
                background-color: var(--bg-tertiary);
                color: var(--text-primary);
                border: 1px solid var(--border-subtle);
              }
              
              .cancel-btn:hover {
                background-color: var(--border-subtle);
              }
              
              .confirm-delete-btn {
                background-color: #ef4444;
                color: white;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
              }
              
              .confirm-delete-btn:hover {
                background-color: #dc2626;
                box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
              }

              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes popIn {
                to { transform: scale(1); }
              }
            `}</style>
          </div>
        )
      }
    </>
  );
};

export default App;

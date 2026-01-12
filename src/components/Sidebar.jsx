import React from 'react';
import { LayoutDashboard, Wallet, Calendar, Settings, PlusCircle, Download } from 'lucide-react';
import PiggyBankAnim from './PiggyBankAnim';

const Sidebar = ({ activeTab, setActiveTab, onOpenModal }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'all-subs', icon: Wallet, label: 'All Subs' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' }, // Placeholder for future
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-placeholder">A.</div>
        <span className="brand-name">SubTracker</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} strokeWidth={1.5} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <PiggyBankAnim />

      <div className="sidebar-footer">
        <button className="add-btn" onClick={onOpenModal}>
          <PlusCircle size={20} />
          <span>New Subscription</span>
        </button>
        <button className="nav-item" onClick={() => onOpenModal('export')}>
          <Download size={20} strokeWidth={1.5} />
          <span>Export Data</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} strokeWidth={1.5} />
          <span>Settings</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: 16px;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 24px;
        }

        .logo-placeholder {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }

        .brand-name {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .nav-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          font-weight: 500;
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background: var(--accent-primary);
          border: none;
          color: white;
          width: 100%;
          cursor: pointer;
          font-weight: 500;
          transition: opacity var(--transition-fast);
        }

        .add-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

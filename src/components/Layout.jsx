import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, onOpenModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="brand">
          <div className="logo-placeholder">A.</div>
          <span>SubTracker</span>
        </div>
        <button className="menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          onOpenModal={onOpenModal}
        />
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <main className="main-content">
        {children}
      </main>

      <style>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: var(--bg-primary);
          overflow: hidden; /* Prevent global scroll */
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-subtle);
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 50;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
        }

         .logo-placeholder {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 0.8rem;
        }

        .menu-btn {
            background: transparent;
            border: none;
            color: var(--text-primary);
            cursor: pointer;
        }

        .sidebar-wrapper {
          width: 260px;
          flex-shrink: 0;
          height: 100%;
          border-right: 1px solid var(--border-subtle);
          background-color: var(--bg-secondary);
          z-index: 40;
        }

        .main-content {
          flex: 1;
          height: 100%;
          overflow-y: auto; /* Scrollable content */
          padding: 32px;
          padding-bottom: 80px; /* Space for bottom content if needed */
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }

          .mobile-header {
            display: flex;
          }

          .sidebar-wrapper {
            position: fixed;
            top: 60px;
            left: -260px; /* Hide by default */
            height: calc(100vh - 60px);
            transition: transform var(--transition-normal);
            border-right: 1px solid var(--border-subtle);
          }

          .sidebar-wrapper.open {
            transform: translateX(260px);
          }
          
          .mobile-overlay {
              position: fixed;
              top: 60px;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.5);
              z-index: 30;
              backdrop-filter: blur(2px);
          }

          .main-content {
            margin-top: 60px; /* Account for header */
            padding: 20px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;

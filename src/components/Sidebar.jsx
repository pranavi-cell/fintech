import React from 'react';
import { LayoutDashboard, ReceiptText, Wallet, BarChart3 } from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">
        <div className="brand-logo">₹</div>
        <span className="brand-name">RupeeWise</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {isActive && <div className="active-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">P</div>
          <div className="user-info">
            <span className="user-name">Pranavi</span>
            <span className="user-status">Premium Tier</span>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: 260px;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 2rem 1.5rem;
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
          padding-left: 0.5rem;
        }

        .brand-logo {
          width: 38px;
          height: 38px;
          background: var(--primary-gradient);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: #ffffff;
          box-shadow: 0 4px 10px var(--primary-glow);
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1rem;
          border-radius: var(--radius-sm);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          position: relative;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
          transform: translateX(4px);
        }

        .nav-item.active {
          color: #ffffff;
          background: rgba(139, 92, 246, 0.12);
          font-weight: 600;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .nav-icon {
          color: var(--text-secondary);
          transition: var(--transition);
        }

        .nav-item.active .nav-icon {
          color: var(--primary);
        }

        .active-indicator {
          position: absolute;
          right: 0;
          top: 25%;
          height: 50%;
          width: 4px;
          background: var(--primary);
          border-radius: 4px 0 0 4px;
          box-shadow: -2px 0 10px var(--primary-glow);
        }

        .sidebar-footer {
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          margin-top: auto;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--info-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-status {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .sidebar-container {
            width: 100%;
            height: auto;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }

          .sidebar-brand {
            margin-bottom: 0;
          }

          .sidebar-nav {
            flex-direction: row;
            gap: 0.25rem;
            flex: none;
          }

          .nav-item {
            padding: 0.5rem;
            gap: 0.25rem;
            font-size: 0.8rem;
          }

          .nav-label {
            display: none;
          }

          .sidebar-footer {
            display: none;
          }

          .active-indicator {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}

import React from 'react';
import { Plus } from 'lucide-react';

export default function Header({ activePage, onAddTransactionClick }) {
  // Format today's date nicely
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-IN', options);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Financial Overview';
      case 'transactions':
        return 'Transaction Ledger';
      case 'budgets':
        return 'Budget Allocations';
      case 'analytics':
        return 'Cash Flow & Analytics';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="header-container">
      <div className="header-title-section">
        <h1 className="header-page-title">{getPageTitle()}</h1>
        <p className="header-date">{formatDate()}</p>
      </div>

      <div className="header-actions">
        <button className="btn btn-primary" onClick={onAddTransactionClick}>
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </div>

      <style>{`
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          background: rgba(9, 9, 14, 0.3);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-page-title {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--text-primary);
        }

        .header-date {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
            position: relative;
          }

          .header-actions {
            width: 100%;
          }

          .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </header>
  );
}

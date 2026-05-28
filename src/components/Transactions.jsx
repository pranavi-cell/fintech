import React, { useState } from 'react';
import { Trash2, Search, Filter, IndianRupee } from 'lucide-react';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function Transactions({ transactions, onDeleteTransaction }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'income', 'expense'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Unique list of categories in transactions for dropdown filter
  const allCategories = ['all', ...new Set(transactions.map((t) => t.category))];

  // Filtering logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="transactions-view glass-card animate-fade-in">
      {/* Filtering Header */}
      <div className="filter-bar">
        {/* Type Toggle Buttons */}
        <div className="filter-group">
          <label className="filter-label">Filter Type</label>
          <div className="type-buttons">
            <button
              className={`type-btn ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              All
            </button>
            <button
              className={`type-btn ${selectedType === 'income' ? 'active income' : ''}`}
              onClick={() => setSelectedType('income')}
            >
              Income
            </button>
            <button
              className={`type-btn ${selectedType === 'expense' ? 'active expense' : ''}`}
              onClick={() => setSelectedType('expense')}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Category Dropdown Filter */}
        <div className="filter-group select-group">
          <label className="filter-label">Category</label>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="filter-group search-group">
          <label className="filter-label">Search</label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search description..."
              className="search-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>🔍</span>
          <p>No transactions match your current filters.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((t) => (
                  <tr key={t.id}>
                    <td className="date-cell">
                      {new Date(t.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="note-cell">{t.note}</td>
                    <td className="category-cell">
                      <span
                        className="cat-indicator"
                        style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          marginRight: '8px',
                          backgroundColor:
                            t.type === 'income'
                              ? '#10b981'
                              : t.category === 'Rent'
                              ? '#ec4899'
                              : t.category === 'Food'
                              ? '#f43f5e'
                              : t.category === 'Utilities'
                              ? '#f59e0b'
                              : t.category === 'Shopping'
                              ? '#10b981'
                              : t.category === 'Transport'
                              ? '#3b82f6'
                              : t.category === 'Entertainment'
                              ? '#8b5cf6'
                              : t.category === 'Health'
                              ? '#06b6d4'
                              : '#9ca3af'
                        }}
                      />
                      {t.category}
                    </td>
                    <td>
                      <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type === 'income' ? 'Credit' : 'Debit'}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        color: t.type === 'income' ? 'var(--income)' : 'var(--expense)'
                      }}
                    >
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-icon delete-btn"
                        title="Delete entry"
                        onClick={() => onDeleteTransaction(t.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
          align-items: center;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .type-buttons {
          display: flex;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.2rem;
        }

        .type-btn {
          padding: 0.4rem 1rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .type-btn.active {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .type-btn.active.income {
          background: var(--income);
          color: white;
        }

        .type-btn.active.expense {
          background: var(--expense);
          color: white;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 0.45rem 1.5rem 0.45rem 0.75rem;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
          min-width: 150px;
          transition: var(--transition);
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1em;
        }
        
        .filter-select option {
          background-color: #111122;
          color: var(--text-primary);
        }

        .filter-select:focus {
          border-color: var(--primary);
        }

        .search-group {
          flex: 1;
          min-width: 200px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-secondary);
        }

        .search-control {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.45rem 1rem 0.45rem 2.25rem;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          transition: var(--transition);
        }

        .search-control:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.07);
        }

        .empty-state {
          text-align: center;
          padding: 3.5rem 1rem;
          color: var(--text-secondary);
        }

        .date-cell {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .note-cell {
          font-weight: 500;
        }

        .delete-btn {
          opacity: 0.7;
        }

        .delete-btn:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
        }

        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .search-group {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

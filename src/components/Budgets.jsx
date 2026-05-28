import React, { useState } from 'react';
import { Edit2, Check, X, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function Budgets({ transactions, budgets, onUpdateBudget }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editLimit, setEditLimit] = useState('');

  // Filter May 2026 transactions for current spent tracking
  const mayTransactions = transactions.filter((t) => t.date.startsWith('2026-05'));

  const getSpentByCategory = (category) => {
    return mayTransactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleStartEdit = (category, currentLimit) => {
    setEditingCategory(category);
    setEditLimit(currentLimit.toString());
  };

  const handleSaveEdit = (category) => {
    const limitNum = parseFloat(editLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      alert('Please enter a valid positive number for the budget limit.');
      return;
    }
    onUpdateBudget(category, limitNum);
    setEditingCategory(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="budgets-view animate-fade-in">
      {/* Intro Card */}
      <div className="glass-card budget-summary-card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Monthly Budget Progress</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Track category limits for May 2026. Limits adapt dynamically when you adjust them.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--income)' }}>
            <CheckCircle size={14} /> <span>Safe (&lt;60%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }}>
            <AlertTriangle size={14} /> <span>Warning (60%-85%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--expense)' }}>
            <Flame size={14} /> <span>Critical (&gt;85%)</span>
          </div>
        </div>
      </div>

      {/* Grid of Budgets */}
      <div className="budget-grid">
        {budgets.map((b) => {
          const spent = getSpentByCategory(b.category);
          const percent = Math.min((spent / b.limit) * 100, 100);
          const ratio = spent / b.limit;

          // Color scale classes
          let statusClass = 'status-green';
          let statusText = 'Under Control';
          if (ratio >= 0.85) {
            statusClass = 'status-red';
            statusText = 'Limit Exceeded!';
          } else if (ratio >= 0.6) {
            statusClass = 'status-amber';
            statusText = 'Approaching Limit';
          }

          const isEditing = editingCategory === b.category;

          return (
            <div key={b.category} className={`glass-card budget-card ${statusClass}`}>
              <div className="budget-card-header">
                <div>
                  <h3 className="category-title">{b.category}</h3>
                  <span className={`status-badge ${statusClass}`}>{statusText}</span>
                </div>
                {!isEditing && (
                  <button
                    className="btn-icon-small"
                    title="Edit Limit"
                    onClick={() => handleStartEdit(b.category, b.limit)}
                  >
                    <Edit2 size={13} />
                  </button>
                )}
              </div>

              {/* Progress Values */}
              <div className="budget-progress-values">
                <span className="spent-value">{formatCurrency(spent)}</span>
                <span className="limit-value">of {formatCurrency(b.limit)}</span>
              </div>

              {/* Progress Bar Container */}
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${percent}%`,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>

              {/* Bar Percentage Text */}
              <div className="percent-label">{percent.toFixed(0)}% spent</div>

              {/* Inline Edit Form */}
              {isEditing ? (
                <div className="budget-limit-edit animate-fade-in">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Limit: ₹</span>
                  <input
                    type="number"
                    className="budget-edit-input"
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    autoFocus
                  />
                  <button className="btn-save" onClick={() => handleSaveEdit(b.category)}>
                    <Check size={14} />
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="remaining-label" style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>
                  {b.limit - spent > 0 
                    ? `${formatCurrency(b.limit - spent)} remaining`
                    : `${formatCurrency(Math.abs(b.limit - spent))} over budget`
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .budget-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .budget-card {
          display: flex;
          flex-direction: column;
          border-left: 4px solid transparent;
        }

        .budget-card.status-green {
          border-left-color: var(--income);
        }
        .budget-card.status-amber {
          border-left-color: var(--warning);
        }
        .budget-card.status-red {
          border-left-color: var(--expense);
        }

        .budget-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .category-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
        }

        .status-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          display: inline-block;
          margin-top: 0.2rem;
        }

        .status-badge.status-green {
          background: rgba(16, 185, 129, 0.1);
          color: var(--income);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .status-badge.status-amber {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .status-badge.status-red {
          background: rgba(239, 68, 68, 0.1);
          color: var(--expense);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .budget-progress-values {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .spent-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }

        .limit-value {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .progress-bar-track {
          height: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          margin-bottom: 0.4rem;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 5px;
        }

        .status-green .progress-bar-fill {
          background: var(--income-gradient);
          box-shadow: 0 0 10px var(--income-glow);
        }
        .status-amber .progress-bar-fill {
          background: var(--warning-gradient);
          box-shadow: 0 0 10px var(--warning-glow);
        }
        .status-red .progress-bar-fill {
          background: var(--expense-gradient);
          box-shadow: 0 0 10px var(--expense-glow);
        }

        .percent-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-align: right;
        }

        .btn-icon-small {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.35rem;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon-small:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-color-active);
        }

        .btn-save, .btn-cancel {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: var(--transition);
        }

        .btn-save {
          color: var(--income);
          background: rgba(16, 185, 129, 0.1);
        }
        .btn-save:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .btn-cancel {
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
        }
        .btn-cancel:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

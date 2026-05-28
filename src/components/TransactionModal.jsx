import React, { useState, useEffect } from 'react';
import { X, IndianRupee } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Refunds', 'Other Income'];
  const expenseCategories = ['Rent', 'Food', 'Utilities', 'Shopping', 'Transport', 'Entertainment', 'Health', 'Others'];

  // Auto-switch default category when type changes
  useEffect(() => {
    if (type === 'income') {
      setCategory(incomeCategories[0]);
    } else {
      setCategory(expenseCategories[0]);
    }
  }, [type]);

  // Set today's date when modal is opened
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setAmount('');
      setNote('');
      setType('expense');
      setCategory(expenseCategories[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount greater than zero.');
      return;
    }
    if (!category) {
      alert('Please select a category.');
      return;
    }

    const newTransaction = {
      id: 't_' + Date.now(),
      type,
      amount: parseFloat(amount),
      category,
      date,
      note: note.trim() || `${category} ${type === 'income' ? 'credit' : 'debit'}`
    };

    onAddTransaction(newTransaction);
    onClose();
  };

  return (
    <div className={`modal-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New Transaction</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Toggle Type */}
          <div className="form-toggle-group">
            <button
              type="button"
              className={`form-toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`form-toggle-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <div className="input-with-icon">
              <span className="input-icon"><IndianRupee size={16} /></span>
              <input
                type="number"
                step="any"
                className="form-control padded-left"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control select-dropdown"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {type === 'income'
                ? incomeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                : expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Description Note */}
          <div className="form-group">
            <label className="form-label">Description / Note</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Groceries at supermarket"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`btn btn-primary submit-btn ${type}`}>
              Add Entry
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }

        .padded-left {
          padding-left: 2.25rem !important;
        }

        .select-dropdown {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25em;
          padding-right: 2.5rem;
        }

        .select-dropdown option {
          background-color: #111122;
          color: var(--text-primary);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .submit-btn.income {
          background: var(--income-gradient);
          box-shadow: 0 4px 14px var(--income-glow);
        }
        .submit-btn.income:hover {
          box-shadow: 0 6px 20px var(--income-glow), 0 0 0 3px rgba(16, 185, 129, 0.3);
        }

        .submit-btn.expense {
          background: var(--expense-gradient);
          box-shadow: 0 4px 14px var(--expense-glow);
        }
        .submit-btn.expense:hover {
          box-shadow: 0 6px 20px var(--expense-glow), 0 0 0 3px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
}

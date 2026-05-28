import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TransactionModal from './components/TransactionModal';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Analytics from './components/Analytics';

// Sample Indian salary data pre-loaded
const INITIAL_TRANSACTIONS = [
  { id: 't1', type: 'income', amount: 120000, category: 'Salary', date: '2026-05-01', note: 'Monthly Salary Credit' },
  { id: 't2', type: 'expense', amount: 25000, category: 'Rent', date: '2026-05-02', note: 'Apartment Rent' },
  { id: 't3', type: 'expense', amount: 8500, category: 'Food', date: '2026-05-03', note: 'Groceries' },
  { id: 't4', type: 'income', amount: 35000, category: 'Freelance', date: '2026-05-10', note: 'Web Dev Project Consultant' },
  { id: 't5', type: 'expense', amount: 4200, category: 'Utilities', date: '2026-05-12', note: 'Electricity & Internet Bill' },
  { id: 't6', type: 'expense', amount: 3800, category: 'Food', date: '2026-05-14', note: 'Dinner with Friends' },
  { id: 't7', type: 'expense', amount: 7500, category: 'Shopping', date: '2026-05-18', note: 'Zara Apparel' },
  { id: 't8', type: 'expense', amount: 1500, category: 'Transport', date: '2026-05-20', note: 'Uber & Auto Rides' },
  { id: 't9', type: 'expense', amount: 2000, category: 'Health', date: '2026-05-22', note: 'Gym Monthly Fee' },
  { id: 't10', type: 'income', amount: 5000, category: 'Investments', date: '2026-05-24', note: 'Mutual Fund Dividend Pay' },
  { id: 't11', type: 'expense', amount: 649, category: 'Entertainment', date: '2026-05-25', note: 'Netflix Subscription' }
];

const INITIAL_BUDGETS = [
  { category: 'Rent', limit: 25000 },
  { category: 'Food', limit: 15000 },
  { category: 'Utilities', limit: 6000 },
  { category: 'Shopping', limit: 10000 },
  { category: 'Transport', limit: 5000 },
  { category: 'Entertainment', limit: 3000 },
  { category: 'Health', limit: 4000 },
  { category: 'Others', limit: 5000 }
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('rupeewise_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('rupeewise_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rupeewise_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('rupeewise_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const updateBudget = (category, limit) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, limit } : b))
    );
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            budgets={budgets}
            setActivePage={setActivePage}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'budgets':
        return (
          <Budgets
            transactions={transactions}
            budgets={budgets}
            onUpdateBudget={updateBudget}
          />
        );
      case 'analytics':
        return (
          <Analytics
            transactions={transactions}
            budgets={budgets}
          />
        );
      default:
        return (
          <Dashboard
            transactions={transactions}
            budgets={budgets}
            setActivePage={setActivePage}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="content-container">
        <Header
          activePage={activePage}
          onAddTransactionClick={() => setIsModalOpen(true)}
        />
        
        <main className="page-container">
          {renderPage()}
        </main>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={addTransaction}
      />
    </div>
  );
}

export default App;

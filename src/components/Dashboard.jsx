import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Percent, TrendingUp } from 'lucide-react';
import { BarChart, DonutChart } from './SVGCharts';

// Currency formatter
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function Dashboard({ transactions, budgets, setActivePage }) {
  // Filter for May 2026 transactions
  const mayTransactions = transactions.filter(t => t.date.startsWith('2026-05'));

  // Calculate May stats
  const mayIncome = mayTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const mayExpense = mayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Net worth baseline + sum of all transactions in list
  const baselineNetWorth = 650000;
  const netAllTime = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
  const netWorth = baselineNetWorth + netAllTime;

  // Savings rate
  const savingsRate = mayIncome > 0 ? ((mayIncome - mayExpense) / mayIncome) * 100 : 0;

  // Prepare recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Group current May expenses by category for Donut Chart
  const expenseByCategory = {};
  budgets.forEach(b => {
    expenseByCategory[b.category] = 0;
  });

  mayTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const cat = t.category;
      if (expenseByCategory[cat] !== undefined) {
        expenseByCategory[cat] += t.amount;
      } else {
        expenseByCategory['Others'] = (expenseByCategory['Others'] || 0) + t.amount;
      }
    });

  const donutData = Object.keys(expenseByCategory).map(cat => ({
    label: cat,
    value: expenseByCategory[cat]
  }));

  // Prepare data for Grouped Bar Chart (May and previous months)
  // Let's calculate previous month sums dynamically or combine with static history
  const monthlyData = [
    { label: 'Jan', income: 130000, expense: 45000 },
    { label: 'Feb', income: 125000, expense: 52000 },
    { label: 'Mar', income: 140000, expense: 48000 },
    { label: 'Apr', income: 135000, expense: 60000 },
    { label: 'May', income: mayIncome, expense: mayExpense }
  ];

  return (
    <div className="dashboard-view animate-fade-in">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Net Worth */}
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span>Net Worth</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--primary)' }}><Wallet size={20} /></div>
          </div>
          <div>
            <div className="kpi-value">{formatCurrency(netWorth)}</div>
            <div className="kpi-subtext" style={{ color: 'var(--income)' }}>
              <TrendingUp size={14} />
              <span>All-time balance + base</span>
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span>Income (May)</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--income)' }}><ArrowUpRight size={20} /></div>
          </div>
          <div>
            <div className="kpi-value text-gradient text-gradient-income">{formatCurrency(mayIncome)}</div>
            <div className="kpi-subtext">
              <span>May salary & freelance</span>
            </div>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span>Expenses (May)</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--expense)' }}><ArrowDownRight size={20} /></div>
          </div>
          <div>
            <div className="kpi-value text-gradient text-gradient-expense">{formatCurrency(mayExpense)}</div>
            <div className="kpi-subtext">
              <span>May category spending</span>
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span>Savings Rate (May)</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--info)' }}><Percent size={20} /></div>
          </div>
          <div>
            <div className="kpi-value" style={{ color: savingsRate >= 0 ? 'var(--income)' : 'var(--expense)' }}>
              {savingsRate.toFixed(1)}%
            </div>
            <div className="kpi-subtext">
              <span>{savingsRate >= 30 ? 'Target (30%) met!' : 'Goal: 30% savings'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="chart-grid-two">
        <div className="glass-card chart-card">
          <div className="chart-title">
            <span>Income vs Expenses</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Jan - May Cash Flow</span>
          </div>
          <BarChart data={monthlyData} />
        </div>

        <div className="glass-card chart-card">
          <div className="chart-title">
            <span>May Spending Breakdown</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>By Category</span>
          </div>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="glass-card">
        <div className="dashboard-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>Recent Transactions</h2>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setActivePage('transactions')}>
            View All Ledger
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            No recent transactions found. Click "Add Transaction" to log some!
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
                  <th style={{ textAnchor: 'end', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td style={{ fontWeight: 500 }}>{t.note}</td>
                    <td>
                      <span
                        className="category-dot"
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

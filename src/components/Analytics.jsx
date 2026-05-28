import React from 'react';
import { TrendingUp, AlertCircle, Sparkles, Award } from 'lucide-react';
import { LineChart, DonutChart, CategorySpendBar } from './SVGCharts';

// Currency Formatter
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function Analytics({ transactions, budgets }) {
  // May transactions
  const mayTransactions = transactions.filter((t) => t.date.startsWith('2026-05'));

  // Calculate May stats
  const mayIncome = mayTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const mayExpense = mayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Group May Income sources for Donut Chart
  const incomeBySource = {};
  mayTransactions
    .filter((t) => t.type === 'income')
    .forEach((t) => {
      incomeBySource[t.category] = (incomeBySource[t.category] || 0) + t.amount;
    });

  const incomeDonutData = Object.keys(incomeBySource).map((src) => ({
    label: src,
    value: incomeBySource[src],
    // Assign specific colors for income sources
    color: src === 'Salary' ? '#10b981' : src === 'Freelance' ? '#059669' : src === 'Investments' ? '#3b82f6' : '#8b5cf6'
  }));

  // Prepare monthly cash flow (Jan-May)
  const monthlyData = [
    { label: 'Jan', income: 130000, expense: 45000 },
    { label: 'Feb', income: 125000, expense: 52000 },
    { label: 'Mar', income: 140000, expense: 48000 },
    { label: 'Apr', income: 135000, expense: 60000 },
    { label: 'May', income: mayIncome, expense: mayExpense }
  ];

  // Group May Expenses by category
  const expenseByCategory = {};
  budgets.forEach((b) => {
    expenseByCategory[b.category] = 0;
  });

  mayTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = t.category;
      if (expenseByCategory[cat] !== undefined) {
        expenseByCategory[cat] += t.amount;
      } else {
        expenseByCategory['Others'] = (expenseByCategory['Others'] || 0) + t.amount;
      }
    });

  // Insights generation
  const savings = mayIncome - mayExpense;
  const savingsRate = mayIncome > 0 ? (savings / mayIncome) * 100 : 0;

  // Find top expense category
  let topCategory = 'None';
  let maxExpense = 0;
  Object.keys(expenseByCategory).forEach((cat) => {
    if (expenseByCategory[cat] > maxExpense) {
      maxExpense = expenseByCategory[cat];
      topCategory = cat;
    }
  });

  return (
    <div className="analytics-view animate-fade-in">
      {/* Top Section: Charts Grid */}
      <div className="chart-grid-two">
        <div className="glass-card chart-card">
          <div className="chart-title">
            <span>Cash Flow History</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Income vs Expenses (Jan-May)</span>
          </div>
          <LineChart data={monthlyData} />
        </div>

        <div className="glass-card chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chart-title">
            <span>Income Streams</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>May Distribution</span>
          </div>
          {incomeDonutData.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No income logged for May
            </div>
          ) : (
            <DonutChart data={incomeDonutData} />
          )}
        </div>
      </div>

      {/* Bottom Section: Category Spending vs Budgets & Insights */}
      <div className="chart-grid-two" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        {/* Category Spent List */}
        <div className="glass-card">
          <h3 className="section-title" style={{ marginBottom: '1.5rem', color: 'white', fontWeight: 600 }}>Category Spend vs Budget Limit</h3>
          <div className="category-bars-list">
            {budgets.map((b) => {
              const spent = expenseByCategory[b.category] || 0;
              return (
                <CategorySpendBar
                  key={b.category}
                  label={b.category}
                  spent={spent}
                  budget={b.limit}
                />
              );
            })}
          </div>
        </div>

        {/* Dynamic AI Insights */}
        <div className="glass-card insights-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            Smart Insights
          </h3>

          {/* Net Saving Insight */}
          <div className="insight-item">
            <div className="insight-icon-wrapper success">
              <Award size={16} />
            </div>
            <div className="insight-content">
              <h4 className="insight-title">Savings Strength</h4>
              <p className="insight-desc">
                {savings >= 0 
                  ? `You have saved ${formatCurrency(savings)} (${savingsRate.toFixed(0)}% of earnings) in May.`
                  : `You spent ${formatCurrency(Math.abs(savings))} more than you earned in May.`
                }
              </p>
            </div>
          </div>

          {/* Top Category Spent Insight */}
          {maxExpense > 0 && (
            <div className="insight-item">
              <div className="insight-icon-wrapper info">
                <TrendingUp size={16} />
              </div>
              <div className="insight-content">
                <h4 className="insight-title">Top Expense Driver</h4>
                <p className="insight-desc">
                  Your primary expenditure category is <strong>{topCategory}</strong> at <strong>{formatCurrency(maxExpense)}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Alert Insight */}
          {budgets.some(b => (expenseByCategory[b.category] || 0) > b.limit) && (
            <div className="insight-item warning">
              <div className="insight-icon-wrapper alert">
                <AlertCircle size={16} />
              </div>
              <div className="insight-content">
                <h4 className="insight-title" style={{ color: 'var(--expense)' }}>Budget Alerts</h4>
                <p className="insight-desc">
                  Some budgets have exceeded limits! Check red indicators on the Budgets page to trim costs.
                </p>
              </div>
            </div>
          )}

          {/* Generic Recommendation */}
          <div className="insight-recommendation" style={{ marginTop: 'auto', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '8px', padding: '0.8rem', fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
            <strong>Recommendation:</strong> Try to keep food and shopping under 40% of total expenses to reach your long-term mutual fund goals.
          </div>
        </div>
      </div>

      <style>{`
        .section-title {
          font-size: 1.1rem;
        }

        .insight-item {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
        }

        .insight-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .insight-icon-wrapper.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--income);
        }

        .insight-icon-wrapper.info {
          background: rgba(59, 130, 246, 0.1);
          color: var(--info);
        }

        .insight-icon-wrapper.alert {
          background: rgba(239, 68, 68, 0.1);
          color: var(--expense);
        }

        .insight-content {
          display: flex;
          flex-direction: column;
        }

        .insight-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.15rem;
        }

        .insight-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        @media (max-width: 900px) {
          .chart-grid-two {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';

// Format currency in Indian Rupees
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

// ----------------------------------------------------
// 1. Grouped Bar Chart (Income vs Expense)
// ----------------------------------------------------
export function BarChart({ data }) {
  const [hoveredBar, setHoveredBar] = useState(null); // { index, type, value, x, y }

  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const zeroY = height - paddingBottom;

  // Find max value for scaling
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    1000
  ) * 1.1; // 10% buffer

  const groupWidth = chartWidth / data.length;
  const barWidth = Math.min(groupWidth * 0.3, 16);

  // Y-axis grid values
  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="chart-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        {/* Gradients */}
        <defs>
          <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Y Grid Lines & Labels */}
        {gridTicks.map((tick, i) => {
          const val = maxVal * tick;
          const y = zeroY - tick * chartHeight;
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className="grid-line" />
              <text x={paddingLeft - 8} y={y + 4} className="chart-axis-text" textAnchor="end">
                {tick === 0 ? '₹0' : formatCurrency(val).replace('₹', '₹')}
              </text>
            </g>
          );
        })}

        {/* Draw Bars */}
        {data.map((item, index) => {
          const xGroupStart = paddingLeft + index * groupWidth;
          
          // Income Bar
          const incomeHeight = (item.income / maxVal) * chartHeight;
          const incomeX = xGroupStart + (groupWidth / 2) - barWidth - 4;
          const incomeY = zeroY - incomeHeight;

          // Expense Bar
          const expenseHeight = (item.expense / maxVal) * chartHeight;
          const expenseX = xGroupStart + (groupWidth / 2) + 4;
          const expenseY = zeroY - expenseHeight;

          return (
            <g key={index}>
              {/* X Axis Label */}
              <text
                x={xGroupStart + groupWidth / 2}
                y={height - paddingBottom + 18}
                className="chart-axis-text"
                textAnchor="middle"
                style={{ fontSize: '11px', fill: 'var(--text-secondary)' }}
              >
                {item.label}
              </text>

              {/* Income Rect */}
              <rect
                x={incomeX}
                y={incomeY}
                width={barWidth}
                height={Math.max(incomeHeight, 2)}
                rx={4}
                fill="url(#incomeBarGrad)"
                className="interactive-bar"
                onMouseEnter={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setHoveredBar({
                    label: item.label,
                    type: 'Income',
                    value: item.income,
                    x: incomeX + barWidth / 2,
                    y: incomeY - 8
                  });
                }}
                onMouseLeave={() => setHoveredBar(null)}
              />

              {/* Expense Rect */}
              <rect
                x={expenseX}
                y={expenseY}
                width={barWidth}
                height={Math.max(expenseHeight, 2)}
                rx={4}
                fill="url(#expenseBarGrad)"
                className="interactive-bar"
                onMouseEnter={(e) => {
                  setHoveredBar({
                    label: item.label,
                    type: 'Expense',
                    value: item.expense,
                    x: expenseX + barWidth / 2,
                    y: expenseY - 8
                  });
                }}
                onMouseLeave={() => setHoveredBar(null)}
              />
            </g>
          );
        })}

        {/* X Axis Line */}
        <line
          x1={paddingLeft}
          y1={zeroY}
          x2={width - paddingRight}
          y2={zeroY}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Tooltip */}
      {hoveredBar && (
        <div
          className="chart-tooltip"
          style={{
            display: 'block',
            left: `${(hoveredBar.x / width) * 100}%`,
            top: `${(hoveredBar.y / height) * 100}%`,
            transform: 'translate(-50%, -100%)',
            position: 'absolute',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
            {hoveredBar.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: hoveredBar.type === 'Income' ? 'var(--income)' : 'var(--expense)'
              }}
            />
            <span style={{ fontWeight: 500, color: '#fff' }}>
              {hoveredBar.type}: <strong>{formatCurrency(hoveredBar.value)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 2. Spending Breakdown Donut Chart
// ----------------------------------------------------
export function DonutChart({ data }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Filter out zero entries
  const activeData = data.filter((d) => d.value > 0);
  const total = activeData.reduce((sum, d) => sum + d.value, 0);

  const width = 260;
  const height = 260;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 65;
  const circumference = 2 * Math.PI * radius; // ~408.4

  // Colors mapping for fallback
  const categoryColors = {
    Salary: '#10b981',
    Freelance: '#059669',
    Investments: '#3b82f6',
    Refunds: '#60a5fa',
    'Other Income': '#8b5cf6',
    
    Rent: '#ec4899',
    Food: '#f43f5e',
    Utilities: '#f59e0b',
    Shopping: '#10b981',
    Transport: '#3b82f6',
    Entertainment: '#8b5cf6',
    Health: '#06b6d4',
    Others: '#9ca3af'
  };

  let accumulatedPercent = 0;

  // Active slice representation
  const displayLabel = hoveredSlice ? hoveredSlice.label : 'Total Spent';
  const displayValue = hoveredSlice ? hoveredSlice.value : total;
  const displayPercent = hoveredSlice ? `${((hoveredSlice.value / (total || 1)) * 100).toFixed(1)}%` : '';

  return (
    <div className="donut-chart-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      <div className="chart-container" style={{ width: '100%', height: '260px', position: 'relative' }}>
        {total === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</span>
            <span>No data recorded yet</span>
          </div>
        ) : (
          <>
            <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
              <g transform={`rotate(-90 ${cx} ${cy})`}>
                {activeData.map((item, index) => {
                  const percent = item.value / total;
                  const strokeLength = percent * circumference;
                  const strokeOffset = -accumulatedPercent * circumference;
                  accumulatedPercent += percent;

                  const strokeColor = item.color || categoryColors[item.label] || '#a78bfa';

                  return (
                    <circle
                      key={index}
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="transparent"
                      stroke={strokeColor}
                      strokeWidth="12"
                      strokeDasharray={`${strokeLength} ${circumference}`}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      className="interactive-slice"
                      style={{ transformOrigin: 'center' }}
                      onMouseEnter={() => setHoveredSlice({ label: item.label, value: item.value, color: strokeColor })}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Absolute Center Text */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
                width: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {displayLabel}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: '2px 0' }}>
                {formatCurrency(displayValue)}
              </span>
              {displayPercent && (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: hoveredSlice ? hoveredSlice.color : 'var(--text-muted)' }}>
                  {displayPercent}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Reusable legend */}
      {total > 0 && (
        <div className="chart-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', maxWidth: '320px' }}>
          {activeData.map((item, index) => {
            const strokeColor = item.color || categoryColors[item.label] || '#a78bfa';
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: strokeColor }} />
                <span>{item.label} ({((item.value / total) * 100).toFixed(0)}%)</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3. Curved Line Chart (Monthly Cash Flow)
// ----------------------------------------------------
export function LineChart({ data }) {
  const [hoveredPoint, setHoveredPoint] = useState(null); // { index, x, y, label, income, expense }

  const width = 540;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const zeroY = height - paddingBottom;

  // Find max value in either income or expense for chart scaling
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    1000
  ) * 1.1;

  const getCoordinates = () => {
    return data.map((item, i) => {
      const x = paddingLeft + i * (chartWidth / (data.length - 1 || 1));
      const yInc = zeroY - (item.income / maxVal) * chartHeight;
      const yExp = zeroY - (item.expense / maxVal) * chartHeight;
      return { x, yInc, yExp, ...item, index: i };
    });
  };

  const coords = getCoordinates();

  // Helper to generate a curved bezier SVG path string
  const getCurvePath = (points, key) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0][key]}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      const cp1x = prev.x + (p.x - prev.x) / 2;
      const cp1y = prev[key];
      const cp2x = prev.x + (p.x - prev.x) / 2;
      const cp2y = p[key];
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p[key]}`;
    }
    return d;
  };

  const incomePath = getCurvePath(coords, 'yInc');
  const expensePath = getCurvePath(coords, 'yExp');

  // Paths for background gradients
  const incomeAreaPath = coords.length > 0 
    ? `${incomePath} L ${coords[coords.length - 1].x} ${zeroY} L ${coords[0].x} ${zeroY} Z`
    : '';
  const expenseAreaPath = coords.length > 0 
    ? `${expensePath} L ${coords[coords.length - 1].x} ${zeroY} L ${coords[0].x} ${zeroY} Z`
    : '';

  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="chart-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        <defs>
          <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridTicks.map((tick, i) => {
          const val = maxVal * tick;
          const y = zeroY - tick * chartHeight;
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className="grid-line" />
              <text x={paddingLeft - 8} y={y + 4} className="chart-axis-text" textAnchor="end">
                {tick === 0 ? '₹0' : formatCurrency(val).replace('₹', '₹')}
              </text>
            </g>
          );
        })}

        {/* Draw Area Fills */}
        {incomeAreaPath && <path d={incomeAreaPath} fill="url(#incomeAreaGrad)" />}
        {expenseAreaPath && <path d={expenseAreaPath} fill="url(#expenseAreaGrad)" />}

        {/* Draw Lines */}
        {incomePath && (
          <path
            d={incomePath}
            fill="none"
            stroke="var(--income)"
            strokeWidth="3"
            strokeLinecap="round"
            className="chart-line"
          />
        )}
        {expensePath && (
          <path
            d={expensePath}
            fill="none"
            stroke="var(--expense)"
            strokeWidth="3"
            strokeLinecap="round"
            className="chart-line"
          />
        )}

        {/* Interaction Verticals & Hover circles */}
        {coords.map((pt, i) => {
          return (
            <g key={i}>
              {/* X axis labels */}
              <text x={pt.x} y={height - paddingBottom + 18} className="chart-axis-text" textAnchor="middle">
                {pt.label}
              </text>

              {/* Vertical guideline on hover */}
              {hoveredPoint && hoveredPoint.index === i && (
                <line
                  x1={pt.x}
                  y1={paddingTop}
                  x2={pt.x}
                  y2={zeroY}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}

              {/* Income dot */}
              <circle
                cx={pt.x}
                cy={pt.yInc}
                r={hoveredPoint && hoveredPoint.index === i ? 6 : 4}
                fill="var(--bg-main)"
                stroke="var(--income)"
                strokeWidth="2.5"
                className="chart-dot"
                onMouseEnter={() => {
                  setHoveredPoint({
                    index: i,
                    x: pt.x,
                    y: Math.min(pt.yInc, pt.yExp),
                    label: pt.label,
                    income: pt.income,
                    expense: pt.expense
                  });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* Expense dot */}
              <circle
                cx={pt.x}
                cy={pt.yExp}
                r={hoveredPoint && hoveredPoint.index === i ? 6 : 4}
                fill="var(--bg-main)"
                stroke="var(--expense)"
                strokeWidth="2.5"
                className="chart-dot"
                onMouseEnter={() => {
                  setHoveredPoint({
                    index: i,
                    x: pt.x,
                    y: Math.min(pt.yInc, pt.yExp),
                    label: pt.label,
                    income: pt.income,
                    expense: pt.expense
                  });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          );
        })}

        {/* X Axis Base Line */}
        <line
          x1={paddingLeft}
          y1={zeroY}
          x2={width - paddingRight}
          y2={zeroY}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="chart-tooltip"
          style={{
            display: 'block',
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)',
            position: 'absolute',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {hoveredPoint.label} Overview
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--income)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Income: <strong style={{ color: '#fff' }}>{formatCurrency(hoveredPoint.income)}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--expense)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Expense: <strong style={{ color: '#fff' }}>{formatCurrency(hoveredPoint.expense)}</strong></span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '4px', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-muted)' }}>Net Flow:</span>
              <span style={{ color: (hoveredPoint.income - hoveredPoint.expense) >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                {formatCurrency(hoveredPoint.income - hoveredPoint.expense)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 4. Horizontal Category Spending Bar Chart
// ----------------------------------------------------
export function CategorySpendBar({ label, spent, budget, color }) {
  const percent = Math.min((spent / (budget || 1)) * 100, 100);
  
  // Decide color scale: Green -> Amber -> Red
  const getBarColorClass = () => {
    const ratio = spent / (budget || 1);
    if (ratio < 0.6) return 'bar-green';
    if (ratio <= 0.85) return 'bar-amber';
    return 'bar-red';
  };

  return (
    <div className="horizontal-bar-item" style={{ marginBottom: '1.2rem' }}>
      <div className="bar-info" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>
        <span style={{ color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          <strong>{formatCurrency(spent)}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ {formatCurrency(budget)}</span>
        </span>
      </div>

      <div className="bar-track" style={{ height: '8px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div
          className={`bar-fill ${getBarColorClass()}`}
          style={{
            height: '100%',
            width: `${percent}%`,
            borderRadius: '4px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>

      <style>{`
        .bar-fill {
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        }
        .bar-green {
          background: var(--income-gradient);
          box-shadow: 0 0 10px var(--income-glow);
        }
        .bar-amber {
          background: var(--warning-gradient);
          box-shadow: 0 0 10px var(--warning-glow);
        }
        .bar-red {
          background: var(--expense-gradient);
          box-shadow: 0 0 10px var(--expense-glow);
        }
      `}</style>
    </div>
  );
}

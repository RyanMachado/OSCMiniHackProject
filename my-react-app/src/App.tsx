import React, { useState } from 'react';
import { DollarSign, PlusCircle, Settings, BarChart3, Lightbulb, User } from 'lucide-react';

const MAX_MONTHLY_INCOME = 1000000000000;
const MIN_MONTHLY_INCOME = 0;

const FinanceApp = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [darkMode, setDarkMode] = useState(false);

  type Category = { id: string; name: string; amount: number; color: string };

  const palette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#7FB3D5', '#73C6B6', '#F5B7B1'
  ];
  const pickColor = (i: number) => palette[i % palette.length];
  const uid = () => Math.random().toString(36).slice(2, 9);

  const [categories, setCategories] = useState<Category[]>([
    { id: uid(), name: 'Rent',          amount: 1300, color: pickColor(0) },
    { id: uid(), name: 'Food',          amount: 520,  color: pickColor(1) },
    { id: uid(), name: 'Car',           amount: 400,  color: pickColor(2) },
    { id: uid(), name: 'Subscriptions', amount: 150,  color: pickColor(3) },
    { id: uid(), name: 'Insurance',     amount: 200,  color: pickColor(4) },
  ]);

  const [savingsInvesting, setSavingsInvesting] = useState(800);

  // Calculate totals
  const totalExpenses = categories.reduce((sum, c) => sum + c.amount, 0);
  const remaining = monthlyIncome - totalExpenses - savingsInvesting;
  const nonRecurringBudget = 800;

  const expenseBreakdown = categories
    .filter(c => c.amount > 0)
    .map(c => ({
      name: c.name,
      value: c.amount,
      color: c.color,
      percentage: monthlyIncome > 0 ? ((c.amount / monthlyIncome) * 100).toFixed(1) : '0.0',
    }));

  const pieData = [
    ...expenseBreakdown,
    {
      name: 'Savings/Investing',
      value: savingsInvesting,
      color: '#F7DC6F',
      percentage: monthlyIncome > 0 ? ((savingsInvesting / monthlyIncome) * 100).toFixed(1) : '0.0',
    },
    {
      name: 'Remaining',
      value: remaining,
      color: '#BB8FCE',
      percentage: monthlyIncome > 0 ? ((remaining / monthlyIncome) * 100).toFixed(1) : '0.0',
    },
  ];

  // Category management
  const addCategory = (name: string, initialAmount = 0) => {
    const clean = name.trim();
    if (!clean) return;
    if (categories.some(c => c.name.toLowerCase() === clean.toLowerCase())) return;
    setCategories(prev => [...prev, {
      id: uid(),
      name: clean,
      amount: Math.max(0, initialAmount),
      color: pickColor(prev.length),
    }]);
  };

  const updateCategoryAmount = (id: string, value: string) => {
    const amt = parseFloat(value) || 0;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, amount: amt } : c));
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const getAmt = (name: string) =>
    categories.find(c => c.name.toLowerCase() === name.toLowerCase())?.amount ?? 0;

  function AddCategoryRow({ onAdd }: { onAdd: (name: string) => void }) {
    const [name, setName] = useState('');
    return (
      <div className="flex items-center gap-3">
        <input
          placeholder="Add new category (e.g., Gym, Pets)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          type="button"
          onClick={() => { onAdd(name); setName(''); }}
          className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    );
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">FinPlan</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="icon-btn">
              <Settings className="h-5 w-5" />
            </button>
            <button className="icon-btn">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
                User Input
              </h2>

              {/* Monthly Income */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Monthly Income
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => {
                    const raw = parseFloat(e.target.value) || 0;
                    const clamped = Math.min(MAX_MONTHLY_INCOME, Math.max(MIN_MONTHLY_INCOME, raw));
                    setMonthlyIncome(clamped);
                  }}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Enter monthly income"
                />
              </div>

              {/* Recurring Expenses */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Recurring Expenses</h3>
                <div className="space-y-3">
                  <AddCategoryRow onAdd={(name) => addCategory(name)} />

                  <div className="space-y-3 mt-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-3">
                        <label className="block text-sm font-medium w-36">
                          {cat.name}
                        </label>
                        <input
                          type="number"
                          value={cat.amount}
                          onChange={(e) => updateCategoryAmount(cat.id, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeCategory(cat.id)}
                          className="remove-btn"
                          aria-label={`Remove ${cat.name}`}
                        >
                          ×
                        </button>

                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Savings/Investing */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Savings/Investing
                </label>
                <input
                  type="number"
                  value={savingsInvesting}
                  onChange={(e) => setSavingsInvesting(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Enter savings amount"
                />
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Category Breakdown
              </h2>

              <div className="space-y-4">
                {pieData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">${item.value.toLocaleString()}</span>
                        <div className="text-sm">{item.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${item.percentage}%`, 
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Budget Summary</h2>
              <div className="space-y-4">
                <div className="summary-box green">
                  <span>Budget Remaining</span>
                  <span className="value">${remaining.toLocaleString()}</span>
                </div>
                <div className="summary-box blue">
                  <span>Non-recurring Budget</span>
                  <span className="value">${nonRecurringBudget.toLocaleString()}</span>
                </div>
                <div className="summary-box purple">
                  <span>Total Monthly Expenses</span>
                  <span className="value">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="summary-box gray">
                  <span>Monthly Status</span>
                  <span className={`value ${remaining >= 0 ? 'ok' : 'bad'}`}>
                    {remaining >= 0 ? 'On Track' : 'Over Budget'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                AI Insights/Recommendations
              </h2>
              <div className="space-y-4">
                <div className="insight yellow">
                  <p>
                    <strong>Savings Rate:</strong> You're saving {((savingsInvesting / monthlyIncome) * 100).toFixed(1)}% of your income. {savingsInvesting / monthlyIncome >= 0.2 ? 'Great job!' : 'Consider increasing to 20% if possible.'}
                  </p>
                </div>
                <div className="insight blue">
                  <p>
                    <strong>Housing Cost:</strong> Your rent is {((getAmt('Rent') / monthlyIncome) * 100 || 0).toFixed(1)}% of income. {getAmt('Rent') / monthlyIncome <= 0.3 ? 'This is within the recommended 30% rule.' : 'Consider reducing housing costs - aim for 30% or less.'}
                  </p>
                </div>
                <div className="insight green">
                  <p>
                    <strong>Emergency Fund:</strong> Aim to save 3-6 months of expenses (${(totalExpenses * 3).toLocaleString()} - ${(totalExpenses * 6).toLocaleString()}).
                  </p>
                </div>
                {remaining < 0 && (
                  <div className="insight red">
                    <p>
                      <strong>Budget Alert:</strong> You're ${Math.abs(remaining).toLocaleString()} over budget. Consider reducing expenses or increasing income.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Account Settings
              </h2>
              <div className="space-y-3">
                <button className="settings-btn">Profile Settings →</button>
                <button className="settings-btn">Notification Preferences →</button>
                <button className="settings-btn">Export Data →</button>
                <button className="settings-btn">Privacy Settings →</button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`toggle ${darkMode ? 'on' : 'off'}`}
                >
                  <span className="dot" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinanceApp;

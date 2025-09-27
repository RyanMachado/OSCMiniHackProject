import React, { useState } from 'react';
import { DollarSign, PlusCircle, Settings, BarChart3, Lightbulb, User } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function WrappedLegend({ payload = [] }: { payload?: any[] }) {
  return (
    <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-2 text-gray-700">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

const FinanceApp = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({
    rent: 1300,
    food: 520,
    car: 400,
    subs: 150,
    insurance: 200
  });
  const [savingsInvesting, setSavingsInvesting] = useState(800);

  // Calculate totals
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const remaining = monthlyIncome - totalExpenses - savingsInvesting;
  const nonRecurringBudget = 800;

  // Calculate total allocated (for percentage calculations)
  const totalAllocated = totalExpenses + savingsInvesting + Math.max(0, remaining);
  
  // Data for visualization - show remaining as 0 if negative, and calculate percentages based on total allocated or income (whichever is larger)
  const remainingForDisplay = Math.max(0, remaining);
  const baseForPercentage = Math.max(monthlyIncome, totalAllocated);
  
  // Define colors for categories
  const categoryColors: { [key: string]: string } = {
    rent: '#FF6B6B',
    food: '#4ECDC4',
    car: '#45B7D1',
    subs: '#FFA07A',
    subscriptions: '#FFA07A',
    insurance: '#98D8C8',
    gym: '#FF9F43',
    pets: '#A55EEA',
    entertainment: '#26C281',
    utilities: '#FD79A8',
    healthcare: '#00B894',
    transportation: '#6C5CE7'
  };

  // Generate a color for categories not in the predefined list
  const getColorForCategory = (category: string, index: number) => {
    if (categoryColors[category]) {
      return categoryColors[category];
    }
    // Generate colors for custom categories
    const colors = ['#E17055', '#00CEC9', '#FDCB6E', '#6C5CE7', '#A29BFE', '#FD79A8', '#00B894', '#E84393'];
    return colors[index % colors.length];
  };

  // Dynamically generate pie data from expenses object
  const expenseData = Object.entries(expenses).map(([key, value], index) => ({
    name: key === 'subs' ? 'Subscriptions' : key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: getColorForCategory(key, index),
    percentage: ((value / baseForPercentage) * 100).toFixed(1)
  }));

  const pieData = [
    ...expenseData,
    { 
      name: 'Savings/Investing', 
      value: savingsInvesting, 
      color: '#F7DC6F', 
      percentage: ((savingsInvesting / baseForPercentage) * 100).toFixed(1) 
    },
    { 
      name: 'Remaining', 
      value: remainingForDisplay, 
      color: '#BB8FCE', 
      percentage: remainingForDisplay > 0 ? ((remainingForDisplay / baseForPercentage) * 100).toFixed(1) : '0.0' 
    }
  ];

  // ---- Pie chart series (hide zeros; clamp negatives) ----
const chartData = [
  ...expenseData.map(d => ({ name: d.name, value: d.value, color: d.color })),
  { name: 'Savings/Investing', value: Math.max(0, savingsInvesting), color: '#F7DC6F' },
  { name: 'Remaining',         value: Math.max(0, remaining),        color: '#BB8FCE' },
].filter(d => d.value > 0);

const SLICE_COLORS = chartData.map(d => d.color);


  const [newCategory, setNewCategory] = useState('');

  const updateExpense = (category: string, value: string) => {
    setExpenses(prev => ({ ...prev, [category]: parseFloat(value) || 0 }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !expenses[newCategory.toLowerCase()]) {
      setExpenses(prev => ({ ...prev, [newCategory.toLowerCase()]: 0 }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setExpenses(prev => {
      const newExpenses = { ...prev };
      delete newExpenses[category];
      return newExpenses;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">FinPlan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - User Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
                User Input
              </h2>
              
              {/* Monthly Income */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter monthly income"
                />
              </div>

              {/* Add New Category */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Category</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add new category (e.g., Gym, Pets)"
                  />
                  <button
                    onClick={addCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Recurring Expenses */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recurring Expenses</h3>
                <div className="space-y-3">
                  {Object.entries(expenses).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                          {key === 'subs' ? 'Subscriptions' : key}
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => updateExpense(key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={() => removeCategory(key)}
                        className="mt-6 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove category"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Savings/Investing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Savings/Investing
                </label>
                <input
                  type="number"
                  value={savingsInvesting}
                  onChange={(e) => setSavingsInvesting(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter savings amount"
                />
              </div>
            </div>
          </div>

          {/* Middle Column - Visualizations */}
          <div className="space-y-6">
            {/* Category Breakdown (without chart library) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Category Breakdown
              </h2>
              
              {/* Visual bars instead of pie chart */}
              <div className="space-y-4">
                {pieData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">${item.value.toLocaleString()}</span>
                        <div className="text-sm text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${item.value > 0 ? item.percentage : '0'}%`, 
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget Summary</h2>
              <div className="space-y-4">
                <div className={`flex justify-between items-center p-4 rounded-lg border-l-4 ${
                  remaining >= 0 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                }`}>
                  <span className="font-medium text-gray-700">Budget Remaining</span>
                  <span className={`font-bold text-xl ${
                    remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${remaining.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <span className="font-medium text-gray-700">Non-recurring Budget</span>
                  <span className="font-bold text-blue-600 text-xl">${nonRecurringBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <span className="font-medium text-gray-700">Total Monthly Expenses</span>
                  <span className="font-bold text-purple-600 text-xl">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <span className="font-medium text-gray-700">Monthly Status</span>
                  <span className={`font-bold text-xl ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remaining >= 0 ? 'On Track' : 'Over Budget'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Insights & Settings */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Insights/Recommendations
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Savings Rate:</strong> You're saving {((savingsInvesting / monthlyIncome) * 100).toFixed(1)}% of your income. {savingsInvesting / monthlyIncome >= 0.2 ? 'Great job!' : 'Consider increasing to 20% if possible.'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Housing Cost:</strong> Your rent is {((expenses.rent / monthlyIncome) * 100).toFixed(1)}% of income. {expenses.rent / monthlyIncome <= 0.3 ? 'This is within the recommended 30% rule.' : 'Consider reducing housing costs - aim for 30% or less.'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Emergency Fund:</strong> Aim to save 3-6 months of expenses (${(totalExpenses * 3).toLocaleString()} - ${(totalExpenses * 6).toLocaleString()}).
                  </p>
                </div>
                {remaining < 0 && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Budget Alert:</strong> You're ${Math.abs(remaining).toLocaleString()} over budget. Consider reducing expenses or increasing income.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Spending Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Spending Breakdown (Pie Chart)
              </h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      strokeWidth={2}
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={`slice-${i}`} fill={SLICE_COLORS[i] || '#8884d8'} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(val: number) => `$${val.toLocaleString()}`}
                      contentStyle={{ borderRadius: 8 }}
                    />
                    <Legend content={<WrappedLegend/>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Toggle Dark Mode Placeholder */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Dark Mode</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform translate-x-1" />
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
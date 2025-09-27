import React, { useState, useEffect } from 'react';
import { DollarSign, PlusCircle, Settings, BarChart3, Lightbulb, User } from 'lucide-react';

const FinanceApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({
    rent: 1300,
    food: 520,
    car: 400,
    subs: 150,
    insurance: 200
  });
  const [savingsInvesting, setSavingsInvesting] = useState(800);

  // Apply dark mode class to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <header className={`transition-colors duration-300 shadow-lg ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } border-b`}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                FinMan
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <Settings className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - User Input */}
          <div className="space-y-6">
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
                User Input
              </h2>
              
              {/* Monthly Income */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Monthly Income
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter monthly income"
                />
              </div>

              {/* Add New Category */}
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>Add New Category</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
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
                <h3 className={`text-lg font-medium mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>Recurring Expenses</h3>
                <div className="space-y-3">
                  {Object.entries(expenses).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <label className={`block text-sm font-medium mb-1 capitalize ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {key === 'subs' ? 'Subscriptions' : key}
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => updateExpense(key, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => removeCategory(key)}
                        className={`mt-6 p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-900' 
                            : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                        }`}
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
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Savings/Investing
                </label>
                <input
                  type="number"
                  value={savingsInvesting}
                  onChange={(e) => setSavingsInvesting(parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter savings amount"
                />
              </div>
            </div>
          </div>

          {/* Middle Column - Visualizations */}
          <div className="space-y-6">
            {/* Category Breakdown (without chart library) */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
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
                        <span className={`font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>${item.value.toLocaleString()}</span>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{item.percentage}%</div>
                      </div>
                    </div>
                    <div className={`w-full rounded-full h-2 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
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
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Budget Summary</h2>
              <div className="space-y-4">
                <div className={`flex justify-between items-center p-4 rounded-lg border-l-4 ${
                  remaining >= 0 
                    ? darkMode 
                      ? 'bg-green-900 border-green-400' 
                      : 'bg-green-50 border-green-400'
                    : darkMode 
                      ? 'bg-red-900 border-red-400' 
                      : 'bg-red-50 border-red-400'
                }`}>
                  <span className={`font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Budget Remaining</span>
                  <span className={`font-bold text-xl ${
                    remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${remaining.toLocaleString()}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg border-l-4 border-blue-400 ${
                  darkMode ? 'bg-blue-900' : 'bg-blue-50'
                }`}>
                  <span className={`font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Non-recurring Budget</span>
                  <span className="font-bold text-blue-600 text-xl">${nonRecurringBudget.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg border-l-4 border-purple-400 ${
                  darkMode ? 'bg-purple-900' : 'bg-purple-50'
                }`}>
                  <span className={`font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Total Monthly Expenses</span>
                  <span className="font-bold text-purple-600 text-xl">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg border-l-4 border-gray-400 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <span className={`font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Monthly Status</span>
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
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Insights/Recommendations
              </h2>
              <div className="space-y-4">
                <div className={`p-4 border-l-4 border-yellow-400 rounded-r-lg ${
                  darkMode ? 'bg-yellow-900' : 'bg-yellow-50'
                }`}>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <strong>Savings Rate:</strong> You're saving {((savingsInvesting / monthlyIncome) * 100).toFixed(1)}% of your income. {savingsInvesting / monthlyIncome >= 0.2 ? 'Great job!' : 'Consider increasing to 20% if possible.'}
                  </p>
                </div>
                <div className={`p-4 border-l-4 border-blue-400 rounded-r-lg ${
                  darkMode ? 'bg-blue-900' : 'bg-blue-50'
                }`}>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <strong>Housing Cost:</strong> Your rent is {((expenses.rent / monthlyIncome) * 100).toFixed(1)}% of income. {expenses.rent / monthlyIncome <= 0.3 ? 'This is within the recommended 30% rule.' : 'Consider reducing housing costs - aim for 30% or less.'}
                  </p>
                </div>
                <div className={`p-4 border-l-4 border-green-400 rounded-r-lg ${
                  darkMode ? 'bg-green-900' : 'bg-green-50'
                }`}>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <strong>Emergency Fund:</strong> Aim to save 3-6 months of expenses (${(totalExpenses * 3).toLocaleString()} - ${(totalExpenses * 6).toLocaleString()}).
                  </p>
                </div>
                {remaining < 0 && (
                  <div className={`p-4 border-l-4 border-red-400 rounded-r-lg ${
                    darkMode ? 'bg-red-900' : 'bg-red-50'
                  }`}>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong>Budget Alert:</strong> You're ${Math.abs(remaining).toLocaleString()} over budget. Consider reducing expenses or increasing income.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Spending Pie Chart - Pure CSS Version */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Spending Breakdown (Pie Chart)
              </h2>

              {chartData.length > 0 ? (
                <>
                  {/* CSS-only Pie Chart */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {(() => {
                          let cumulativePercentage = 0;
                          const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
                          
                          return chartData.map((item, index) => {
                            const percentage = (item.value / totalValue) * 100;
                            const strokeDasharray = `${percentage} ${100 - percentage}`;
                            const strokeDashoffset = -cumulativePercentage;
                            
                            const element = (
                              <circle
                                key={index}
                                cx="50"
                                cy="50"
                                r="15.915494309"
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth="31.830988618"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                              />
                            );
                            
                            cumulativePercentage += percentage;
                            return element;
                          });
                        })()}
                      </svg>
                      
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ${chartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                          </div>
                          <div className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>Total</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2">
                    {chartData.map((entry, index) => {
                      const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
                      const percentage = ((entry.value / totalValue) * 100).toFixed(1);
                      
                      return (
                        <div key={`legend-${index}`} className="flex items-center gap-2 text-sm">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className={`truncate ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {entry.name}: ${entry.value.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className={`h-48 flex items-center justify-center ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No data to display
                </div>
              )}
            </div>

            {/* Working Dark Mode Toggle */}
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium text-lg ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>Dark Mode</span>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Toggle between light and dark themes
                  </p>
                </div>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    darkMode 
                      ? 'bg-blue-600 focus:ring-blue-500' 
                      : 'bg-gray-300 focus:ring-gray-400'
                  } ${
                    darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                  }`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
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
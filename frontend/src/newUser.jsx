import React, { useState } from 'react';
import './styles/newUser.css';
import { useNavigate } from 'react-router-dom';

function BudgetTrackerForm() {
  const navigate = useNavigate();
  // State for form data
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      baseSalary: '',
      isEarner: true,
      dependantOf: '',
    },
    accounts: [
      {
        accountName: '',
        institutionName: '',
        accountType: 'checking',
        lastFourDigits: '',
        currentBalance: '',
      }
    ],
    expenses: [
      { expenseType: '', amount: '', dueDate: '' }
    ]
  });

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [name]: value
      }
    });
  };

  // Handle account changes
  const handleAccountChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAccounts = [...formData.accounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      accounts: updatedAccounts
    });
  };

  // Add a new account
  const addAccount = () => {
    setFormData({
      ...formData,
      accounts: [
        ...formData.accounts,
        {
          accountName: '',
          institutionName: '',
          accountType: 'checking',
          lastFourDigits: '',
          currentBalance: '',
        }
      ]
    });
  };

  // Handle expense changes
  const handleExpenseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExpenses = [...formData.expenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      expenses: updatedExpenses
    });
  };

  // Add a new custom expense
  const addExpense = () => {
    setFormData({
      ...formData,
      expenses: [
        ...formData.expenses,
        { expenseType: '', amount: '', dueDate: '' }
      ]
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('Registration successful!');
        console.log('Success:', data);

        navigate('/profiles', { 
          replace: true, 
          state: data.profile_id
        });
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
        console.error('Error:', errorData);
      }
    } catch (error) {
      alert('An error occurred during registration.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      <h1>Family Budget Tracker Registration</h1>
      <form onSubmit={handleSubmit}>
        
        {/* Personal Information Section */}
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.personalInfo.fullName}
              onChange={handlePersonalInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="streetAddress">Street Address</label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.personalInfo.streetAddress}
              onChange={handlePersonalInfoChange}
              required
            />
          </div>
          
          <div className="inline-group">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.personalInfo.city}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.personalInfo.state}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.personalInfo.zipCode}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="baseSalary">Annual Base Salary</label>
            <input
              type="number"
              id="baseSalary"
              name="baseSalary"
              min="0"
              step="0.01"
              value={formData.personalInfo.baseSalary}
              onChange={handlePersonalInfoChange}
              required={formData.personalInfo.isEarner}
              disabled={!formData.personalInfo.isEarner}
            />
          </div>
          
          <div className="form-group">
            <label>Financial Status</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isEarner"
                  checked={formData.personalInfo.isEarner}
                  onChange={() => {
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo,
                        isEarner: true,
                        dependantOf: ''
                      }
                    });
                  }}
                />
                <span>Income Earner</span>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="isEarner"
                  checked={!formData.personalInfo.isEarner}
                  onChange={() => {
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo,
                        isEarner: false,
                        baseSalary: ''
                      }
                    });
                  }}
                />
                <span>Dependant</span>
              </label>
            </div>
          </div>
          
          {!formData.personalInfo.isEarner && (
            <div className="form-group">
              <label htmlFor="dependantOf">Dependant of (Income Earner's Name)</label>
              <input
                type="text"
                id="dependantOf"
                name="dependantOf"
                value={formData.personalInfo.dependantOf}
                onChange={handlePersonalInfoChange}
                required={!formData.personalInfo.isEarner}
              />
            </div>
          )}
        </div>
        
        {/* Bank Accounts Section */}
        <div className="form-section">
          <h2>Bank Accounts</h2>
          {formData.accounts.map((account, index) => (
            <div key={index} className="account-section">
              <div className="form-group">
                <label htmlFor={`accountName-${index}`}>Account Name</label>
                <input
                  type="text"
                  id={`accountName-${index}`}
                  name="accountName"
                  value={account.accountName}
                  onChange={(e) => handleAccountChange(index, e)}
                  placeholder="e.g., Primary Checking"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`institutionName-${index}`}>Financial Institution</label>
                <input
                  type="text"
                  id={`institutionName-${index}`}
                  name="institutionName"
                  value={account.institutionName}
                  onChange={(e) => handleAccountChange(index, e)}
                  placeholder="e.g., Chase Bank"
                  required
                />
              </div>
              
              <div className="inline-group">
                <div className="form-group">
                  <label htmlFor={`accountType-${index}`}>Account Type</label>
                  <select
                    id={`accountType-${index}`}
                    name="accountType"
                    value={account.accountType}
                    onChange={(e) => handleAccountChange(index, e)}
                    required
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor={`lastFourDigits-${index}`}>Last 4 Digits</label>
                  <input
                    type="text"
                    id={`lastFourDigits-${index}`}
                    name="lastFourDigits"
                    maxLength="4"
                    pattern="[0-9]{4}"
                    value={account.lastFourDigits}
                    onChange={(e) => handleAccountChange(index, e)}
                    placeholder="1234"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`currentBalance-${index}`}>Current Balance</label>
                <input
                  type="number"
                  id={`currentBalance-${index}`}
                  name="currentBalance"
                  min="0"
                  step="0.01"
                  value={account.currentBalance}
                  onChange={(e) => handleAccountChange(index, e)}
                  required
                />
              </div>
            </div>
          ))}
          
          <div className="add-more" onClick={addAccount}>
            + Add Another Account
          </div>
        </div>
        
        {/* Monthly Expenses Section */}
        <div className="form-section">
          <h2>Monthly Expenses</h2>
          {formData.expenses.map((expense, index) => (
            <div key={index} className="expense-row">
              <div className="form-group">
                <label htmlFor={`expenseType-${index}`}>Expense Type</label>
                <select
                  id={`expenseType-${index}`}
                  name="expenseType"
                  value={expense.expenseType}
                  onChange={(e) => handleExpenseChange(index, e)}
                  required
                >
                  <option value="">Select an expense type</option>
                  <option value="Mortgage">Mortgage/Rent</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Student Loan">Student Loan</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Medical Insurance">Medical Insurance</option>
                  <option value="Car Insurance">Car Insurance</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Internet">Internet</option>
                  <option value="Phone">Phone Bill</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Childcare">Childcare</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Subscription">Subscriptions</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor={`amount-${index}`}>Amount</label>
                <input
                  type="number"
                  id={`amount-${index}`}
                  name="amount"
                  min="0"
                  step="0.01"
                  value={expense.amount}
                  onChange={(e) => handleExpenseChange(index, e)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`dueDate-${index}`}>Due Date</label>
                <input
                  type="date"
                  id={`dueDate-${index}`}
                  name="dueDate"
                  value={expense.dueDate}
                  onChange={(e) => handleExpenseChange(index, e)}
                />
              </div>
              
              {index > 0 && (
                <button 
                  type="button" 
                  className="btn-remove" 
                  onClick={() => {
                    const updatedExpenses = [...formData.expenses];
                    updatedExpenses.splice(index, 1);
                    setFormData({...formData, expenses: updatedExpenses});
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <div className="add-more" onClick={addExpense}>
            + Add Another Expense
          </div>
        </div>
        
        <div className="btn-container">
          <button type="submit" className="btn-primary">Register & Start Tracking</button>
        </div>
      </form>
    </div>
  );
}

export default BudgetTrackerForm;
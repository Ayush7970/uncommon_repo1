import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BudgetTrackerForm from './newUser.jsx';
import Users from './Users.jsx';
import BudgetPlanning from './components/BudgetPlanning.jsx';
import GraphicView from './components/GraphicView.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<BudgetTrackerForm />} />
        <Route path="/profiles" element={<Users />} />
        <Route path="/budget-planning" element={<BudgetPlanning />} />
        <Route path="/graphic-view" element={<GraphicView />} />
        <Route path="/" element={<Navigate to="/profiles" />} />
      </Routes>
    </Router>
  );
}

export default App;

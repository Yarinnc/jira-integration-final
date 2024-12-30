import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginForm from './components/LoginForm';
import CreateTicketForm from './components/CreateTicketForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />}>
          <Route index element={<LoginForm />} />
          <Route path="create-ticket" element={<CreateTicketForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import UserContextProvider from './UserContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <Home />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import UserContextProvider from './UserContextProvider';

const loginConfig = {
  client_id: 'Ih_hLXePZxqfSfwxBLeqynAFLfka',
  redirect_url: 'http://localhost:3000/redirect.html',
  logout_url: 'https://identity.us.to/oidc/logout',
  epConfig: {
    authorization_endpoint: 'https://identity.us.to/oauth2/authorize',
    token_endpoint: 'https://identity.us.to/oauth2/token',
    revocation_endpoint: 'https://identity.us.to/oauth2/revoke',
    userinfo_endpoint: 'https://identity.us.to/oauth2/userinfo'
  }
};

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider config={loginConfig} >
      <Home />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

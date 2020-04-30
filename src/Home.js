import React, { useContext, useState } from 'react';
import UserContext from './UserContext'
import './Home.css';

function Home() {
  const userContext = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  }
  return (
    <header>
      <nav>
        <button onClick={handleProfileClick}>{userContext.user}</button>
      </nav>
      {showProfile ?
        <div className="popup">
          <button onClick={userContext.handleLogout}>logout</button>
        </div>
        : null}
    </header>

  );
}

export default Home;

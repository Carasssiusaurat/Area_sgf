import './App.css';
import React, {Button} from 'react';

function App() {
  const connect_instagram = async () => {
    console.log("clicked");
    window.location.href = "http://localhost:3000/auth/instagram";
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => connect_instagram()}>
          connect to instagram
        </button>
      </header>
    </div>
  );
}

export default App;

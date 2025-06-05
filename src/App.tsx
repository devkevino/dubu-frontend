import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Web3AuthProvider } from './providers/Web3AuthProvider';
import AppRouter from './AppRouter';
import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Web3AuthProvider>
          <AppRouter />
        </Web3AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
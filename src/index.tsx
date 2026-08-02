import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { initConsent } from './lib';

initConsent();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

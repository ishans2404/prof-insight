import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react';
import { Analytics } from '@mui/icons-material';
import ReactGA from "react-ga4";

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
ReactGA.initialize("G-G59ZFP6DQG");
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
      <Analytics />
    </ClerkProvider>
  </React.StrictMode>
);
reportWebVitals();
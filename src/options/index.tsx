import React from 'react';
import ReactDOM from 'react-dom/client';
import OptionsApp from './OptionsApp';
import ErrorBoundary from '@shared/components/ErrorBoundary';
import '@/assets/styles/global.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <OptionsApp />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

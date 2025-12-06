import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/index.css';
import setupAxios from './setupAxios';

setupAxios();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

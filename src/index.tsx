import React from 'react';
import ReactDOM from 'react-dom/client';
import AnimalDataManager from './components/animal-table';
import './style.css';

const root = ReactDOM.createRoot(document.querySelector<HTMLDivElement>('#app')!);
root.render(
    <React.StrictMode>
        <AnimalDataManager />
    </React.StrictMode>
);

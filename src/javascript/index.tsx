import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';
import '../css/styles.css';

import App from './components/App';
import AppState from './models/AppState';

function render(appState: AppState) {
    const container = document.getElementById('main');
    if (!container) {
        throw new Error('Could not find root element');
    }
    const root = createRoot(container);
    root.render(<App appState={appState} />);
}

const appState = new AppState({
    renderFunction: render,
});

appState.render();

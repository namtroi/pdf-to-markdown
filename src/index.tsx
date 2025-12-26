import { createRoot } from 'react-dom/client';

import './styles.css';

import App from './components/App';
import AppState from './models/AppState';

let root: ReturnType<typeof createRoot> | undefined;

function render(appState: AppState) {
    if (!root) {
        const container = document.getElementById('main');
        if (!container) {
            throw new Error('Could not find root element');
        }
        root = createRoot(container);
    }
    root.render(<App appState={appState} />);
}

const appState = new AppState({
    renderFunction: render,
});

appState.render();

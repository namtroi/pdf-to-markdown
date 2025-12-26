import TopBar from './TopBar';
import { View } from '../models/AppState';
import UploadView from './UploadView';
import LoadingView from './LoadingView';
import ResultView from './ResultView';
import DebugView from './DebugView';
import AppState from '../models/AppState';

interface AppProps {
    appState: AppState;
}

export default function App({ appState }: AppProps) {
    let mainView;
    switch (appState.mainView) {
        case View.UPLOAD:
            mainView = <UploadView uploadPdfFunction={(buffer) => appState.storeFileBuffer(buffer.buffer as ArrayBuffer)} />;
            break;
        case View.LOADING:
            mainView = (
                <LoadingView
                    fileBuffer={appState.fileBuffer!}
                    storePdfPagesFunction={appState.storePdfPages}
                />
            );
            break;
        case View.RESULT:
            mainView = <ResultView pages={appState.pages} transformations={appState.transformations} />;
            break;
        case View.DEBUG:
            mainView = <DebugView pages={appState.pages} transformations={appState.transformations} />;
            break;
        default:
            throw `View ${appState.mainView} not supported!`;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
            <TopBar
                mainView={appState.mainView}
                switchMainViewFunction={appState.switchMainView}
            />
            <main className="flex-1 relative bg-slate-100 p-4">
                {mainView}
            </main>
        </div>
    );
}

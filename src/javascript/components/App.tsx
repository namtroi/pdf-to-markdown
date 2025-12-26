import TopBar from './TopBar';
import FooterBar from './FooterBar';
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

    const title =
        appState.metadata && appState.metadata.title ? appState.metadata.title : '';
    return (
        <div>
            <TopBar
                mainView={appState.mainView}
                switchMainViewFunction={appState.switchMainView}
                title={title}
            />
            <div className="container mx-auto px-4">
                <div>{mainView}</div>
            </div>
            <FooterBar />
        </div>
    );
}

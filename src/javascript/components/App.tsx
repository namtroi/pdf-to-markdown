import { Container } from 'react-bootstrap';

import TopBar from './TopBar';
import FooterBar from './FooterBar';
import { View } from '../models/AppState';
import UploadView from './UploadView';
import LoadingView from './LoadingView.jsx';
import ResultView from './ResultView.jsx';
import DebugView from './DebugView.jsx';
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
                    fileBuffer={appState.fileBuffer}
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
            <Container>
                <div>{mainView}</div>
            </Container>
            <FooterBar />
        </div>
    );
}

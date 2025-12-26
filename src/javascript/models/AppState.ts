import { CalculateGlobalStats } from './transformations/textitem/CalculateGlobalStats';

import { CompactLines } from './transformations/lineitem/CompactLines';
import { RemoveRepetitiveElements } from './transformations/lineitem/RemoveRepetitiveElements';
import { VerticalToHorizontal } from './transformations/lineitem/VerticalToHorizontal';
import { DetectTOC } from './transformations/lineitem/DetectTOC';
import { DetectListItems } from './transformations/lineitem/DetectListItems';
import { DetectHeaders } from './transformations/lineitem/DetectHeaders';

import { GatherBlocks } from './transformations/textitemblock/GatherBlocks';
import { DetectCodeQuoteBlocks } from './transformations/textitemblock/DetectCodeQuoteBlocks';
import { DetectListLevels } from './transformations/textitemblock/DetectListLevels';
import { ToTextBlocks } from './transformations/ToTextBlocks';
import { ToMarkdown } from './transformations/ToMarkdown';

export enum View {
    UPLOAD = 'UPLOAD',
    LOADING = 'LOADING',
    RESULT = 'RESULT',
    DEBUG = 'DEBUG',
}

interface AppStateOptions {
    renderFunction: (appState: AppState) => void;
}

// Holds the state of the Application
export default class AppState {
    renderFunction: (appState: AppState) => void;
    mainView: View;
    fileBuffer?: ArrayBuffer;
    metadata?: any;
    pages: any[];
    transformations: any[];

    constructor(options: AppStateOptions) {
        this.renderFunction = options.renderFunction;
        this.mainView = View.UPLOAD;
        this.pages = [];
        this.transformations = [];

        // bind functions
        this.render = this.render.bind(this);
        this.storeFileBuffer = this.storeFileBuffer.bind(this);
        this.storePdfPages = this.storePdfPages.bind(this);
        this.switchMainView = this.switchMainView.bind(this);
    }

    render(): void {
        this.renderFunction(this);
    }

    // the uploaded pdf as file buffer
    storeFileBuffer(fileBuffer: ArrayBuffer): void {
        this.fileBuffer = fileBuffer;
        this.mainView = View.LOADING;
        this.render();
    }

    storePdfPages(metadata: any, fontMap: any, pages: any[]): void {
        this.metadata = metadata;
        this.pages = pages;
        this.fileBuffer = undefined;
        this.mainView = View.RESULT;

        this.transformations = [
            new CalculateGlobalStats(fontMap),
            new CompactLines(),
            new RemoveRepetitiveElements(),
            new VerticalToHorizontal(),
            new DetectTOC(),
            new DetectHeaders(),
            new DetectListItems(),

            new GatherBlocks(),
            new DetectCodeQuoteBlocks(),
            new DetectListLevels(),

            new ToTextBlocks(),
            new ToMarkdown(),
        ];

        this.render();
    }

    switchMainView(view: View): void {
        this.mainView = view;
        this.render();
    }
}

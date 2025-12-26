import { useState, useRef, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Line } from 'rc-progress';
import * as pdfjs from 'pdfjs-dist';

declare const require: any;

const Metadata: any = require('../models/Metadata.jsx').default;
const Page: any = require('../models/Page.jsx').default;
const TextItem: any = require('../models/TextItem.jsx').default;
import { Progress, ProgressStage } from '../models/Progress';
import type { PDFDocumentProxy, PDFPageProxy } from '../types/pdfjs';

pdfjs.GlobalWorkerOptions.workerSrc = 'bundle.worker.js';

interface LoadingViewProps {
    fileBuffer: ArrayBuffer;
    storePdfPagesFunction: (metadata: any, fontMap: Map<string, any>, pages: any[]) => void;
}

interface LoadingState {
    percentDone: number;
}

function calculatePercentDone(progress: Progress): number {
    const activeStage = progress.activeStage();
    const percentDone = activeStage.percentDone();

    if (percentDone === 100) {
        progress.completeStage();
        if (!progress.isComplete()) {
            return calculatePercentDone(progress);
        }
    }

    return percentDone;
}

export default function LoadingView({ fileBuffer, storePdfPagesFunction }: LoadingViewProps) {
    // Refs for mutable data (no re-render on mutation)
    const documentRef = useRef<PDFDocumentProxy | null>(null);
    const metadataRef = useRef<any>(null);
    const pagesRef = useRef<any[]>([]);
    const fontIdsRef = useRef<Set<string>>(new Set());
    const fontMapRef = useRef<Map<string, any>>(new Map());
    const progressRef = useRef<Progress>(
        new Progress([
            new ProgressStage('Parsing Metadata', 2),
            new ProgressStage('Parsing Pages'),
            new ProgressStage('Parsing Fonts', 0)
        ])
    );

    // UI state - only percentDone triggers re-renders
    const [state, setState] = useState<LoadingState>({
        percentDone: 0
    });

    // Force re-render with updated progress
    const forceRerender = () => {
        setState({
            percentDone: calculatePercentDone(progressRef.current)
        });
    };

    const handleDocumentParsed = (pdfDocument: PDFDocumentProxy) => {
        const metadataStage = progressRef.current.metadataStage();
        const pageStage = progressRef.current.pageStage();
        metadataStage.stepsDone++;

        const numPages = pdfDocument.numPages;
        pageStage.steps = numPages;

        const pages = [];
        for (let i = 0; i < numPages; i++) {
            pages.push(
                new Page({
                    index: i
                })
            );
        }

        pagesRef.current = pages;
        documentRef.current = pdfDocument;
        forceRerender();
    };

    const handleMetadataParsed = (metadata: any) => {
        const metadataStage = progressRef.current.metadataStage();
        metadataStage.stepsDone++;
        metadataRef.current = new Metadata(metadata);
        forceRerender();
    };

    const handlePageParsed = (index: number, textItems: any[]) => {
        const pageStage = progressRef.current.pageStage();
        pageStage.stepsDone = pageStage.stepsDone + 1;
        pagesRef.current[index]!.items = textItems;
        forceRerender();
    };

    const handleFontParsed = (fontId: string, font: any) => {
        const fontStage = progressRef.current.fontStage();
        fontMapRef.current.set(fontId, font);
        fontStage.stepsDone++;
        if (progressRef.current.activeStage() === fontStage) {
            forceRerender();
        }
    };

    // Trigger PDF parsing on mount
    useEffect(() => {
        const loadPdf = () => {
            pdfjs
                .getDocument({
                    data: fileBuffer,
                    cMapUrl: 'cmaps/',
                    cMapPacked: true
                })
                .promise.then((pdfDocument: PDFDocumentProxy) => {
                    pdfDocument.getMetadata().then((metadata: any) => {
                        handleMetadataParsed(metadata);
                    });
                    handleDocumentParsed(pdfDocument);

                    for (let j = 1; j <= pdfDocument.numPages; j++) {
                        pdfDocument.getPage(j).then((page: PDFPageProxy) => {
                            const scale = 1.0;
                            const viewport = page.getViewport({ scale });

                            page.getTextContent().then((textContent: any) => {
                                const textItems = textContent.items.map((item: any) => {
                                    // Trigger font resolution
                                    const fontId = item.fontName;
                                    if (!fontIdsRef.current.has(fontId) && fontId.startsWith('g_d0')) {
                                        documentRef.current!._transport.commonObjs.get(
                                            fontId,
                                            (font: any) => {
                                                handleFontParsed(fontId, font);
                                            }
                                        );
                                        fontIdsRef.current.add(fontId);
                                        progressRef.current.fontStage().steps = fontIdsRef.current.size;
                                    }

                                    const tx = pdfjs.Util.transform(viewport.transform, item.transform);

                                    const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
                                    const dividedHeight = item.height / fontHeight;
                                    return new TextItem({
                                        x: Math.round(item.transform[4]),
                                        y: Math.round(item.transform[5]),
                                        width: Math.round(item.width),
                                        height: Math.round(
                                            dividedHeight <= 1 ? item.height : dividedHeight
                                        ),
                                        text: item.str,
                                        font: item.fontName
                                    });
                                });

                                handlePageParsed((page as any)._pageIndex, textItems);
                            });

                            page.getOperatorList().then(() => {
                                // Trigger font retrieval
                            });
                        });
                    }
                });
        };

        loadPdf();
    }, [fileBuffer]);

    // Move side effect from render to useEffect
    useEffect(() => {
        if (state.percentDone === 100) {
            storePdfPagesFunction(metadataRef.current as any, fontMapRef.current, pagesRef.current);
        }
    }, [state.percentDone, storePdfPagesFunction]);

    const { percentDone } = state;
    const stageItems = progressRef.current.stages
        .filter((_elem, i) => i <= progressRef.current.currentStage)
        .map((stage, i) => {
            const progressDetails = stage.steps ? stage.stepsDone + ' / ' + stage.steps : '';
            const checkmark = stage.isComplete() ? <FaCheck color="green" /> : '';
            return (
                <div key={i}>
                    {stage.name}
                    {' ' + progressDetails + ' '}
                    {checkmark}
                </div>
            );
        });

    return (
        <div style={{ textAlign: 'center' }}>
            <br />
            <br />
            <br />
            <Line percent={percentDone} strokeWidth={2} strokeColor="#D3D3D3" />
            <br />
            <br />
            <div>{stageItems}</div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
import { FaCheck, FaSpinner, FaCog } from 'react-icons/fa';
import * as pdfjs from 'pdfjs-dist';

import { Metadata } from '../models/Metadata';
import { Page } from '../models/Page';
import { TextItem } from '../models/TextItem';
import { Progress, ProgressStage } from '../models/Progress';
import type { PDFDocumentProxy, PDFPageProxy } from '../types/pdfjs';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.mjs';

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

    const [state, setState] = useState<LoadingState>({
        percentDone: 0
    });

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

    useEffect(() => {
        if (state.percentDone === 100) {
            storePdfPagesFunction(metadataRef.current as any, fontMapRef.current, pagesRef.current);
        }
    }, [state.percentDone, storePdfPagesFunction]);

    const { percentDone } = state;

    // Smooth progress visualization
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <FaCog className="text-4xl text-indigo-200 animate-spin-slow" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FaSpinner className="text-xl text-indigo-600 animate-spin" />
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-center text-slate-800 mb-2">Processing Document</h3>
                <p className="text-sm text-slate-500 text-center mb-6">Analyzing structure and extracting content...</p>

                <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
                    <div 
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${percentDone}%` }}
                    ></div>
                </div>

                <div className="space-y-3">
                    {progressRef.current.stages.map((stage, i) => {
                        const isActive = i === progressRef.current.currentStage;
                        const isComplete = stage.isComplete();

                        return (
                            <div key={i} className={`flex items-center text-sm transition-colors ${
                                isActive ? 'text-indigo-700 font-medium' : 
                                isComplete ? 'text-green-600' : 'text-slate-400'
                            }`}>
                                <div className={`w-5 h-5 mr-3 flex items-center justify-center rounded-full border ${
                                    isComplete ? 'bg-green-100 border-green-200' : 
                                    isActive ? 'bg-indigo-50 border-indigo-200' : 'border-slate-200'
                                }`}>
                                    {isComplete && <FaCheck className="text-xs" />}
                                    {isActive && <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />}
                                </div>
                                <span>{stage.name}</span>
                                {stage.steps && stage.steps > 0 && (
                                    <span className="ml-auto text-xs opacity-75">
                                        {stage.stepsDone}/{stage.steps}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import { useState, useMemo } from 'react';
import Remarkable from 'remarkable';
import { FaEdit, FaEye, FaCopy, FaDownload } from 'react-icons/fa';

import { ParseResult } from '../models/ParseResult';
type Page = any;
type Transformation = any;

interface ResultViewProps {
    pages: Page[];
    transformations: Transformation[];
}

interface ResultViewState {
    preview: boolean;
    text: string;
}

export default function ResultView({ pages, transformations }: ResultViewProps) {
    // Transform pipeline
    const markdownText = useMemo(() => {
        let parseResult = new ParseResult({ pages });
        let lastTransformation: Transformation | undefined;

        transformations.forEach(transformation => {
            if (lastTransformation) {
                parseResult = lastTransformation.completeTransform(parseResult);
            }
            parseResult = transformation.transform(parseResult);
            lastTransformation = transformation;
        });

        let text = '';
        parseResult.pages.forEach((page: any) => {
            page.items.forEach((item: any) => {
                text += item + '\n';
            });
        });

        return text;
    }, [pages, transformations]);

    const [state, setState] = useState<ResultViewState>({
        preview: false, // Default to Edit mode for "Editor" feel
        text: markdownText
    });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(prev => ({ ...prev, text: event.target.value }));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(state.text);
        // Could add toast here
    };

    const downloadFile = () => {
        const element = document.createElement("a");
        const file = new Blob([state.text], {type: 'text/markdown'});
        element.href = URL.createObjectURL(file);
        element.download = "converted.md";
        document.body.appendChild(element);
        element.click();
    };

    const remarkable = new Remarkable({ breaks: true, html: true });
    const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    };

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        adjustTextareaHeight(event.target);
        handleChange(event);
    };

    // Auto-adjust height on first render when switching to edit mode
    const textareaRef = (element: HTMLTextAreaElement | null) => {
        if (element) {
            adjustTextareaHeight(element);
        }
    };

    const { preview, text } = state;

    return (
        <div className="max-w-6xl mx-auto flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-4 sticky top-16 z-40">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setState(prev => ({ ...prev, preview: false }))}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            !preview 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <FaEdit /> Edit
                    </button>
                    <button
                        onClick={() => setState(prev => ({ ...prev, preview: true }))}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            preview 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <FaEye /> Preview
                    </button>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors"
                    >
                        <FaCopy /> Copy
                    </button>
                    <button 
                        onClick={downloadFile}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <FaDownload /> Download
                    </button>
                </div>
            </div>

            {/* Editor Surface */}
            <div className="bg-white rounded-xl min-h-[80vh] flex flex-col">
                {preview ? (
                    <div 
                        className="prose prose-slate max-w-none p-8 font-serif"
                        dangerouslySetInnerHTML={{ __html: remarkable.render(text) }} 
                    />
                ) : (
                    <textarea
                        ref={textareaRef}
                        className="flex-1 w-full p-8 resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-800 bg-transparent overflow-hidden"
                        value={text}
                        onChange={handleInput}
                        spellCheck={false}
                        placeholder="Markdown content..."
                        style={{ minHeight: '80vh' }}
                    />
                )}
            </div>
            <div className="h-8"></div>
        </div>
    );
}

import { useState, useMemo } from 'react';
import Remarkable from 'remarkable';

declare const require: any;

const ParseResult: any = require('../models/ParseResult.jsx').default;
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
    // Transform pipeline is pure computation - use useMemo
    const markdownText = useMemo(() => {
        let parseResult = new ParseResult({
            pages
        });
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
        preview: true,
        text: markdownText
    });

    const switchToPreview = () => {
        setState(prev => ({ ...prev, preview: true }));
    };

    const switchToEdit = () => {
        setState(prev => ({ ...prev, preview: false }));
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(prev => ({ ...prev, text: event.target.value }));
    };

    const remarkable = new Remarkable({
        breaks: true,
        html: true
    });
    const { preview, text } = state;

    let textComponent;
    if (preview) {
        const html = remarkable.render(text);
        textComponent = <div dangerouslySetInnerHTML={{ __html: html }} />;
    } else {
        textComponent = (
            <textarea
                rows={45}
                cols={150}
                value={text}
                onChange={handleChange}
            />
        );
    }

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={switchToEdit}
                    className={!preview ? 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded' : 'border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded'}
                >
                    Edit
                </button>
                <button
                    onClick={switchToPreview}
                    className={preview ? 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded' : 'border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded'}
                >
                    Preview
                </button>
            </div>
            <hr />
            {textComponent}
        </div>
    );
}

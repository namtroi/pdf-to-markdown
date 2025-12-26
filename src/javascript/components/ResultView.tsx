import { useState, useMemo } from 'react';
import Remarkable from 'remarkable';
import { Button } from 'react-bootstrap';

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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Button
                    onClick={switchToEdit}
                    variant={!preview ? 'primary' : 'outline-primary'}
                >
                    Edit
                </Button>
                <Button
                    onClick={switchToPreview}
                    variant={preview ? 'primary' : 'outline-primary'}
                >
                    Preview
                </Button>
            </div>
            <hr />
            {textComponent}
        </div>
    );
}

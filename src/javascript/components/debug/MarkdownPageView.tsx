// @ts-ignore - Remarkable types not available
import Remarkable from 'remarkable';
import PageView from './PageView';
import type { Page } from '../../models/Page';

interface MarkdownPageViewProps {
    page: Page;
    modificationsOnly?: boolean;
    showWhitespaces?: boolean;
    key?: string | number;
}

export default function MarkdownPageView({
    page,
    modificationsOnly,
    showWhitespaces,
}: MarkdownPageViewProps) {
    const createItemViews = (items: string[]) => {
        const remarkable = new Remarkable({
            breaks: true,
        });
        const html = remarkable.render(items[0] || '');
        return (
            <div>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        );
    };

    return (
        <PageView
            page={page}
            modificationsOnly={modificationsOnly}
            showWhitespaces={showWhitespaces}
            createItemViews={createItemViews}
        />
    );
}

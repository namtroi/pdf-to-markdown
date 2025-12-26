import PageView from './PageView';
import TextItemTable from './TextItemTable';
import type { Page } from '../../models/Page';

interface TextItemPageViewProps {
    page: Page;
    modificationsOnly?: boolean;
    showWhitespaces?: boolean;
    key?: string | number;
}

export default function TextItemPageView({
    page,
    modificationsOnly,
    showWhitespaces,
}: TextItemPageViewProps) {
    const createItemViews = (items: any[]) => (
        <TextItemTable textItems={items} showWhitespaces={showWhitespaces} />
    );

    return (
        <PageView
            page={page}
            modificationsOnly={modificationsOnly}
            showWhitespaces={showWhitespaces}
            createItemViews={createItemViews}
        />
    );
}

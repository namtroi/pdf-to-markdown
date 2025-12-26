import PageView from './PageView';
import LineItemTable from './LineItemTable';
import type { Page } from '../../models/Page';

interface LineItemPageViewProps {
    page: Page;
    modificationsOnly?: boolean;
    showWhitespaces?: boolean;
    key?: string | number;
}

export default function LineItemPageView({
    page,
    modificationsOnly,
    showWhitespaces,
}: LineItemPageViewProps) {
    const createItemViews = (items: any[]) => (
        <LineItemTable items={items} showWhitespaces={showWhitespaces} />
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

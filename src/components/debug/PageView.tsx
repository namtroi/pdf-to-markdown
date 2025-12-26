import React from 'react';
import type { Page } from '../../models/Page';

interface PageViewProps {
    page: Page;
    modificationsOnly?: boolean;
    showWhitespaces?: boolean;
    createItemViews: (items: any[], showWhitespaces?: boolean) => React.ReactNode;
}

export default function PageView({
    page,
    modificationsOnly,
    showWhitespaces,
    createItemViews,
}: PageViewProps) {
    let items = page.items;
    if (modificationsOnly) {
        items = items.filter((block) => block.annotation);
    }

    let content;
    if (items.length === 0 && modificationsOnly) {
        content = <div />;
    } else {
        const itemViews = createItemViews(items, showWhitespaces);
        const header = 'Page ' + (page.index + 1);
        content = (
            <div>
                <h2 id={header}>{header}</h2>
                <hr />
                {itemViews}
            </div>
        );
    }
    return content;
}

import PageView from './PageView';
import LineItemTable from './LineItemTable';
import type { Page } from '../../models/Page';

interface LineItemBlock {
    type?: {
        name: string;
    };
    annotation?: {
        color: string;
        category: string;
    };
    parsedElements?: {
        footnoteLinks: any[];
        footnotes: any[];
    };
    items: any[];
}

interface LineItemBlockPageViewProps {
    page: Page;
    modificationsOnly?: boolean;
    showWhitespaces?: boolean;
    key?: string | number;
}

export default function LineItemBlockPageView({
    page,
    modificationsOnly,
    showWhitespaces,
}: LineItemBlockPageViewProps) {
    const createItemViews = (items: LineItemBlock[]) => {
        const blockTables = items.map((block, i) => {
            const blockType = block.type ? ' - ' + block.type.name : null;
            const blockAnnotation = block.annotation ? (
                <span>{' - ' + block.annotation.category}</span>
            ) : null;
            const borderStyle = block.annotation
                ? {
                      marginBottom: '20px',
                      border: 'solid thin ' + block.annotation.color,
                  }
                : undefined;
            const colorStyle = block.annotation
                ? {
                      color: block.annotation.color,
                  }
                : undefined;

            let footnoteLinks;
            let footnotes;
            if (block.parsedElements) {
                if (block.parsedElements.footnoteLinks.length > 0) {
                    footnoteLinks = <div>{'Footnote-Links: ' + block.parsedElements.footnoteLinks}</div>;
                }
                if (block.parsedElements.footnotes.length > 0) {
                    footnotes = <div>{'Footnotes: ' + block.parsedElements.footnotes}</div>;
                }
            }

            return (
                <div key={i}>
                    <div style={colorStyle}>
                        <b>Block {i + 1}</b>
                        <i>
                            {blockType} {blockAnnotation}
                        </i>
                    </div>
                    <div style={borderStyle}>
                        <LineItemTable items={block.items} showWhitespaces={showWhitespaces} />
                        {footnoteLinks}
                        {footnotes}
                    </div>
                </div>
            );
        });
        return blockTables;
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

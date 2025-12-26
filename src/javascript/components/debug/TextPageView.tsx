import PageView from './PageView';
import type { Page } from '../../models/Page';

interface TextBlock {
    category: string;
    text: string;
}

interface TextPageViewProps {
    page: Page;
    modificationsOnly?: boolean;
    showWhitespaces?: boolean;
    key?: string | number;
}

export default function TextPageView({
    page,
    modificationsOnly,
    showWhitespaces,
}: TextPageViewProps) {
    const createItemViews = (items: TextBlock[]) => (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-3 py-2">#</th>
                        <th className="border border-gray-300 px-3 py-2">Category</th>
                        <th className="border border-gray-300 px-3 py-2">Text</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((block, i) => (
                        <tr key={i}>
                            <td className="border border-gray-300 px-3 py-2">{i}</td>
                            <td className="border border-gray-300 px-3 py-2">{block.category}</td>
                            <td className="border border-gray-300 px-3 py-2">
                                <pre style={{ display: 'inline-block' }}>{block.text}</pre>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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

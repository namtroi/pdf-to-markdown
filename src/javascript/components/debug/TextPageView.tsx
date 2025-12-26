import { Table } from 'react-bootstrap';
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
        <div>
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((block, i) => (
                        <tr key={i}>
                            <td>{i}</td>
                            <td>{block.category}</td>
                            <td>
                                <pre style={{ display: 'inline-block' }}>{block.text}</pre>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
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


interface LineItem {
    text: () => string;
    x: number;
    y: number;
    width: number;
    height: number;
    annotation?: {
        color: string;
        category: string;
    };
    type?: {
        name: string;
    };
    parsedElements?: {
        footnoteLinks: any[];
        containLinks: boolean;
        inlineFormats: number;
    };
    lineFormat?: {
        name: string;
    };
    unopenedFormat?: {
        name: string;
    };
    unclosedFormat?: {
        name: string;
    };
}

interface LineItemTableProps {
    items: LineItem[];
    showWhitespaces?: boolean;
}

export default function LineItemTable({ items, showWhitespaces }: LineItemTableProps) {
    const tableHeader = (
        <thead>
            <tr>
                <th>#</th>
                <th>Text</th>
                <th>X</th>
                <th>Y</th>
                <th>Width</th>
                <th>Height</th>
            </tr>
        </thead>
    );

    const itemRows = items.map((item, i) => (
        <tr key={i} style={item.annotation ? { color: item.annotation.color } : undefined}>
            <td>
                <div style={{ textAlign: 'center' }}>{i}</div>
                <div style={{ textAlign: 'center' }}>
                    {item.annotation ? item.annotation.category : ''}
                </div>
                <div style={{ textAlign: 'center', color: 'brown' }}>
                    {item.type ? item.type.name : ''}
                </div>
                <div style={{ textAlign: 'center', color: 'orange' }}>
                    {item.parsedElements && item.parsedElements.footnoteLinks.length > 0 ? (
                        <div>Footnote-Link</div>
                    ) : (
                        ''
                    )}
                    {item.parsedElements && item.parsedElements.containLinks ? <div>Link</div> : ''}
                    {item.lineFormat ? <div>{item.lineFormat.name}</div> : ''}
                    {item.unopenedFormat ? (
                        <div>Unopened {' ' + item.unopenedFormat.name}</div>
                    ) : (
                        ''
                    )}
                    {item.parsedElements && item.parsedElements.inlineFormats > 0 ? (
                        <div>{item.parsedElements.inlineFormats + 'x Bold/Italic'}</div>
                    ) : (
                        ''
                    )}
                    {item.unclosedFormat ? <div>Unclosed {' ' + item.unclosedFormat.name}</div> : ''}
                </div>
            </td>
            <td>
                {showWhitespaces ? (
                    <pre
                        style={
                            item.annotation
                                ? {
                                      color: item.annotation.color,
                                      display: 'inline-block',
                                  }
                                : {
                                      display: 'inline-block',
                                  }
                        }
                    >
                        {item.text()}
                    </pre>
                ) : (
                    item.text()
                )}
            </td>
            <td>{item.x}</td>
            <td>{item.y}</td>
            <td>{item.width}</td>
            <td>{item.height}</td>
        </tr>
    ));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300">
                {tableHeader}
                <tbody>{itemRows}</tbody>
            </table>
        </div>
    );
}

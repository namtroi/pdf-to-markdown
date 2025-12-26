import { useState } from 'react';
import { Button, Badge, Form, Collapse, Card, Dropdown, Pagination } from 'react-bootstrap';

declare const require: any;

const ParseResult: any = require('../models/ParseResult.jsx').default;
type Page = any;
type Transformation = any;

interface DebugViewProps {
    pages: Page[];
    transformations: Transformation[];
}

interface DebugViewState {
    currentTransformation: number;
    pageNr: number;
    modificationsOnly: boolean;
    showStatistics: boolean;
}

export default function DebugView({ pages, transformations }: DebugViewProps) {
    const [state, setState] = useState<DebugViewState>({
        currentTransformation: 0,
        pageNr: -1,
        modificationsOnly: false,
        showStatistics: false
    });

    const selectPage = (pageNr: number) => {
        setState(prev => ({ ...prev, pageNr: pageNr - 1 }));
    };

    const selectTransformation = (currentTransformation: number) => {
        setState(prev => ({ ...prev, currentTransformation }));
    };

    const nextTransformation = () => {
        setState(prev => ({ ...prev, currentTransformation: prev.currentTransformation + 1 }));
    };

    const prevTransformation = () => {
        setState(prev => ({ ...prev, currentTransformation: prev.currentTransformation - 1 }));
    };

    const showModifications = () => {
        setState(prev => ({ ...prev, modificationsOnly: !prev.modificationsOnly }));
    };

    const showStatistics = () => {
        setState(prev => ({ ...prev, showStatistics: !prev.showStatistics }));
    };

    const { currentTransformation, pageNr } = state;
    const currentTransformationName = transformations[currentTransformation]!.name;

    let parseResult = new ParseResult({
        pages
    });
    let lastTransformation: Transformation | undefined;
    for (let i = 0; i <= currentTransformation; i++) {
        if (lastTransformation) {
            parseResult = lastTransformation.completeTransform(parseResult);
        }
        parseResult = transformations[i]!.transform(parseResult);
        lastTransformation = transformations[i]!;
    }

    parseResult.pages = parseResult.pages.filter((_elem: any, i: number) => pageNr === -1 || i === pageNr);
    const pageComponents = parseResult.pages.map((page: any) =>
        lastTransformation!.createPageView(page, state.modificationsOnly)
    );
    const showModificationCheckbox = lastTransformation!.showModificationCheckbox();
    const statisticsAsList = Object.keys(parseResult.globals).map((key: string, i: number) => {
        return (
            <li key={i}>{key + ': ' + JSON.stringify(parseResult.globals[key])}</li>
        );
    });
    const messagesAsList = parseResult.messages.map((message: string, i: number) => {
        return <li key={i}>{message}</li>;
    });

    const transformationMenuItems: Array<{ type: string; key: string | number; eventKey?: number; onSelect?: () => void; name?: string }> = [];
    let lastItemType: string | undefined;
    transformations.forEach((transformation, i) => {
        if (lastItemType && transformation.itemType !== lastItemType) {
            transformationMenuItems.push({ type: 'divider', key: `${i}-divider` });
        }
        transformationMenuItems.push({
            type: 'item',
            key: i,
            eventKey: i,
            onSelect: () => selectTransformation(i),
            name: transformation.name
        });
        lastItemType = transformation.itemType;
    });

    return (
        <div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>
                                    <ul className="pagination">
                                        <li className={pageNr === -1 ? 'active' : ''}>
                                            <a role="button" onClick={() => selectPage(0)}>
                                                ALL
                                            </a>
                                        </li>
                                    </ul>
                                    <Pagination>
                                        <Pagination.First onClick={() => selectPage(1)} />
                                        <Pagination.Prev onClick={() => selectPage(Math.max(1, state.pageNr))} />
                                        {Array.from({ length: pages.length }, (_, i) => (
                                            <Pagination.Item
                                                key={i + 1}
                                                active={state.pageNr === i}
                                                onClick={() => selectPage(i + 1)}
                                            >
                                                {i + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => selectPage(Math.min(pages.length, state.pageNr + 2))} />
                                        <Pagination.Last onClick={() => selectPage(pages.length)} />
                                    </Pagination>
                                </div>
                            </td>
                            <td style={{ padding: '5px', textAlign: 'left' }}>
                                <Badge bg="info">Pages</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div role="group">
                                        <Button
                                            className={currentTransformation > 0 ? 'btn-round' : 'btn-round disabled'}
                                            onClick={prevTransformation}
                                        >
                                            ← Previous
                                        </Button>
                                    </div>
                                    <div role="group">
                                        {' '}
                                        <Button
                                            className={
                                                currentTransformation < transformations.length - 1
                                                    ? 'btn-round'
                                                    : 'btn-round disabled'
                                            }
                                            onClick={nextTransformation}
                                        >
                                            Next →
                                        </Button>
                                    </div>
                                    <div role="group">
                                        <Dropdown>
                                            <Dropdown.Toggle id="dropdown-size-medium">
                                                {currentTransformationName}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {transformationMenuItems.map(item => {
                                                    if (item.type === 'divider') {
                                                        return <Dropdown.Divider key={item.key} />;
                                                    }
                                                    return (
                                                        <Dropdown.Item
                                                            key={item.key}
                                                            eventKey={item.eventKey}
                                                            onSelect={item.onSelect}
                                                        >
                                                            {item.name}
                                                        </Dropdown.Item>
                                                    );
                                                })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div>
                                        {showModificationCheckbox && (
                                            <Form.Check label="Show only modifications" onChange={showModifications} />
                                        )}
                                    </div>
                                    <div>
                                        <Form.Check label="Show Statistics" onChange={showStatistics} />
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '5px' }}>
                                <Badge bg="info">
                                    Transformations - {currentTransformation} / {transformations.length - 1}
                                </Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Collapse in={state.showStatistics}>
                                    <Card>
                                        <ul>{statisticsAsList}</ul>
                                    </Card>
                                </Collapse>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {!state.showStatistics && <hr style={{ marginTop: '5px' }} />}
            <ul>{messagesAsList}</ul>
            {pageComponents}
        </div>
    );
}

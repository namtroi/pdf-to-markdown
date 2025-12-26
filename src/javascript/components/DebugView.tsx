import { useState } from 'react';
import { Menu, Disclosure } from '@headlessui/react';

import { ParseResult } from '../models/ParseResult';
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
    const statisticsAsList = parseResult.globals ? Object.keys(parseResult.globals).map((key: string, i: number) => {
        return (
            <li key={i}>{key + ': ' + JSON.stringify(parseResult.globals![key])}</li>
        );
    }) : [];
    const messagesAsList = parseResult.messages?.map((message: string, i: number) => {
        return <li key={i}>{message}</li>;
    }) || [];

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
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td>
                                <div>
                                    <ul className="flex list-none gap-2 mb-2">
                                        <li>
                                            <button
                                                onClick={() => selectPage(0)}
                                                className={pageNr === -1 ? 'px-3 py-1 bg-blue-500 text-white rounded' : 'px-3 py-1 border border-gray-300 rounded hover:bg-gray-100'}
                                            >
                                                ALL
                                            </button>
                                        </li>
                                    </ul>

                                    {/* Pagination */}
                                    <div className="flex gap-2 mb-2">
                                        <button onClick={() => selectPage(1)} className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">
                                            First
                                        </button>
                                        <button onClick={() => selectPage(Math.max(1, state.pageNr))} className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">
                                            ← Prev
                                        </button>
                                        {Array.from({ length: pages.length }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => selectPage(i + 1)}
                                                className={state.pageNr === i ? 'px-2 py-1 bg-blue-500 text-white rounded' : 'px-2 py-1 border border-gray-300 rounded hover:bg-gray-100'}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button onClick={() => selectPage(Math.min(pages.length, state.pageNr + 2))} className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">
                                            Next →
                                        </button>
                                        <button onClick={() => selectPage(pages.length)} className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">
                                            Last
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-1 py-1 text-left">
                                <span className="bg-cyan-500 text-white px-2 py-1 text-xs rounded">Pages</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="flex gap-2 flex-wrap items-center py-2">
                                    <div>
                                        <button
                                            className={currentTransformation > 0 ? 'btn-round bg-blue-500 hover:bg-blue-600 text-white' : 'btn-round bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'}
                                            onClick={prevTransformation}
                                            disabled={currentTransformation <= 0}
                                        >
                                            ← Previous
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className={
                                                currentTransformation < transformations.length - 1
                                                    ? 'btn-round bg-blue-500 hover:bg-blue-600 text-white'
                                                    : 'btn-round bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                            }
                                            onClick={nextTransformation}
                                            disabled={currentTransformation >= transformations.length - 1}
                                        >
                                            Next →
                                        </button>
                                    </div>

                                    {/* Transformation Dropdown */}
                                    <div>
                                        <Menu as="div" className="relative">
                                            <Menu.Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                                                {currentTransformationName}
                                            </Menu.Button>
                                            <Menu.Items className="absolute left-0 top-full mt-1 w-64 rounded bg-white text-gray-900 shadow-lg z-50 max-h-60 overflow-y-auto focus:outline-none">
                                                {transformationMenuItems.map(item => {
                                                    if (item.type === 'divider') {
                                                        return <hr key={item.key} className="border-gray-200" />;
                                                    }
                                                    return (
                                                        <Menu.Item key={item.key} as="button" onClick={item.onSelect} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                                                            {item.name}
                                                        </Menu.Item>
                                                    );
                                                })}
                                            </Menu.Items>
                                        </Menu>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="flex gap-4">
                                        {showModificationCheckbox && (
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={state.modificationsOnly}
                                                    onChange={showModifications}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">Show only modifications</span>
                                            </label>
                                        )}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={state.showStatistics}
                                                onChange={showStatistics}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">Show Statistics</span>
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td className="px-1 py-1">
                                <span className="bg-cyan-500 text-white px-2 py-1 text-xs rounded">
                                    Transformations - {currentTransformation} / {transformations.length - 1}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {/* Disclosure for Statistics */}
                                <Disclosure>
                                    {state.showStatistics && (
                                        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                            <ul>{statisticsAsList}</ul>
                                        </div>
                                    )}
                                </Disclosure>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {!state.showStatistics && <hr className="my-2" />}
            <ul>{messagesAsList}</ul>
            {pageComponents}
        </div>
    );
}

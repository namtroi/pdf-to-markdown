import { useState } from 'react';
import { Menu } from '@headlessui/react';

import AppLogo from './AppLogo';
import { View } from '../models/AppState';

interface TopBarProps {
    mainView: View;
    switchMainViewFunction: (view: View) => void;
    title: string;
}

export default function TopBar({ mainView, switchMainViewFunction, title }: TopBarProps) {
    const [showAbout, setShowAbout] = useState(false);

    const showTabs = mainView === View.RESULT || mainView === View.DEBUG;

    return (
        <nav className="bg-slate-800 text-white px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Left: Logo Dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="cursor-pointer focus:outline-none">
                        <AppLogo onClick={() => {}} />
                    </Menu.Button>
                    <Menu.Items className="absolute left-0 top-full mt-1 w-48 rounded bg-white text-gray-900 shadow-lg z-50 focus:outline-none">
                        <Menu.Item>
                            <hr className="border-gray-200" />
                        </Menu.Item>
                        <Menu.Item as="a" href="https://github.com/jzillmann/pdf-to-markdown/issues" target="_blank" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                            Feedback & Bug Reports
                        </Menu.Item>
                        <Menu.Item as="a" href="http://github.com/jzillmann/pdf-to-markdown" target="_blank" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                            Code @Github
                        </Menu.Item>
                        <Menu.Item>
                            <hr className="border-gray-200" />
                        </Menu.Item>
                        <Menu.Item as="button" onClick={() => setShowAbout(!showAbout)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            About
                        </Menu.Item>
                    </Menu.Items>
                </Menu>

                {/* Center: Tabs */}
                {showTabs && (
                    <div className="flex gap-6 ml-auto">
                        <button
                            onClick={() => switchMainViewFunction(View.DEBUG)}
                            className={mainView === View.DEBUG ? 'border-b-2 border-blue-400 pb-2 font-semibold' : 'text-gray-300 hover:text-white pb-2'}
                        >
                            Debug View
                        </button>
                        <button
                            onClick={() => switchMainViewFunction(View.RESULT)}
                            className={mainView === View.RESULT ? 'border-b-2 border-blue-400 pb-2 font-semibold' : 'text-gray-300 hover:text-white pb-2'}
                        >
                            Result View
                        </button>
                    </div>
                )}

                {/* Right: Title */}
                <div className="ml-auto text-right">
                    <span className="text-sm">{title}</span>
                </div>
            </div>

            {/* About Popover */}
            {showAbout && (
                <div className="absolute top-full left-0 mt-2 bg-white text-gray-900 rounded shadow-lg p-4 w-96 z-50">
                    <h3 className="font-semibold mb-2">About PDF to Markdown Converter - {__APP_VERSION__}</h3>
                    <p className="text-sm">
                        <i>PDF to Markdown Converter</i> will convert your uploaded PDF to Markdown
                        format.
                    </p>
                </div>
            )}
        </nav>
    );
}

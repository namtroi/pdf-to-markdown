import { memo } from 'react';
import { Menu } from '@headlessui/react';
import { FaGithub, FaInfoCircle, FaBug, FaBars } from 'react-icons/fa';

import { View } from '../models/AppState';

interface TopBarProps {
    mainView: View;
    switchMainViewFunction: (view: View) => void;
}

function TopBar({ mainView, switchMainViewFunction }: TopBarProps) {
    const showTabs = mainView === View.RESULT || mainView === View.DEBUG;

    return (
        <nav className="backdrop-blur-md bg-white/80 border-b border-slate-200 sticky top-0 z-50 px-4 h-14">
            <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center">
                <span className="font-bold text-slate-800 text-lg tracking-tight">PDF To Markdown</span>
            </div>

            {/* Center: Tabs (Modern Pills) */}
            {showTabs && (
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => switchMainViewFunction(View.RESULT)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            mainView === View.RESULT 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => switchMainViewFunction(View.DEBUG)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            mainView === View.DEBUG 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Debugger
                    </button>
                </div>
            )}

            {/* Right */}
            <div className="flex items-center gap-2">
                <a 
                    href="https://github.com/namtroi/pdf-to-markdown"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
                    title="View on GitHub"
                >
                    <FaGithub className="text-lg" />
                </a>

                <Menu as="div" className="relative">
                    <Menu.Button className="p-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100 focus:outline-none">
                        <FaBars className="text-lg" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white text-slate-700 shadow-2xl ring-1 ring-black/5 z-50 focus:outline-none p-1">
                        <Menu.Item as="a" href="https://github.com/namtroi/pdf-to-markdown/issues" target="_blank" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-lg text-sm">
                            <FaBug className="text-slate-400" />
                            Report a Bug
                        </Menu.Item>
                        <Menu.Item as="div" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-lg text-sm cursor-pointer">
                            <FaInfoCircle className="text-slate-400" />
                            About v{__APP_VERSION__}
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
            </div>
        </nav>
    );
}

export default memo(TopBar);

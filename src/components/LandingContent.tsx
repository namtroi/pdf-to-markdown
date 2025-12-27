import { FaBolt, FaLock, FaRobot, FaFileCode, FaCheck, FaTimes } from 'react-icons/fa';

export default function LandingContent() {
    return (
        <div className="w-full max-w-5xl mx-auto mt-16 pb-16 px-4">
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                        <FaBolt className="text-xl" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-2">Lightning Fast Parsing</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Powered by WebAssembly and the latest PDF.js engine. Process large documents instantly in your browser without any server latency.
                    </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
                        <FaLock className="text-xl" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-2">100% Private & Secure</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Your files never leave your device. All processing happens client-side, ensuring confidential data remains strictly local.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                        <FaRobot className="text-xl" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-2">RAG-Ready Output</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Optimized for LLMs. Clean structure, headers, and tables are preserved, making it perfect for AI data ingestion pipelines.
                    </p>
                </div>
            </div>

            {/* How It Works */}
            <div className="mb-24 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-12">How It Works</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-liner-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10"></div>

                    <div className="w-64 flex flex-col items-center relative bg-slate-100/50 p-4 rounded-xl">
                        <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-6 border-4 border-indigo-50 text-indigo-500 font-bold text-2xl">
                            1
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-2">Upload PDF</h4>
                        <p className="text-slate-500 text-sm">Drag & drop any PDF document. No size limits.</p>
                    </div>

                    <div className="w-64 flex flex-col items-center relative bg-slate-100/50 p-4 rounded-xl">
                        <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-6 border-4 border-indigo-50 text-indigo-500 font-bold text-2xl">
                            2
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-2">Smart Analysis</h4>
                        <p className="text-slate-500 text-sm">Engine detects headers, lists, code blocks, and tables.</p>
                    </div>

                    <div className="w-64 flex flex-col items-center relative bg-slate-100/50 p-4 rounded-xl">
                        <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-6 border-4 border-indigo-50 text-indigo-500 font-bold text-2xl">
                            3
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-2">Get Markdown</h4>
                        <p className="text-slate-500 text-sm">Copy clean Markdown or download the file instantly.</p>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-8 text-center border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white mb-2">Why Structure Matters?</h2>
                    <p className="text-slate-400">Raw text extraction vs. Our Structural Engine</p>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    
                    {/* Bad Side */}
                    <div className="p-8 bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                <FaTimes />
                            </div>
                            <h3 className="text-red-400 font-semibold">Standard Tools</h3>
                        </div>
                        <div className="font-mono text-sm text-slate-500 space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800/50">
                            <p>Introduction</p>
                            <p>This is a header but looks like text.</p>
                            <p>1. List item one</p>
                            <p>2. List item two</p>
                            <p>Code example function() broken...</p>
                        </div>
                        <p className="mt-4 text-xs text-slate-600">
                            ❌ Lost hierarchy<br/>
                            ❌ Broken code blocks<br/>
                            ❌ Hard for LLMs to parse
                        </p>
                    </div>

                    {/* Good Side */}
                    <div className="p-8 bg-slate-800/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <FaCheck />
                            </div>
                            <h3 className="text-emerald-400 font-semibold">PDF To Markdown</h3>
                        </div>
                        <div className="font-mono text-sm text-slate-300 space-y-2 bg-slate-950 p-4 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <p className="text-purple-400"># Introduction</p>
                            <p className="text-slate-400">This is a header but looks like text.</p>
                            <p className="text-yellow-400">- List item one</p>
                            <p className="text-yellow-400">- List item two</p>
                            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-xs">
                                <p className="text-blue-400">```javascript</p>
                                <p className="pl-2">function() {"{"} ...</p>
                                <p className="text-blue-400">```</p>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-emerald-600">
                            ✅ Semantic Headers (H1-H6)<br/>
                            ✅ Clean Lists & Tables<br/>
                            ✅ Preserved Code Blocks
                        </p>
                    </div>

                </div>
            </div>

            <div className="mt-20 text-center border-t border-slate-200 pt-10">
                <p className="text-slate-400 text-sm">
                    Open Source project by <a href="https://github.com/namtroi" target="_blank" className="text-indigo-600 hover:text-indigo-800 font-medium">@namtroi</a>. 
                    <a href="https://github.com/namtroi/pdf-to-markdown" target="_blank" className="ml-2 flex flex-col md:inline-flex items-center gap-1 hover:text-slate-600 transition-colors">
                        <FaFileCode className="inline" /> View Source
                    </a>
                </p>
            </div>
        </div>
    );
}

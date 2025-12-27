import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import LandingContent from './LandingContent';

interface UploadViewProps {
    uploadPdfFunction: (buffer: Uint8Array) => void;
}

export default function UploadView({ uploadPdfFunction }: UploadViewProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 1) {
                alert(`Maximum one file allowed to upload, but not ${acceptedFiles.length}!`);
                return;
            }
            if (acceptedFiles.length === 0) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (evt: ProgressEvent<FileReader>) => {
                const fileBuffer = evt.target?.result as ArrayBuffer;
                uploadPdfFunction(new Uint8Array(fileBuffer));
            };
            reader.readAsArrayBuffer(acceptedFiles[0]!);
        },
        [uploadPdfFunction],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
        },
    });

    return (
        <div className="flex flex-col items-center w-full min-h-full">
            <div className="flex items-center justify-center w-full py-20 px-4">
                <div 
                    {...getRootProps()}
                    className={`
                        w-full max-w-2xl 
                        backdrop-blur-md bg-white/70 
                        border-2 border-dashed rounded-2xl 
                        flex flex-col items-center justify-center 
                        p-16 transition-all duration-300 cursor-pointer shadow-xl
                        ${isDragActive ? 'border-indigo-500 bg-indigo-50/80 scale-[1.02]' : 'border-slate-300 hover:border-indigo-400 hover:bg-white/90'}
                    `}
                >
                    <input {...getInputProps()} />
                    
                    <div className={`p-6 rounded-full bg-indigo-50 mb-6 transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                        {isDragActive ? <FaFilePdf className="text-indigo-600 text-5xl" /> : <FaCloudUploadAlt className="text-indigo-600 text-5xl" />}
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-800 mb-2 text-center">
                        {isDragActive ? 'Drop your PDF here' : 'Drop your PDF here'}
                    </h2>
                    
                    <p className="text-slate-500 mb-8 text-center max-w-md">
                        Drag and drop your file, or click to browse.
                    </p>

                    <div className="px-6 py-2 rounded-full border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors">
                        Browse Files
                    </div>

                    <div className="mt-12 text-center max-w-lg">
                        <p className="text-xs text-slate-400">
                            This tool analyzes the structure of your PDF (Headers, Lists, TOC) and converts it to clean Markdown.
                            Perfect for migrating documentation or extracting content.
                        </p>
                    </div>
                </div>
            </div>

            <LandingContent />
        </div>
    );
}

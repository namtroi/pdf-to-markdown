import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Alert } from 'react-bootstrap';
import { FaCloud } from 'react-icons/fa';

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

    const dropzoneStyle = {
        width: 400,
        height: 500,
        borderWidth: 2,
        borderColor: isDragActive ? '#4CAF50' : '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
        display: 'table-cell',
        textAlign: 'center' as const,
        verticalAlign: 'middle' as const,
        cursor: 'pointer',
        transition: 'border-color 0.3s',
    };

    return (
        <div>
            <div {...getRootProps({ style: dropzoneStyle })}>
                <input {...getInputProps()} />
                <div className="container">
                    <h2>Drop your PDF file here!</h2>
                </div>
                <h1>
                    <FaCloud width={100} height={100} />
                </h1>
                <br />
                <Alert variant="warning">
                    <i>
                        This tool converts a PDF file into a Markdown text format! Simply drag &
                        drop your PDF file on the upload area and go from there. Don't expect
                        wonders, there are a lot of variances in generated PDF's from different
                        tools and different ages. No matter how good the parser works for your
                        PDF, you will have to invest a good amount of manual work to complete it.
                        Though this tool aims to be general purpose, it has been tested on a
                        certain set of PDF's only.
                    </i>
                </Alert>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}

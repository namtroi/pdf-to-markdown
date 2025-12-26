interface FooterBarProps {}

export default function FooterBar(_props: FooterBarProps) {
    return (
        <nav className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <span className="text-gray-700">
                    This is a offline tool, your data stays locally and is not send to any server!
                </span>
                <a
                    href="https://github.com/jzillmann/pdf-to-markdown/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                >
                    Feedback & Bug Reports
                </a>
            </div>
        </nav>
    );
}

import { FaFilePdf } from 'react-icons/fa';

interface AppLogoProps {
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function AppLogo({ onClick }: AppLogoProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onClick(e);
    };

    return (
        <a href="" onClick={handleClick}>
            <FaFilePdf /> PDF To Markdown Converter
        </a>
    );
}

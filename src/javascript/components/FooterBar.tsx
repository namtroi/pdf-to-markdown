import { Navbar } from 'react-bootstrap';

interface FooterBarProps {}

export default function FooterBar(_props: FooterBarProps) {
    return (
        <Navbar>
            <Navbar.Text>
                This is a offline tool, your data stays locally and is not send to any server!
            </Navbar.Text>
            <Navbar.Text className="ms-auto">
                <a href="https://github.com/jzillmann/pdf-to-markdown/issues" target="_blank" rel="noopener noreferrer">Feedback & Bug Reports</a>
            </Navbar.Text>
        </Navbar>
    );
}

import { Navbar, Nav, Dropdown, Popover, OverlayTrigger } from 'react-bootstrap';

import AppLogo from './AppLogo';
import { View } from '../models/AppState';

interface TopBarProps {
    mainView: View;
    switchMainViewFunction: (view: View) => void;
    title: string;
}

export default function TopBar({ mainView, switchMainViewFunction, title }: TopBarProps) {
    const aboutPopover = (
        <Popover id="popover-trigger-click-root-close" title={`About PDF to Markdown Converter - ${import.meta.env.VITE_APP_VERSION || 'unknown'}`}>
            <p>
                <i>PDF to Markdown Converter</i> will convert your uploaded PDF to Markdown
                format.
            </p>
        </Popover>
    );

    const showTabs = mainView === View.RESULT || mainView === View.DEBUG;

    return (
        <Navbar bg="dark">
            <Navbar.Brand>
                <Dropdown id="logo-dropdown">
                    <Dropdown.Toggle as="span" bsPrefix="">
                        <AppLogo onClick={() => {}} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            href="https://github.com/jzillmann/pdf-to-markdown/issues"
                            target="_blank"
                        >
                            {' '}
                            Feedback & Bug Reports
                        </Dropdown.Item>
                        <Dropdown.Item href="http://github.com/jzillmann/pdf-to-markdown" target="_blank">
                            {' '}
                            Code @Github
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <OverlayTrigger
                            trigger="click"
                            rootClose
                            placement="bottom"
                            overlay={aboutPopover}
                        >
                            <Dropdown.Item> About</Dropdown.Item>
                        </OverlayTrigger>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar.Brand>
            {showTabs && (
                <Nav variant="tabs" activeKey={mainView} className="ms-auto">
                    <Nav.Link eventKey={View.DEBUG} onSelect={() => switchMainViewFunction(View.DEBUG)}>
                        Debug View
                    </Nav.Link>
                    <Nav.Link eventKey={View.RESULT} onSelect={() => switchMainViewFunction(View.RESULT)}>
                        Result View
                    </Nav.Link>
                </Nav>
            )}
            <Navbar.Text className="ms-auto">{title}</Navbar.Text>
        </Navbar>
    );
}

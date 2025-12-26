import React from 'react';

import { Navbar, Nav, Dropdown, Popover, OverlayTrigger } from 'react-bootstrap';

import AppLogo from './AppLogo.jsx';
import { View } from '../models/AppState';

export default class TopBar extends React.Component {

    static propTypes = {
        mainView: React.PropTypes.object.isRequired,
        switchMainViewFunction: React.PropTypes.func.isRequired,
        title: React.PropTypes.string.isRequired,
    };

    render() {
        const {mainView, switchMainViewFunction, title} = this.props;
        const aboutPopover = (
        <Popover id="popover-trigger-click-root-close" title={ `About PDF to Markdown Converter - ${ process.env.version }` }>
          <p>
            <i>PDF to Markdown Converter</i> will convert your uploaded PDF to Markdown format.
          </p>
        </Popover>
        );

        const showTabs = mainView == View.RESULT || mainView == View.DEBUG;

        return (
            <Navbar bg="dark">
              <Navbar.Brand>
                <Dropdown id="logo-dropdown">
                  <Dropdown.Toggle as="span" bsPrefix="">
                    <AppLogo />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Divider />
                    <Dropdown.Item href="https://github.com/jzillmann/pdf-to-markdown/issues" target="_blank"> Feedback & Bug Reports
                    </Dropdown.Item>
                    <Dropdown.Item href="http://github.com/jzillmann/pdf-to-markdown" target="_blank"> Code @Github
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <OverlayTrigger
                                    trigger="click"
                                    rootClose
                                    placement="bottom"
                                    overlay={ aboutPopover }>
                      <Dropdown.Item> About
                      </Dropdown.Item>
                    </OverlayTrigger>
                  </Dropdown.Menu>
                </Dropdown>
              </Navbar.Brand>
              { showTabs &&
                <Nav variant="tabs" activeKey={ mainView } className="ms-auto">
                  <Nav.Link eventKey={ View.DEBUG } onSelect={ switchMainViewFunction }>
                    Debug View
                  </Nav.Link>
                  <Nav.Link eventKey={ View.RESULT } onSelect={ switchMainViewFunction }>
                    Result View
                  </Nav.Link>
                </Nav> }
              <Navbar.Text className="ms-auto">
                { title }
              </Navbar.Text>
            </Navbar>
        );
    }

}
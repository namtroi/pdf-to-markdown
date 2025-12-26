import React from 'react';

import { Button, Badge, Form, Collapse, Card, Dropdown, Pagination } from 'react-bootstrap'

import ParseResult from '../models/ParseResult.jsx';

// A view which displays the content of the given pages transformed by the given transformations
export default class DebugView extends React.Component {

    static propTypes = {
        pages: React.PropTypes.array.isRequired,
        transformations: React.PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentTransformation: 0,
            pageNr: -1,
            modificationsOnly: false,
            showStatistics: false
        };
    }

    selectPage(pageNr) {
        this.setState({
            pageNr: pageNr - 1
        });
    }

    selectTransformation(currentTransformation) {
        this.setState({
            currentTransformation: currentTransformation
        });
    }

    nextTransformation() {
        this.setState({
            currentTransformation: this.state.currentTransformation + 1
        });
    }

    prevTransformation() {
        this.setState({
            currentTransformation: this.state.currentTransformation - 1
        });
    }

    showModifications() {
        this.setState({
            modificationsOnly: !this.state.modificationsOnly
        });
    }

    showStatistics() {
        this.setState({
            showStatistics: !this.state.showStatistics
        });

    }


    render() {
        const {currentTransformation, pageNr} = this.state;
        const {pages, transformations} = this.props;

        const currentTransformationName = transformations[currentTransformation].name;

        var parseResult = new ParseResult({
            pages: pages
        });
        var lastTransformation;
        for (var i = 0; i <= currentTransformation; i++) {
            if (lastTransformation) {
                parseResult = lastTransformation.completeTransform(parseResult);
            }
            parseResult = transformations[i].transform(parseResult);
            lastTransformation = transformations[i];
        }

        parseResult.pages = parseResult.pages.filter((elem, i) => pageNr == -1 || i == pageNr);
        const pageComponents = parseResult.pages.map(page => lastTransformation.createPageView(page, this.state.modificationsOnly));
        const showModificationCheckbox = lastTransformation.showModificationCheckbox();
        const statisticsAsList = Object.keys(parseResult.globals).map((key, i) => {
            return <li key={ i }>
                     { key + ': ' + JSON.stringify(parseResult.globals[key]) }
                   </li>
        });
        const messagesAsList = parseResult.messages.map((message, i) => {
            return <li key={ i }>
                     { message }
                   </li>
        });

        const transformationMenuItems = [];
        var lastItemType;
        transformations.forEach((transformation, i) => {
            if (lastItemType && transformation.itemType !== lastItemType) {
                transformationMenuItems.push({ type: 'divider', key: i + '-divider' });
            }
            transformationMenuItems.push({
              type: 'item',
              key: i,
              eventKey: i,
              onSelect: this.selectTransformation.bind(this, i),
              name: transformation.name
            });
            lastItemType = transformation.itemType;
        });

        return (
            <div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div>
                          <ul className='pagination'>
                            <li className={ pageNr == -1 ? 'active' : '' }>
                              <a role='button' onClick={ this.selectPage.bind(this, 0) }>ALL</a>
                            </li>
                          </ul>
                          <Pagination
                                      prev
                                      next
                                      first
                                      last
                                      ellipsis
                                      boundaryLinks
                                      items={ pages.length }
                                      maxButtons={ 17 }
                                      activePage={ this.state.pageNr + 1 }
                                      onSelect={ this.selectPage.bind(this) } />
                        </div>
                      </td>
                      <td style={ { padding: '5px', textAlign: 'left' } }>
                        <Badge bg="info">
                          Pages
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <div role="group">
                            <Button className={ currentTransformation > 0 ? 'btn-round' : 'btn-round disabled' } onClick={ this.prevTransformation.bind(this) }>
                              ← Previous
                            </Button>
                          </div>
                          <div role="group">
                            { ' ' }
                            <Button className={ currentTransformation < transformations.length - 1 ? 'btn-round' : 'btn-round disabled' } onClick={ this.nextTransformation.bind(this) }>
                              Next →
                            </Button>
                          </div>
                          <div role="group">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-size-medium">
                                { currentTransformationName }
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                { transformationMenuItems.map((item) => {
                                  if (item.type === 'divider') {
                                    return <Dropdown.Divider key={item.key} />;
                                  }
                                  return <Dropdown.Item key={item.key} eventKey={item.eventKey} onSelect={item.onSelect}>
                                    {item.name}
                                  </Dropdown.Item>;
                                }) }
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          <div>
                            { showModificationCheckbox &&
                              <Form.Check label="Show only modifications" onChange={ this.showModifications.bind(this) } /> }
                          </div>
                          <div>
                            <Form.Check label="Show Statistics" onChange={() => this.showStatistics()} />
                          </div>
                        </div>
                      </td>
                      <td style={ { padding: '5px' } }>
                        <Badge bg="info">
                          Transformations
                          { ' - ' + currentTransformation + ' / ' + (transformations.length - 1) }
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Collapse in={ this.state.showStatistics }>
                          <Card>
                            <ul>
                              { statisticsAsList }
                            </ul>
                          </Card>
                        </Collapse>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              { !this.state.showStatistics &&
                <hr style={ { marginTop: '5px' } } /> }
              <ul>
                { messagesAsList }
              </ul>
              { pageComponents }
            </div>
        );
    }
}
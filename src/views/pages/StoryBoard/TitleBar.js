import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from 'reactstrap';
import moment from 'moment';

class TitleBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            projects: false
        }

        this.handleChange = this.handleChange.bind(this);

        this.toggle = this.toggle.bind(this);
    }

    handleChange(e) {
        let node = this.state.story;
        let name = e.target.getAttribute('name');
        let value = e.target.value;
        
        node.extras[name] = value;
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        let saved = (this.props.saved ? "" : "*") + (this.props.last_save ? " Last saved " + moment(this.props.last_save).format('MMM Do, h:mm a') : "");

        return (
            <div className="TitleBar">
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="main-menu-btn-group">
                    <DropdownToggle caret className="main-menu-btn">
                      Project
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.props.onSave}>Save</DropdownItem>
                        <UncontrolledDropdown direction="right" isOpen={this.state.projects} toggle={() => { this.props.onLoad(); this.setState({ projects : !this.state.projects }); }}>
                            <DropdownToggle tag="button" caret className="dropdown-item load-btn">
                                Load
                            </DropdownToggle>
                            <DropdownMenu className="projects-menu">
                                {Array.isArray(this.props.diagrams) ? this.props.diagrams.map(diagram => {
                                    return <DropdownItem key={diagram.id} onClick={() => this.props.onLoadId(diagram.id)}>{diagram.title ? diagram.title : diagram.id}</DropdownItem>;
                                }) : null }
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        {
                            this.props.admin ? 
                            <div>
                                <DropdownItem onClick={this.props.onTest}>Test</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={this.props.onPublish}>Publish</DropdownItem>
                            </div>
                            : null
                        }
                    </DropdownMenu>
                </ButtonDropdown>
                <input
                    name="story"
                    onChange={this.props.onUpdateTitle}
                    value={this.props.title}
                    placeholder="Story Title"
                />
                <div className="status">
                    {this.props.saving ?
                        <div><i className="fas fa-sync-alt fa-spin"></i> {"Saving..."}</div>
                        :
                        (saved)
                    }
                </div>
            </div>
        );
    }
}

export default TitleBar;

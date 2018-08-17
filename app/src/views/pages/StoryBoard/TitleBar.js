import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class TitleBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            story: this.props.story,
            dropdownOpen: false
        }

        this.handleChange = this.handleChange.bind(this);

        this.toggle = this.toggle.bind(this);
    }

    handleChange(e) {
        let node = this.state.story;
        let name = e.target.getAttribute('name');
        let value = e.target.value;
        
        node.extras[name] = value;
        
        this.setState({
            story: node
        }, this.props.onUpdate);
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
            <div className="TitleBar">
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                      Project
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Save</DropdownItem>
                      <DropdownItem>Load</DropdownItem>
                      <DropdownItem disabled>Test</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>Publish</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
                <input
                    name="story"
                    onChange={this.handleTitleChange}
                    value={this.state.title}
                    placeholder="Story Title"
                />
            </div>
        );
    }
}

export default TitleBar;

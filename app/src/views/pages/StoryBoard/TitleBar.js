import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from 'reactstrap';
import moment from 'moment';
import axios from 'axios'

class TitleBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            projects: false,
            publish: false,
            worlds_open: false,
            diagrams: [],
            worlds: []
        }

        this.handleChange = this.handleChange.bind(this);

        this.toggle = this.toggle.bind(this);
        this.onLoadWorlds = this.onLoadWorlds.bind(this);
        this.onLoad = this.onLoad.bind(this);

        this.onLoad();
        this.onLoadWorlds();
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

    onLoad() {
        axios.get('/diagrams')
        .then(res => {
            this.setState({
                diagrams: res.data
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    onLoadWorlds() {
        axios.get('/worlds')
        .then(res => {
            this.setState({
                worlds: res.data
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    render() {
        let saved = (this.props.saved ? "" : "*") + (this.props.last_save ? " Last saved " + moment(this.props.last_save).format('MMM Do, h:mm a') : "");
        // <DropdownItem onClick={()=>{}}>Submit for Review</DropdownItem>
        return (
            <div className="TitleBar">
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="main-menu-btn-group">
                    <DropdownToggle caret className="main-menu-btn">
                      Project
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.props.onSave}>Save</DropdownItem>
                        <UncontrolledDropdown direction="right" isOpen={this.state.projects} toggle={() => { this.setState({ projects : !this.state.projects }); }}>
                            <DropdownToggle tag="button" caret className="dropdown-item load-btn">
                                Load
                            </DropdownToggle>
                            <DropdownMenu className="projects-menu">
                                { this.state.diagrams.length !== 0 ? this.state.diagrams.map(diagram => {
                                    return <DropdownItem key={diagram.id} onClick={() => {this.props.onLoadId(diagram.id); this.setState({ dropdownOpen : false })}}>{diagram.title ? diagram.title : diagram.id}</DropdownItem>;
                                }) : <DropdownItem disabled>No Diagrams Saved</DropdownItem> }
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <DropdownItem onClick={this.props.onTest}>Test&nbsp;&nbsp;<i className="fas fa-flask"></i></DropdownItem>
                        <DropdownItem divider />
                        {
                            this.props.admin ? 
                            <div>
                                <DropdownItem onClick={this.props.onLoadLines}>Update User Flow</DropdownItem>
                                <UncontrolledDropdown direction="right" isOpen={this.state.publish} toggle={() => { this.setState({ publish : !this.state.publish }); }}>
                                    <DropdownToggle tag="button" caret className="dropdown-item load-btn">
                                        Publish
                                    </DropdownToggle>
                                    <DropdownMenu className="projects-menu">
                                        <DropdownItem onClick={()=>{this.props.onPublish("staging");this.setState({dropdownOpen : false})}}>Test (Staging)</DropdownItem>
                                        <DropdownItem onClick={()=>{this.props.onPublish("sandbox");this.setState({dropdownOpen : false})}}>Sandbox</DropdownItem>
                                        <DropdownItem onClick={()=>{this.props.onPublish("production");this.setState({dropdownOpen : false})}}>Storyflow</DropdownItem>
                                        <DropdownItem onClick={()=>{this.props.onPublish("kids");this.setState({dropdownOpen : false})}}>Storyflow Kids</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <UncontrolledDropdown direction="right" isOpen={this.state.worlds_open} toggle={() => { this.setState({ worlds_open : !this.state.worlds_open }); }}>
                                    <DropdownToggle tag="button" caret className="dropdown-item load-btn">
                                        Publish to World
                                    </DropdownToggle>
                                    <DropdownMenu className="projects-menu">
                                        { this.state.worlds.length !== 0 ? this.state.worlds.map(world => {
                                            return <DropdownItem key={world.world_id} onClick={() => {this.props.onPublishWorld(world.world_id); this.setState({ dropdownOpen : false })}}>{world.name}</DropdownItem>;
                                        }) : <DropdownItem disabled>No Worlds</DropdownItem> }
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                            : null
                        }
                    </DropdownMenu>
                </ButtonDropdown>
                <input
                    name="story"
                    onChange={this.props.onUpdateTitle}
                    value={this.props.title}
                    placeholder="Project Title"
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

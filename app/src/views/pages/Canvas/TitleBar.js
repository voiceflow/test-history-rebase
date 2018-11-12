import React, { PureComponent } from 'react';
import { Popover, PopoverHeader, PopoverBody, InputGroup, InputGroupAddon, Input, DropdownMenu, DropdownItem, Dropdown, DropdownToggle } from 'reactstrap';
import MUIButton from '@material-ui/core/Button';
import ClipBoard from './../../components/ClipBoard';

class TitleBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            projects: false,
            publish: false,
            diagrams: [],
            share: false,
            platform: 'amazon'
        }

        this.handleChange = this.handleChange.bind(this);

        this.toggle = this.toggle.bind(this);
        this.toggleShare = this.toggleShare.bind(this);
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

    toggleShare() {
        this.setState({
            share: !this.state.share
        });
    }

    render() {
        let link = `https://creator.getstoryflow.com/preview/${this.props.skill.skill_id}/${this.props.diagram_id}`
        
        return (
            <div className="TitleBar no-select">
                {this.props.preview ? null : 
                    <div className="title-group">
                        <div>
                            <MUIButton variant="contained" className="white-btn save-btn mr-2" onClick={this.props.onSave}>{this.props.saving ? <i className="fas fa-sync-alt fa-spin"/> : "Save Draft"}</MUIButton>

                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="d-inline-block mr-2">
                                <DropdownToggle className="anti-btn" tag="div">
                                    <MUIButton variant="contained" className="white-btn share-btn">
                                        Publish
                                    </MUIButton>
                                </DropdownToggle>
                                <DropdownMenu className="platform-dropdown">
                                    <DropdownItem className="platform-btn" onClick={this.props.publishAMZN}>Amazon<span className="button-circle"><i className="fab fa-amazon fa-pull-right"/></span></DropdownItem>
                                    <DropdownItem className="platform-btn" onClick={this.props.publishMarket}>Marketplace<span className="button-circle"><i className="fas fa-store-alt fa-pull-right"/></span></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <MUIButton variant="contained" className="white-btn share-btn" onClick={this.toggleShare} id="share">
                                <i className="fas fa-share-square"/>
                            </MUIButton>
                            <Popover placement="bottom" isOpen={this.state.share} target="share" toggle={this.toggleShare}>
                                <PopoverHeader>Share Link</PopoverHeader>
                                <PopoverBody>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend" id="copyShare">
                                            <ClipBoard 
                                                component="button" 
                                                className="btn btn-secondary" 
                                                value={link}
                                                id="shareLink"
                                            >
                                                <i className="fas fa-copy"/>
                                            </ClipBoard>
                                        </InputGroupAddon>
                                        <Input readOnly value={link}/>
                                    </InputGroup>
                                </PopoverBody>
                            </Popover>
                        </div>
                        <div className="last-save text-muted">{this.props.lastSave}</div>
                    </div>
                }
                <div className="project">
                    <div className="skill-name">
                        {this.props.skill.name}
                    </div>
                    <MUIButton variant="extendedFab" className="white-btn play" onClick={this.props.onTest}><span className="words">Test</span><span className="button-circle"><i className="fas fa-play"/></span></MUIButton>
                </div>
            </div>
        );
    }
}

export default TitleBar;

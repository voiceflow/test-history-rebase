import React, { PureComponent } from 'react';
import { Popover, PopoverHeader, PopoverBody, InputGroup, InputGroupAddon, Input, ButtonGroup, DropdownMenu, DropdownItem, ButtonDropdown, DropdownToggle } from 'reactstrap';
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
                            <ButtonGroup className="mr-2">
                            <MUIButton variant="contained" className="white-btn publish-btn" onClick={ () => {
                                if (this.state.platform === 'amazon') {this.props.publish() }
                                else if (this.state.platform === 'marketplace') {this.props.marketplace()}
                            }}>Publish</MUIButton>
                                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle className="white-btn platform-btn">
                                    { this.state.platform === 'amazon' ? <div>Amazon<span className="button-circle"><i className="fab fa-amazon"/></span><i className="fal fa-angle-down"/></div>: null}
                                    { this.state.platform === 'marketplace' ?  <div>Marketplace<span className="button-circle"><i className="fas fa-store"/></span><i className="fal fa-angle-down"/></div>: null}
                                    </DropdownToggle>
                                        <DropdownMenu className="platform-dropdown">
                                        <DropdownItem className="white-btn platform-btn" onClick={() => {this.setState({platform: 'amazon'})}}>Amazon<span className="button-circle"><i className="fab fa-amazon fa-pull-right"/></span></DropdownItem>
                                        <DropdownItem className="white-btn platform-btn" onClick={() => {this.setState({platform: 'marketplace'})}}>Marketplace<span className="button-circle"><i className="fas fa-store fa-pull-right"/></span></DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </ButtonGroup>

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

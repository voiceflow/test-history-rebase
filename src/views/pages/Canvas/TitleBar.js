import React, { PureComponent } from 'react';
import { Popover, PopoverHeader, PopoverBody, InputGroup, InputGroupAddon, Input, Alert, DropdownMenu, DropdownItem, Dropdown, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import MUIButton from '@material-ui/core/Button';
import ClipBoard from './../../components/ClipBoard';
import axios from 'axios';

class TitleBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            projects: false,
            publish: false,
            diagrams: [],
            share: false,
            platform: 'amazon',
            updateModal: false,
            stage: 0
        }

        this.toggle = this.toggle.bind(this);
        this.toggleShare = this.toggleShare.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleUpdate = this.toggleUpdate.bind(this);
        this.updateAlexa = this.updateAlexa.bind(this);
        this.openUpdate = this.openUpdate.bind(this);
    }

    openUpdate() {
        this.props.onSave(() => {
            this.setState({
                updateModal: true
            })
        });
    }

    updateAlexa() {
        this.setState({stage: 1});
        axios.post(`/diagram/${this.props.skill.diagram}/${this.props.skill.skill_id}/publish`)
        .then(res => {
            this.setState({stage: 2});
        })
        .catch(err => {
            this.setState({stage: 4});
        })
    }

    toggleUpdate() {
        this.setState({
            updateModal: false
        });
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

    render_body() {
        switch(this.state.stage){
            case 1:
                return <div className="super-center mb-4">
                    <div className='text-center'>
                        <h1><i className="fas fa-sync-alt fa-spin"/></h1>
                        Rendering
                    </div>
                </div>
            case 2:
                return <Alert color='success'>
                    Your skill has been updated
                </Alert>
            case 4:
                return <Alert color="danger">
                    Rendering Error  
                </Alert>
            default:
                return <div>
                    Updating to Alexa will allow you to test on your Alexa device if it is linked to the same Amazon account
                    <br/><br/> 
                    This will not publish your skill to the Alexa store, but will update your skill's flow across Alexa platforms
                    {(this.props.skill.live || this.props.skill.review) && <hr/>}
                    <div>
                        {this.props.skill.live && <Alert color="danger">This skill is in production, updating will change the flow for all production users</Alert>}
                        {this.props.skill.review && <Alert color="danger">This skill is under review, updating will change the flow during the review process</Alert>}
                    </div>
                </div>
        }
    }

    render() {
        let link = `https://creator.getvoiceflow.com/preview/${this.props.skill.skill_id}/${this.props.diagram_id}`

        return (
            <div className="TitleBar no-select">
                <Modal isOpen={this.state.updateModal} toggle={this.toggleUpdate} onClosed={()=>this.setState({stage: 0})}>
                    <ModalHeader toggle={this.toggleUpdate}>Update Skill</ModalHeader>
                    <ModalBody className="render_body">
                        {this.render_body()}
                    </ModalBody>
                    {   
                        this.state.stage === 0 ?
                        <ModalFooter>
                            <Button color="info" onClick={this.updateAlexa}>Update <i className="far fa-cloud-upload"/></Button>{' '}
                            <Button color="primary" onClick={this.toggleUpdate}>Cancel</Button>
                        </ModalFooter> : null
                    }
                </Modal>
                {this.props.preview ? null :
                    <div className="title-group">
                        <div className="title-group-sub">
                            <MUIButton variant="contained" className="white-btn save-btn" onClick={this.props.onSave}>{this.props.saving ? <i className="fas fa-sync-alt fa-spin"/> : "Save"}</MUIButton>

                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="d-inline-block">
                                <DropdownToggle className="anti-btn" tag="div">
                                    <MUIButton variant="contained" className="white-btn publish-btn">
                                        Publish <i className="fas fa-caret-down"/>
                                    </MUIButton>
                                </DropdownToggle>
                                <DropdownMenu className="platform-dropdown">
                                    <DropdownItem className="platform-btn" onClick={this.props.publishAMZN}>Amazon<span className="button-circle"><i className="fab fa-amazon mr-1"/></span></DropdownItem>
                                    {   this.props.skill.amzn_id ?
                                        <DropdownItem className="platform-btn" onClick={this.openUpdate}>Update Alexa<span className="button-circle"><i className="far fa-cloud-upload"/></span></DropdownItem> : null
                                    }
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

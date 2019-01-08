import React, { PureComponent } from 'react'
import { Popover, PopoverHeader, PopoverBody, InputGroup, InputGroupAddon, Input, Alert, Modal,
         ModalHeader, ModalBody, Button, Label } from 'reactstrap'
import MUIButton from '@material-ui/core/Button'
import ClipBoard from './../../components/ClipBoard'
import AmazonLogin from './../../components/Forms/AmazonLogin'
import axios from 'axios'
import {Tooltip} from 'react-tippy'
import Switch from '@material-ui/core/Switch'

import AuthenticationService from './../../../services/Authentication'

class ActionGroup extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            projects: false,
            publish: false,
            diagrams: [],
            share: false,
            allowPreview: false,
            platform: 'amazon',
            updateModal: false,
            stage: 0,
            amzn_error: false,
            upload_error: 'No Error',
            skill: null,
            settings_tab_state: 'basic',
            displayingConfirmDelete: false
        }

        this.toggle = this.toggle.bind(this)
        this.toggleShare = this.toggleShare.bind(this)
        this.togglePreview = this.togglePreview.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggleUpdate = this.toggleUpdate.bind(this)
        this.updateAlexa = this.updateAlexa.bind(this)
        this.openUpdate = this.openUpdate.bind(this)
        this.checkVendor = this.checkVendor.bind(this)
        this.reset = this.reset.bind(this)
        this.token = null
    }

    componentWillReceiveProps(props){
        // create a local copy of skill settings
        if(!this.state.skill && props.skill.name !== '...'){
            this.setState({
                skill: {
                    name: props.skill.name,
                    restart: props.skill.restart
                },
                allowPreview: props.skill.preview
            });
        }
    }

    componentDidMount() {
        AuthenticationService.AmazonAccessToken(token => {
            this.token = token;
            this.reset();
        });
    }

    reset() {
        this.setState({
            amzn_error: false,
            stage: this.token ? 0 : 5
        });
        //
    }

    openUpdate() {
        this.props.onSave(() => {
            this.setState({
                updateModal: true
            })
        });
    }

    checkVendor(){
        this.setState({stage: 7});

        axios.get('/session/vendor')
        .then(() => {
            this.setState({stage: 0});
        })
        .catch(err => {
            console.error(err);
            this.setState({stage: 6});
        });
    }

    updateAlexa() {
        this.setState({stage: 1});
        axios.post(`/diagram/${this.props.skill.diagram}/${this.props.skill.skill_id}/publish`)
        .then(() => {
            this.setState({stage: 11}, () => {
                axios.post(`/skill/${this.props.skill.skill_id}/publish`)
                .then(res => {
                    let skill = this.props.skill;
                    skill.amzn_id = res.data;
                    this.props.updateSkill(skill);
                    this.setState({
                        stage: 2
                    });
                })
                .catch(err => {
                    if(err.status === 403 || err.response.status === 403){
                        // No Vendor ID/Amazon Developer Account
                        this.setState({
                            stage: 6
                        });
                    }else{
                        let error_message = ''
                        if(err.response && err.response.data && err.response.data.message){
                            error_message += err.response.data.message

                            if (err.response.data.violations) {
                                for (let i = 0; i < err.response.data.violations.length; i++){
                                    error_message += '\n' + err.response.data.violations[i].message
                                }
                            }
                        }

                        this.setState({
                            stage: 9,
                            upload_error: ((
                                err.response &&
                                err.response.data &&
                                err.response.data.message) ? error_message : 'Error Encountered')
                        })
                    }
                })
            });
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

    togglePreview() {
      axios.patch('/skill/' + this.props.skill.skill_id + '?preview=true', {
          isPreview: !this.state.allowPreview,
      })
      .then(() => {
          this.setState({ allowPreview: !this.state.allowPreview});
      })
      .catch(err => {
          console.log(err);
      })
    }

    toggleShare() {
      this.setState({
          share: !this.state.share
      });
    }

    render_body() {
        // I had to get this out really fast the states are all REALLY fucking wack
        if(!this.props.skill.locales){
            return null;
        }

        switch(this.state.stage){
            case 1:
                return <div className="super-center mb-4">
                    <div className='text-center'>
                        <h1><span className="loader"/></h1>
                        <p className="loading">Rendering</p>
                    </div>
                </div>
            case 2:
                return <React.Fragment>
                    <img src="/images/clipboard-icon.svg" alt="Success" height="160"/>
                    <br/>
                    <span className="modal-bg-txt text-center mb-2"> Successfully uploaded to Alexa </span>
                    <span className="modal-txt text-center">
                        You may test on the Alexa simulator or live on your personal Alexa device.
                    </span>
                    <div className="my-3">
                        <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${this.props.skill.locales[0].replace('-', '_')}/`}
                        className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
                            Test on Alexa Simulator
                        </a>
                    </div>
                </React.Fragment>
            case 4:
                return <Alert color="danger">
                    Rendering Error
                </Alert>
            case 5:
                return <div className="modal-txt flex-fill text-center mt-3">
                    {this.state.amzn_error && <Alert color="danger">Login With Amazon Failed - Try Again</Alert>}
                    Login with Amazon to test your skill on your own Alexa device, or in the Alexa developer console
                    <div className="text-center mt-4">
                        <AmazonLogin
                            updateLogin={(stage) => {
                                if(stage === 2){
                                    this.token = true;
                                    this.checkVendor();
                                }else if(1){
                                    this.setState({stage: 8});
                                }else{
                                    this.setState({stage: 0, amzn_error: true});
                                }
                            }}
                        />
                    </div>
                </div>
            case 6:
                 return <React.Fragment>
                    Your Amazon Account needs to set up developer settings to Upload Skills
                    <span className="text-muted text-center font-italic">
                        Press "Create your Amazon Developer account"<br/>
                        and sign up with the same email as your Amazon Account.
                    </span>
                    <div className="my-3">
                        <a href="https://developer.amazon.com/login.html" className="btn btn-primary mr-2" target="_blank"  rel="noopener noreferrer">
                            Developer Sign Up
                        </a>
                        <Button color="info" onClick={this.checkVendor}>
                            <i className="fas fa-sync-alt"/> Check Again
                        </Button>
                    </div>
                </React.Fragment>
            case 7:
                return <div className="super-center mb-4">
                    <div className='text-center'>
                        <h1><span className="loader"/></h1>
                        <p className="loading">Checking Vendor</p>
                    </div>
                </div>
            case 8:
                return <div className="super-center mb-4">
                    <div className='text-center'>
                        <h1><span className="loader"/></h1>
                        <p className="loading">Verifying Login</p>
                    </div>
                </div>
            case 9:
                return <div className="w-100">
                    Error Uploading to Alexa
                    <Alert color="danger" className="mt-1">
                        {this.state.upload_error}
                    </Alert>
                </div>
            case 11:
                return <div className="super-center mb-4">
                    <div className='text-center'>
                        <h1><span className="loader"/></h1>
                        <p className="loading">Uploading to Alexa</p>
                    </div>
                </div>
            default:
                return <div>
                    <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload"/>
                    <div className="modal-bg-txt text-center mt-2"> Upload your skill for testing</div>
                    <div className="modal-txt text-center mt-2"> Updating to Alexa will allow you to test on your Alexa device or the Alexa Developer Console.</div>
                    {(this.props.skill.live || this.props.skill.review) && <hr/>}
                    <div>
                        {this.props.skill.live && <Alert color="danger">This skill is in production, updating will change the flow for all production users</Alert>}
                        {this.props.skill.review && <Alert color="danger">This skill is under review, updating will change the flow during the review process</Alert>}
                    </div>

                    <div className="super-center mb-3 mt-3">
                        <Button color="primary" onClick={this.updateAlexa}>Confirm Upload</Button>
                    </div>
                </div>
        }
    }

    render() {

        let link = `https://creator.getvoiceflow.com/preview/${this.props.skill.skill_id}/${this.props.diagram_id}`

        return (
            <React.Fragment>
            <Modal isOpen={this.state.updateModal} toggle={this.toggleUpdate} onClosed={this.reset} className="stage_modal">
                <ModalHeader toggle={this.toggleUpdate}>Update Skill</ModalHeader>
                <ModalBody className="modal-info">
                    <div>
                        {this.render_body()}
                    </div>
                </ModalBody>
            </Modal>
            <div className="title-group no-select">
                <div className="last-save">{!this.props.saved && <span className="dot"/>}{this.props.lastSave}</div>
                <div className="title-group-sub">
                    <Tooltip
                        title="Share"
                        position="bottom"
                        distance={16}
                    >
                        <MUIButton variant="contained" className="white-btn share-btn" onClick={this.toggleShare} id="share">
                            <i className="fas fa-share"/>
                        </MUIButton>
                    </Tooltip>
                    <Popover placement="bottom" isOpen={this.state.share} target="share" toggle={this.toggleShare}>
                        <PopoverHeader>Share Link</PopoverHeader>
                        <PopoverBody style={{minWidth: '260px'}}>
                            <div className="space-between">
                                <Label>Allow preview sharing</Label>
                                <Switch
                                    checked={this.state.allowPreview}
                                    onChange={this.togglePreview}
                                    color="primary"
                                />
                            </div>
                            {this.state.allowPreview &&
                                <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                        <ClipBoard
                                            component="button"
                                            className="btn btn-primary"
                                            value={link}
                                            id="shareLink"
                                        >
                                            <i className="fas fa-copy"/>
                                        </ClipBoard>
                                    </InputGroupAddon>
                                    <Input readOnly value={link} className="form-control-border right"/>
                                </InputGroup>
                            }
                        </PopoverBody>
                    </Popover>
                    <Tooltip
                        distance={16}
                        title="Save"
                        position="bottom"
                    >
                        <MUIButton variant="contained" className="white-btn save-btn" onClick={this.props.onSave}>
                            {this.props.saving ?
                                <span className="loader"/> :
                                <React.Fragment>
                                    {!this.props.saved && <span className="unsaved"/>}
                                    <i className="fas fa-save"/>
                                </React.Fragment>
                            }
                        </MUIButton>
                    </Tooltip>
                </div>
                <Tooltip
                    html={<div style={{ width: 155 }}>Test your skill on your own Alexa device, or in the Alexa developer console</div>}
                    position="bottom"
                    distance={16}
                >
                    <MUIButton variant="contained" className="publish-btn" onClick={this.openUpdate}>
                        Upload to Alexa <div className="launch">
                            <div className="first">
                                <i className="far fa-long-arrow-up"/>
                            </div>
                            <div className="second">
                                <i className="far fa-check"/>
                            </div>
                        </div>
                    </MUIButton>
                </Tooltip>
            </div>
            </React.Fragment>
        );
    }
}

export default ActionGroup;

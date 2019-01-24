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
// import { timingSafeEqual } from 'crypto';

const loading = (message) => {
    return <div className="super-center mb-4">
        <div className='text-center'>
            <h1><span className="loader"/></h1>
            <p className="loading">{message}</p>
        </div>
    </div>
}

const GOOGLE_STAGES = {
    "0": "No Google Token Found",
    "1": "No Project ID Found",
    "2": "Confirm Publish",
    "3": "Rendering",
    "4": "Publishing",
    "5": "Published",
}

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
            google_stage: 0,
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
        this.renderGoogleBody = this.renderGoogleBody.bind(this)
        this.updateGoogle = this.updateGoogle.bind(this)

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
        AuthenticationService.googleAccessToken().then(token => {
            this.setState({
              google_stage: token ? 2 : 0
            });
          });
    }

    reset() {
        this.setState({
            amzn_error: false,
            stage: this.token ? 0 : 5
        })
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

    async enableSkill(locale) {
        this.setState({stage: 13})
        try{
            await axios.put(`/interaction_model/${this.props.skill.amzn_id}/enable`)
            this.SucceedLocale = locale
        }catch(err){
            console.error(err)
        }
        this.setState({stage: 2})
    }

    checkInteractionModel() {
        this.setState({stage: 12})
        this.SucceedLocale = null
        const iterate = (depth) => {
            // wait up to 20 seconds
            if(depth === 20){
                this.setState({
                    stage: 2
                })
            }else{
                setTimeout(() => {
                    axios.get(`/interaction_model/${this.props.skill.amzn_id}/status`)
                    .then(res => {
                        // console.log(res.data)
                        if(res.data && res.data.interactionModel){
                            for(let key in res.data.interactionModel){
                                let locale = res.data.interactionModel[key]
                                if(locale.lastUpdateRequest && locale.lastUpdateRequest.status && locale.lastUpdateRequest.status === 'SUCCEEDED'){
                                    this.enableSkill(key)
                                    return
                                }
                            }
                        }
                        iterate(depth + 1)
                    })
                    .catch(err => {
                        console.error(err)
                        this.setState({
                            stage: 2
                        })
                    })
                }, 1000)
            }
        }

        iterate(0)
    }

    updateAlexa() {
        this.setState({stage: 1});
        axios.post(`/diagram/${this.props.skill.diagram}/${this.props.skill.skill_id}/publish`)
        .then(res => {
            let new_version_data = res.data
            this.setState({stage: 11}, () => {
                axios.post(`/skill/${new_version_data.new_skill.skill_id}/publish`)
                .then(res => {
                    let skill = this.props.skill;
                    skill.amzn_id = res.data;
                    this.props.updateSkill(skill)
                    this.checkInteractionModel()
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
            console.error(err)
            this.setState({stage: 4});
        })
    }

    updateGoogle() {
        const s = this.state
        const p = this.props

        if (s.google_stage === 0 || s.google_stage === 1 || !p.skill.google_publish_info || !p.skill.google_publish_info.project_id) {
            p.history.push(`/publish/${p.skill.skill_id}/google`)
            p.onError('Project ID or Authentication Token not found. Please fill in the required fields, and click "Publish"')
            return
        }

        this.setState({ google_stage: 3 });

        axios.post(`/diagram/${p.skill.diagram}/${p.skill.skill_id}/publish`)
        .then(res => {
            this.setState({ google_stage: 4 });
            let new_version_data = res.data
            p.addVersion(new_version_data)
            axios.post(`/skill/${new_version_data.new_skill.skill_id}/publishgoogle`)
            .then(res => {
                this.setState({
                    google_stage: 5,
                    project_id: res.data.project_id || this.state.project_id
                });
            })
            .catch(err => {
                this.setState({
                    google_stage: 2,
                    updateModal: false
                })
                const error_msg = err.response && err.response.data ? err.response.data : err
                p.onError(error_msg)
            })
        })
        .catch(err => {
            p.onError(err)
        })
      }

    toggleUpdate() {
        if(![1,7,11].includes(this.state.stage)){
            this.setState({
                updateModal: false
            })
        }
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
                return loading('Rendering Flows')
            case 2:
                if(this.SucceedLocale){
                    return <React.Fragment>
                        <img src="/images/clipboard-icon.svg" alt="Success" height="160"/>
                        <br/>
                        <span className="modal-bg-txt text-center mb-2"> Successfully uploaded to Alexa </span>
                        <span className="modal-txt text-center">
                            You may test on the Alexa simulator or live on your personal Alexa device
                        </span>
                        <Alert className="w-75 mb-1 mt-3 text-center"><b>Alexa,</b> open {this.props.skill.inv_name}</Alert>
                        <div className="my-3">
                            <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${this.SucceedLocale.replace('-', '_')}/`}
                            className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
                                Test on Alexa Simulator
                            </a>
                        </div>
                    </React.Fragment>
                }else{
                    return <React.Fragment>
                        <img src="/images/clipboard-icon.svg" alt="Success" height="160"/>
                        <br/>
                        <span className="modal-bg-txt text-center mb-2"> Successfully uploaded to Alexa </span>
                        <span className="modal-txt text-center">
                            You may test on the Alexa simulator or live on your personal Alexa device
                        </span>
                        <div className="my-3">
                            <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${this.props.skill.locales[0].replace('-', '_')}/`}
                            className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
                                Test on Alexa Simulator
                            </a>
                        </div>
                    </React.Fragment>
                }
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
                    <Alert className="mt-4">
                        Press "Create your Amazon Developer account"
                        and sign up with the same email as your Amazon Account.
                    </Alert>
                    <div className="my-3">
                        <a href="https://developer.amazon.com/login.html" className="btn btn-primary mr-2" target="_blank"  rel="noopener noreferrer">
                            Developer Sign Up
                        </a>
                        <Button color="clear" onClick={this.checkVendor}>
                            <i className="fas fa-sync-alt"/> Check Again
                        </Button>
                    </div>
                </React.Fragment>
            case 7:
            return loading('Checking Vendor')
            case 8:
                return loading('Verifying Login')
            case 9:
                return <div className="w-100">
                    <h5 className="text-muted">Amazon Error Response</h5>
                    <Alert color="danger" className="mt-1">
                        {this.state.upload_error}
                    </Alert>
                    <Alert>Amazon responded with an error, Visit our <u><a href="https://forum.getvoiceflow.com">community</a></u> or contact us for help</Alert>
                </div>
            case 11:
                return loading('Uploading to Alexa')
            case 12:
                return loading('Building Interaction Model')
            case 13:
                return loading('Enabling Skill')
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
                        <button className="purple-btn" onClick={this.updateAlexa}>Confirm Upload</button>
                    </div>
                </div>
        }
    }

    renderGoogleBody() {
        let modal_content = null
        if (
            this.state.google_stage === 3 ||
            this.state.google_stage === 4
        ) {
            modal_content = <div className="super-center mb-4">
                <div className='text-center'>
                    <h1><span className="loader" /></h1>
                    <p className="loading">{GOOGLE_STAGES[this.state.google_stage]}</p>
                </div>
            </div>
        } else if (this.state.google_stage === 5) {
            modal_content = <React.Fragment>
            <img src="/images/clipboard-icon.svg" alt="Success" height="160" />
            <br />
            <span className="modal-bg-txt text-center mb-2"> Successfully uploaded to Google Actions </span>
            <span className="modal-txt text-center">
                You may test on the Google Actions Simulator. To submit for review, please follow the instructions on the Google Actions Developer Console.
            </span>
                <div className="my-3">
                <a href={`https://console.actions.google.com/project/${this.state.project_id}/simulator`}
                    className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
                    Test on Google Actions Simulator
                </a>
                </div>
            </React.Fragment>
        } else {
            modal_content = <div>
                <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload"/>
                <div className="modal-bg-txt text-center mt-2"> Upload your skill for testing</div>
                <div className="modal-txt text-center mt-2"> Updating to Google will allow you to test on your Google device or the Google Actions Console.</div>
                {(this.props.skill.live || this.props.skill.review) && <hr/>}
                <div>
                    {this.props.skill.google_publish_info && this.props.skill.google_publish_info.live && <Alert color="danger">This skill is in production, updating will change the flow for all production users</Alert>}
                    {this.props.skill.google_publish_info && this.props.skill.google_publish_info.review && <Alert color="danger">This skill is under review, updating will change the flow during the review process</Alert>}
                </div>

                <div className="super-center mb-3 mt-3">
                    <button className="purple-btn" onClick={this.updateGoogle}>Confirm Upload</button>
                </div>
            </div>
        }
        return modal_content
    }

    render() {

        let link = `https://creator.getvoiceflow.com/preview/${this.props.skill.skill_id}/${this.props.diagram_id}`

        return (
            <React.Fragment>
            <Modal isOpen={this.state.updateModal} toggle={this.toggleUpdate} onClosed={this.reset} className="stage_modal">
                <ModalHeader toggle={this.toggleUpdate}>Update Skill</ModalHeader>
                <ModalBody className="modal-info">
                    <div>
                        {this.props.isGoogle ? this.renderGoogleBody() : this.render_body()}
                    </div>
                </ModalBody>
            </Modal>
            <div className="title-group no-select">
                <div className="last-save">{!this.props.saved && <span className="dot"/>}{this.props.lastSave}</div>
                <div className="title-group-sub">
                    <Tooltip
                        distance={16}
                        title={this.props.isGoogle ? "Switch to Amazon View" : "Switch to Google View"}
                        position="bottom"
                    >
                        <MUIButton variant="contained" className="white-btn google-btn" onClick={this.props.toggleGoogle}>
                            <React.Fragment>
                                {this.props.isGoogle && <i className="fab fa-amazon"/>}
                                {!this.props.isGoogle && <i className="fab fa-google"/>}
                            </React.Fragment>
                        </MUIButton>
                    </Tooltip>
                    <Tooltip
                        title="Share"
                        position="bottom"
                        distance={16}
                    >
                        <button id="icon-share" className="nav-btn-border" onClick={this.toggleShare}></button>
                    </Tooltip>
                    <Popover placement="bottom" isOpen={this.state.share} target="icon-share" toggle={this.toggleShare} className="mt-3">
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
                </div>
                <Tooltip
                    distance={16}
                    title="Save"
                    position="bottom"
                >
                    <button id="icon-save" className={`${this.props.saved ? 'nav-btn btn-successful' : 'nav-btn unsaved'} ${this.props.saving ? 'saving' : ''} mr-4 ml-4`} onClick={this.props.onSave}>
                        {this.props.saving && <span className="save-loader"/>}
                    </button>
                </Tooltip>
                <Tooltip
                    html={<div style={{ width: 155 }}>{this.props.isGoogle ? 'Test your skill on your own Google device, or in the Google Actions console' : 'Test your skill on your own Alexa device, or in the Alexa developer console'}</div>}
                    position="bottom"
                    distance={16}
                >
                    <MUIButton variant="contained" className="publish-btn" onClick={this.openUpdate}>
                        {this.props.isGoogle ? 'Upload to Google' : 'Upload to Alexa'}<div className="launch">
                            <div className="first">
                            <img src={'/up-arrow.svg'} alt="upload" width="18" height="18"/>
                            </div>
                            <div className="second">
                            <img src={'/rocket.svg'} alt="check" width="16" height="16"/>
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

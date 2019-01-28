import React, { PureComponent } from 'react'
import { Popover, PopoverHeader, PopoverBody, InputGroup, InputGroupAddon, Input, Alert, Modal,
         ModalHeader, ModalBody, Button, Label } from 'reactstrap'
import ClipBoard from './../../components/ClipBoard'
import AmazonLogin from './../../components/Forms/AmazonLogin'
import axios from 'axios'
import {Tooltip} from 'react-tippy'
import Switch from '@material-ui/core/Switch'

import AuthenticationService from './../../../services/Authentication'
import InvRegex from 'services/Regex'
// import { timingSafeEqual } from 'crypto';

const loading = (message) => {
    return <div className="super-center mb-4 loading-modal">
        <div className='text-center'>
            <h1><span className="loader"/></h1>
            <p className="loading">{message}</p>
        </div>
    </div>
}

const ENDING_STAGES = [2,4,9]
const LAUNCH_PHRASES = ['launch', 'ask', 'tell', 'load', 'begin', 'enable']
const WAKE_WORDS = ['Alexa', 'Amazon', 'Echo', 'Skill', 'App']

const invNameError = (name, locales) => {
    if(!name.trim()){
        return 'Invocation name required for Alexa'
    }
    let characters = InvRegex.validLatinChars
    let inv_name_error = `[${locales.filter(l => l !== 'jp-JP').join(",")}] Invocation name may only contain Latin characters, apostrophes, periods and spaces`
    if(locales.length === 1 && locales[0] === 'jp-JP'){
        characters = InvRegex.validSpokenCharacters
        inv_name_error = 'Invocation name may only contain Japanese/English characters, apostrophes, periods and spaces'
    }else if(locales.some(l => l.includes('en'))){
        // If an English Skill No Accents Allowed
        inv_name_error = `[${locales.filter(l => l.includes('en')).join(",")}] Invocation name may only contain alphabetic characters, apostrophes, periods and spaces`
        characters = InvRegex.validCharacters
    }

    let validRegex = `[^${characters}.' ]+`
    let match = name.match(validRegex)
    if(match){
        return inv_name_error + ` - Invalid Characters: "${match.join()}"`
    }else if(WAKE_WORDS.some(l => name.toLowerCase().includes(l.toLowerCase()))){
        return 'Invocation name can not contain Alexa keywords e.g. ' + WAKE_WORDS.join(', ')
    }else if(LAUNCH_PHRASES.some(l => name.toLowerCase().includes(l.toLowerCase()))){
        return 'Invocation name can not contain Launch Phrases e.g. ' + LAUNCH_PHRASES.join(', ')
    }else{
        return null
    }
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
            amzn_error: false,
            upload_error: 'No Error',
            skill: null,
            settings_tab_state: 'basic',
            displayingConfirmDelete: false,
            inv_name: null,
            inv_name_error: '',
            flash: false
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
        this.shouldReset = this.shouldReset.bind(this)
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

    shouldReset() {
        if(ENDING_STAGES.includes(this.state.stage)){
            this.reset()
        }
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
                }, 3000)
            }
        }

        iterate(0)
    }

    async updateAlexa() {
        let inv_name = this.state.inv_name ? this.state.inv_name : this.props.skill.inv_name
        let error = invNameError(inv_name, this.props.skill.locales)
        if(error){
            this.setState({inv_name: inv_name, inv_name_error: error, stage: 14}, ()=>{
                this.setState({flash: true}, ()=>setTimeout(()=>this.setState({flash: false}), 1500))
            })
            return
        }
        this.setState({stage: 1})
        if(this.state.stage === 14){
            this.setState({stage: 1})
            try{
                await axios.patch(`/skill/${this.props.skill.skill_id}?inv_name=1`, {inv_name: this.state.inv_name})
                let skill = this.props.skill
                skill.inv_name = this.state.inv_name
                this.props.updateSkill(skill)
            }catch(err){
                this.setState({stage: 6})
            }
        }
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

    toggleUpdate() {
        if(![1,7,11,12,13].includes(this.state.stage)){
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
            case 14:
                return <div className="w-100">
                    <div className="space-between text-muted">
                        <label>Invocation Name</label>
                        <Tooltip
                            html={(<React.Fragment>Alexa listens for the Invocation Name<br/> to launch your skill<br/> e.g. <i>Alexa, open <b>Invocation Name</b></i></React.Fragment>)}
                            position="bottom"
                        >
                            <i className="fal fa-question-circle"/>
                        </Tooltip>
                    </div>
                    <input className="form-control" value={this.state.inv_name} placeholder='Invocation Name' onChange={(e)=>this.setState({inv_name: e.target.value, inv_name_error: invNameError(e.target.value, this.props.skill.locales)})}/>
                    <small className={"text-blue" + (this.state.flash ? ' blink' : '')}>{this.state.inv_name_error}</small>
                    <div className="super-center mt-4-5 mb-3">
                        <button className="purple-btn" onClick={this.updateAlexa}>Continue</button>
                    </div>
                </div>
            default:
                return <div>
                    <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload"/>
                    <div className="modal-bg-txt text-center mt-2"> Upload your skill for testing</div>
                    <div className="modal-txt text-center mt-2"> Updating to Alexa will allow you to test on your Alexa device or the Alexa Developer Console</div>
                    <div className="super-center mb-3 mt-3">
                        <button className="purple-btn" onClick={this.updateAlexa}>Continue</button>
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
                <div className="align-icon">
                    <Tooltip
                        distance={16}
                        title="Save"
                        position="bottom"
                        className="mr-4"
                    >
                        <button id="icon-save" className={`${this.props.saved ? 'nav-btn btn-successful' : 'nav-btn unsaved'} ${this.props.saving ? 'saving' : ''}`} onClick={this.props.onSave}>
                            {this.props.saving && <span className="save-loader"/>}
                        </button>
                    </Tooltip>
                </div>
                <div className="title-group-sub">
                    <Tooltip
                        className="top-nav-icon"
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
                <div className="align-icon">
                    <Tooltip
                        distance={16}
                        title="Test"
                        position="bottom"
                        className="ml-4 mr-4"
                    >
                        <button className="nav-btn" onClick={this.props.onTest}><i className="far fa-play"/></button>
                    </Tooltip>
                </div>
                <Tooltip
                    html={<div style={{ width: 155 }}>Test your skill on your own Alexa device, or in the Alexa developer console</div>}
                    position="bottom"
                    distance={16}
                >
                    <Button variant="contained" className="publish-btn" onClick={this.openUpdate}>
                        Upload to Alexa <div className="launch">
                            <div className="first">
                                <img src={'/up-arrow.svg'} alt="upload" width="18" height="18"/>
                            </div>
                            <div className="second">
                                <img src={'/rocket.svg'} alt="check" width="16" height="16"/>
                            </div>
                        </div>
                    </Button>
                </Tooltip>
            </div>
            </React.Fragment>
        );
    }
}

export default ActionGroup;

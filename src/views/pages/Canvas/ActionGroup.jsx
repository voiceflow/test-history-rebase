import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { updateSkill } from './../../actions/skillActions'
import {
    Popover, PopoverHeader, PopoverBody, InputGroup, InputGroupAddon, Input, Alert, Modal,
    ModalHeader, ModalBody, Button
} from 'reactstrap'
import ClipBoard from './../../components/ClipBoard'
import AmazonLogin from './../../components/Forms/AmazonLogin'
import axios from 'axios'
import { Tooltip } from 'react-tippy'
import Toggle from 'react-toggle'
import { Progress } from 'react-sweet-progress'
import "react-sweet-progress/lib/style.css"

import AuthenticationService from './../../../services/Authentication'
import InvRegex from 'services/Regex'
// import { timingSafeEqual } from 'crypto';

import './ActionGroup.css'

const loading = (message) => {
    return <div className="super-center mb-4">
        <div className='text-center'>
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

const STAGE_PERCENTAGES = {
    alexa: {
        1: 10,
        11: 20,
        12: 60,
        13: 80
    },
    google: {
        3: 10,
        4: 60
    }
}

const ERROR_STAGES = {
    alexa: [4, 9],
    google: [2]
}

const ENDING_STAGES = {
    alexa: [2, 4, 9],
    google: [2, 5]
}
const LAUNCH_PHRASES = ['launch', 'ask', 'tell', 'load', 'begin', 'enable']
const WAKE_WORDS = ['Alexa', 'Amazon', 'Echo', 'Skill', 'App']

const invNameError = (name, locales) => {
    if(!name || !name.trim()){
        return 'Invocation name required for Alexa'
    }
    let characters = InvRegex.validLatinChars
    let inv_name_error = `[${locales.filter(l => l !== 'jp-JP').join(",")}] Invocation name may only contain Latin characters, apostrophes, periods and spaces`
    if (locales.length === 1 && locales[0] === 'ja-JP') {
        characters = InvRegex.validSpokenCharacters
        inv_name_error = 'Invocation name may only contain Japanese/English characters, apostrophes, periods and spaces'
    } else if (locales.some(l => l.includes('en'))) {
        // If an English Skill No Accents Allowed
        inv_name_error = `[${locales.filter(l => l.includes('en')).join(",")}] Invocation name may only contain alphabetic characters, apostrophes, periods and spaces`
        characters = InvRegex.validCharacters
    }

    let validRegex = `[^${characters}.' ]+`
    let match = name.match(validRegex)
    if (match) {
        return inv_name_error + ` - Invalid Characters: "${match.join()}"`
    } else if (WAKE_WORDS.some(l => name.toLowerCase().includes(l.toLowerCase()))) {
        return 'Invocation name can not contain Alexa keywords e.g. ' + WAKE_WORDS.join(', ')
    } else if (LAUNCH_PHRASES.some(l => name.toLowerCase().includes(l.toLowerCase()))) {
        return 'Invocation name can not contain Launch Phrases e.g. ' + LAUNCH_PHRASES.join(', ')
    } else {
        return null
    }
}

export class ActionGroup extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            projects: false,
            publish: false,
            diagrams: [],
            share: false,
            updateModal: false,
            updateLiveModal: false,
            stage: 0,
            google_stage: 0,
            amzn_error: false,
            upload_error: 'No Error',
            settings_tab_state: 'basic',
            displayingConfirmDelete: false,
            inv_name: null,
            inv_name_error: '',
            flash: false,
            live_update_stage: 0,
            is_first_upload: false,
            show_upload_prompt: false,
            is_error: false
        }

        this.toggle = this.toggle.bind(this)
        this.toggleShare = this.toggleShare.bind(this)
        this.togglePreview = this.togglePreview.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggleUpdate = this.toggleUpdate.bind(this)
        this.toggleUpdateLive = this.toggleUpdateLive.bind(this)
        this.updateAlexa = this.updateAlexa.bind(this)
        this.openUpdate = this.openUpdate.bind(this)
        this.openUpdateLive = this.openUpdateLive.bind(this)
        this.checkVendor = this.checkVendor.bind(this)
        this.reset = this.reset.bind(this)
        this.renderGoogleBody = this.renderGoogleBody.bind(this)
        this.updateGoogle = this.updateGoogle.bind(this)
        this.shouldReset = this.shouldReset.bind(this)
        this.token = null
        this.updateLiveVersion = this.updateLiveVersion.bind(this)
        this.renderUploadButton = this.renderUploadButton.bind(this)
        this.isUploadLoading = this.isUploadLoading.bind(this)
        this.displayUploadPrompt = this.displayUploadPrompt.bind(this)
    }

    componentDidMount() {
        let is_first_upload = localStorage.getItem('is_first_upload')
        if(is_first_upload === 'true'){
            this.setState({
                is_first_upload: true
            })
        } else {
            this.setState({
                is_first_upload: false
            })
        }

        AuthenticationService.AmazonAccessToken(token => {
            this.token = token;
            this.reset();
        });
        AuthenticationService.googleAccessToken(this.props.skill.skill_id).then(token => {
            this.google_token = token;
            this.reset()
        });
    }

    shouldReset() {
        if (ENDING_STAGES[this.props.platform].includes(this.state.stage)) {
            this.reset()
        }
    }

    openUpdate() {
        if(this.state.is_first_upload){
            this.props.setCB(() => {
                this.setState({
                    updateModal: true
                })
            })
            this.props.onSave()
        } else if(this.props.platform === 'alexa'){
            this.updateAlexa()
        } else {
            this.updateGoogle()
        }
    }

    reset() {
        let is_first_upload = localStorage.getItem('is_first_upload')
        if(is_first_upload === 'true'){
            this.setState({
                is_first_upload: true
            })
        } else {
            this.setState({
                is_first_upload: false
            })
        }
        
        this.setState({
            amzn_error: false,
            stage: this.token ? 0 : 5,
            google_stage: this.google_token ? 2 : 0
        })
    }

    openUpdateLive() {
        this.setState({
            updateLiveModal: true
        })
    }

    checkVendor() {
        this.setState({ stage: 7 });

        axios.get('/session/vendor')
            .then(() => {
                this.setState({ stage: 0 });
            })
            .catch(err => {
                console.error(err);
                this.setState({ stage: 6 });
            });
    }

    async enableSkill(locale) {
        this.setState({ stage: 13 })
        try {
            await axios.put(`/interaction_model/${this.props.skill.amzn_id}/enable`)
            this.SucceedLocale = locale
        } catch (err) {
            console.error(err)
        }
        this.setState({ stage: 2 })
    }

    checkInteractionModel() {
        this.setState({ stage: 12 })
        this.SucceedLocale = null
        const iterate = (depth) => {
            // wait up to 20 seconds
            if (depth === 20) {
                this.setState({
                    stage: 2
                })
            } else {
                setTimeout(() => {
                    axios.get(`/interaction_model/${this.props.skill.amzn_id}/status`)
                        .then(res => {
                            // console.log(res.data)
                            if (res.data && res.data.interactionModel) {
                                for (let key in res.data.interactionModel) {
                                    let locale = res.data.interactionModel[key]
                                    if (locale.lastUpdateRequest && locale.lastUpdateRequest.status && locale.lastUpdateRequest.status === 'SUCCEEDED') {
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
        if (error) {
            this.setState({ inv_name: inv_name, inv_name_error: error, stage: 14, show_upload_prompt: !this.state.is_first_upload }, () => {
                this.setState({ flash: true }, () => setTimeout(() => this.setState({ flash: false }), 1500))
            })
            return
        }
        this.setState({ stage: 1 })
        if (this.state.stage === 14) {
            this.setState({ stage: 1 })
            try {
                await axios.patch(`/skill/${this.props.skill.skill_id}?inv_name=1`, { inv_name: this.state.inv_name })
                this.props.updateSkill('inv_name', this.state.inv_name)
            } catch (err) {
                this.setState({
                    stage: 6,
                    show_upload_prompt: !this.state.is_first_upload
                })
            }
        }
        axios.post(`/diagram/${this.props.skill.diagram}/${this.props.skill.skill_id}/publish`, { platform: 'alexa' })
            .then(res => {
                let new_version_data = res.data
                this.setState({ stage: 11 }, () => {
                    axios.post(`/skill/${new_version_data.new_skill.skill_id}/publish`)
                        .then(res => {
                            this.props.updateSkill('amzn_id', res.data)
                            this.checkInteractionModel()
                        })
                        .catch(err => {
                            if (err.status === 403 || err.response.status === 403) {
                                // No Vendor ID/Amazon Developer Account
                                this.setState({
                                    stage: 6,
                                    show_upload_prompt: !this.state.is_first_upload
                                })
                            } else if(err.status === 401 || err.response.status === 401) {
                                this.setState({
                                    stage: 5,
                                    show_upload_prompt: !this.state.is_first_upload
                                })
                            } else {
                                let error_message = ''
                                if (err.response && err.response.data && err.response.data.message) {
                                    error_message += err.response.data.message

                                    if (err.response.data.violations) {
                                        for (let i = 0; i < err.response.data.violations.length; i++) {
                                            error_message += '\n' + err.response.data.violations[i].message
                                        }
                                    }

                                }

                                this.setState({
                                    stage: 9,
                                    show_upload_prompt: !this.state.is_first_upload,
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
                this.setState({ stage: 4 });
            })
    }

    updateGoogle() {
        const s = this.state
        const p = this.props

        if (s.google_stage === 0 || s.google_stage === 1 || !p.skill.google_publish_info || !p.skill.google_publish_info.project_id) {
            p.history.push(`/publish/${p.skill.skill_id}/google`)
            return
        }

        this.setState({ google_stage: 3 });

        axios.post(`/diagram/${p.skill.diagram}/${p.skill.skill_id}/publish`, { platform: 'google', project_id: p.skill.google_publish_info.project_id })
            .then(res => {
                this.setState({ google_stage: 4 });
                let new_version_data = res.data
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
        if (![1, 7, 11, 12, 13].includes(this.state.stage)) {
            this.setState({
                updateModal: false
            })
        }
    }

    toggleUpdateLive() {
        this.setState(prev_state => ({
            updateLiveModal: !prev_state.updateLiveModal
        }))
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
        if (this.state.togglingPreview) return

        this.setState({
            allowPreview: !this.state.allowPreview,
            togglingPreview: true
        }, () => {
            axios.patch('/skill/' + this.props.skill.skill_id + '?preview=true', {
                isPreview: !!this.state.allowPreview,
            })
                .then(() => {
                    this.setState({ togglingPreview: false })
                })
                .catch(err => {
                    this.setState({
                        allowPreview: !this.state.allowPreview,
                        togglingPreview: false
                    })
                    this.props.onError('Unable to toggle preview')
                })
        })
    }

    toggleShare() {
        this.setState({
            share: !this.state.share
        });
    }

    displayUploadPrompt() {
        if(ERROR_STAGES[this.props.platform].includes(this.state.stage)){
            setTimeout(() => {
                this.setState({show_upload_prompt: false})
            }, 5000)
        }

        if(this.state.show_upload_prompt){
            return  <div className="upload-success-popup d-flex">
                        {this.props.platform === 'google'? 
                            this.renderGoogleBody()
                            :
                            this.render_body()
                        }
                        {!ERROR_STAGES[this.props.platform].includes(this.state.stage) && 
                            ((this.props.platform === 'alexa' && this.state.stage !== 14) || this.props.platform === 'google') && 
                            <button className="close close-upload-success-popup" onClick={() => {this.setState({show_upload_prompt: false, stage: 0, google_stage:2})}}>&times;</button>}
                    </div>
        } 
        return
    }

    isUploadLoading(){
        if(this.props.platform === 'alexa'){
            return !ENDING_STAGES[this.props.platform].includes(this.state.stage) && ![0, 5, 6, 8].includes(this.state.stage)
        } else {
            return !ENDING_STAGES[this.props.platform].includes(this.state.google_stage) && ![0, 5, 6, 8].includes(this.state.google_stage)
        }
    }

    updateLiveVersion() {
        this.setState({ live_update_stage: 1 })
        axios.post(`/diagram/${this.props.skill.diagram}/${this.props.skill.skill_id}/rerender`)
            .then(() => {
                this.setState({
                    live_update_stage: 2
                })
            })
            .catch(err => {
                this.props.onError('Error updating live version')
            })
    }

    renderLiveStage() {
        if (this.state.live_update_stage === 2) {
            return <React.Fragment>
                <img className="modal-img-small mb-4 mt-3 mx-auto" src="/live-success.svg" alt="Upload" />
                <div className="modal-bg-txt text-center mt-2"> Live Version Updated</div>
                <div className="modal-txt text-center mt-2 mb-3">This may take a few minutes to be reflected on your device.</div>
            </React.Fragment>
        } else if (this.state.live_update_stage === 1) {
            return loading('Rendering Flows')
        } else {
            return <React.Fragment>
                <img className="modal-img-small mb-4 mt-3 mx-auto" src="/live.svg" alt="Upload" />
                <div className="modal-bg-txt text-center mt-2"> Confirm Live Update</div>
                <div className="modal-txt text-center mt-2 mb-3">This update will effect the live version of your project. Please be sure you wish to do this.</div>
                <button className="purple-btn mb-3" onClick={this.updateLiveVersion}>Confirm Update</button>
            </React.Fragment>
        }
    }

    renderUploadButton() {
        if(this.props.live_mode){
            return <Tooltip
                html={<div style={{ width: 155 }}>Update your live version with your local changes</div>}
                position="bottom"
                distance={16}
            >
                <Button variant="contained" className="publish-btn" onClick={this.openUpdateLive}>
                    Update Live <div className="launch">
                        <div className="first">
                            <img src={'/up-arrow.svg'} alt="upload" width="18" height="18" />
                        </div>
                        <div className="second">
                            <img src={'/rocket.svg'} alt="check" width="16" height="16" />
                        </div>
                    </div>
                </Button>
            </Tooltip>
        } else {
            if(this.isUploadLoading()){
                return <Button variant="contained" className="publish-btn" disabled>
                        <p className="loading-btn m-0 p-0">Uploading</p>
                        <div className="launch">
                            <div className="load-spinner pt-1">
                                <span className="save-loader-white"/>
                            </div>
                        </div>
                    </Button>
            } else {
                return <Tooltip
                    html={<div style={{ width: 155 }}>{(this.props.platform === 'google') ? 'Test your skill on your own Google device, or in the Google Actions console' : 'Test your skill on your own Alexa device, or in the Alexa developer console'}</div>}
                    position="bottom"
                    distance={16}
                >
                    <Button variant="contained" className="publish-btn" onClick={this.openUpdate}>
                        {(this.props.platform === 'google') ? 'Upload to Google' : 'Upload to Alexa'}<div className="launch">
                            <div className="first">
                                <img src={'/up-arrow.svg'} alt="upload" width="18" height="18" />
                            </div>
                            <div className="second">
                                <img src={'/rocket.svg'} alt="check" width="16" height="16" />
                            </div>
                        </div>
                    </Button>
                </Tooltip>
            }
        }
    }

    render_body() {
        // I had to get this out really fast the states are all REALLY fucking wack
        if (!this.props.skill.locales) {
            return null;
        }

        switch (this.state.stage) {
            case 1:
                return loading('Rendering Flows')
            case 2:
                if (this.SucceedLocale) {
                    // Track upload on first session
                    if(localStorage.getItem('is_first_session') === 'true'){
                        axios.post('/analytics/track_first_session_upload')
                        .then(() => {
                            localStorage.setItem('is_first_session', 'false')
                        })
                        .catch(err => {
                            localStorage.setItem('is_first_session', 'false')
                            console.log(err)
                        })
                    }

                    // They completed their first upload successfully
                    localStorage.setItem('is_first_upload', 'false')
                    if(!this.state.is_first_upload){
                        this.setState({
                            show_upload_prompt: true
                        })
                        return <div className="text-center">
                            <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2"> <span className="pass-icon mr-2"/> Upload Successful </div>
                            <div className="upload-prompt-text">
                                Your skill is now available to test on your Alexa and the <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${this.SucceedLocale.replace('-', '_')}/`}
                                    target="_blank" rel="noopener noreferrer">
                                    Amazon console
                                </a>.
                            </div>
                        </div>
                    } else {
                        return <React.Fragment>
                            <img src="/images/clipboard-icon.svg" alt="Success" height="160" />
                            <br />
                            <div className="d-flex align-items-center justify-content-center mb-2"> <span className="pass-icon mr-2"/> Upload Successful </div>
                            <span className="modal-txt text-center">
                                You may test on the Alexa simulator or live on your personal Alexa device
                            </span>
                            <Alert className="w-75 mb-1 mt-3 text-center"><b>Alexa,</b> open {this.props.skill.inv_name}</Alert>
                            <div className="my-3">
                                <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${this.SucceedLocale.replace('-', '_')}/`}
                                    className="purple-btn mr-2" target="_blank" rel="noopener noreferrer">
                                    Test on Alexa Simulator
                                </a>
                            </div>
                        </React.Fragment>
                    }
                } else {
                    return <React.Fragment>
                        <img src="/images/clipboard-icon.svg" alt="Success" height="160" />
                        <br />
                        <span className="modal-bg-txt text-center mb-2"> <span className="pass-icon"/> Successfully uploaded to Alexa </span>
                        <span className="modal-txt text-center">
                            You may test on the Alexa simulator or live on your personal Alexa device
                        </span>
                        <div className="my-3">
                            <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${this.props.skill.locales[0].replace('-', '_')}/`}
                                className="purple-btn mr-2" target="_blank" rel="noopener noreferrer">
                                Test on Alexa Simulator
                            </a>
                        </div>
                    </React.Fragment>
                }
            case 4:
                return <Alert color={"danger" + (this.state.show_upload_prompt ? " mb-0 w-100" : "")}>
                    <span className="fail-icon"/>  Rendering Error
                </Alert>
            case 5:
                return <div className={"modal-txt flex-fill text-center mt-3" + (this.state.show_upload_prompt? " w-100" : "") }>
                    {this.state.amzn_error && <Alert color="danger"><span className="fail-icon"/> Login With Amazon Failed - Try Again</Alert>}
                    Login with Amazon to test your skill on your own Alexa device, or in the Alexa developer console
                    <div className="text-center mt-4">
                        <AmazonLogin
                            updateLogin={(stage) => {
                                if (stage === 2) {
                                    this.token = true;
                                    this.checkVendor();
                                } else if (1) {
                                    this.setState({ stage: 8})
                                } else {
                                    this.setState({ stage: 0, amzn_error: true});
                                }
                            }}
                            small
                        />
                    </div>
                </div>
            case 6:
                return <div className={this.state.show_upload_prompt? "mt-3 text-center" : ""}>
                    Your Amazon Account needs to set up developer settings to Upload Skills
                    <Alert className="mt-4">
                        Press "Create your Amazon Developer account"
                        and sign up with the same email as your Amazon Account.
                    </Alert>
                    <div className="my-3">
                        <a href="https://developer.amazon.com/login.html" className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
                            Developer Sign Up
                        </a>
                        <Button color="clear" onClick={this.checkVendor}>
                            <i className="fas fa-sync-alt" /> Check Again
                        </Button>
                    </div>
                </div>
            case 7:
                return loading('Checking Vendor')
            case 8:
                return loading('Verifying Login')
            case 9:        
                return <div className={"w-100" + (this.state.show_upload_prompt? " text-center" : "")}>
                    <div className="d-flex align-items-center jusitfy-content-center"><span className="fail-icon mr-2"/>Amazon Error Response</div>
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
                            html={(<React.Fragment>Alexa listens for the Invocation Name<br /> to launch your skill<br /> e.g. <i>Alexa, open <b>Invocation Name</b></i></React.Fragment>)}
                            position="bottom"
                        >
                            <i className="fal fa-question-circle" />
                        </Tooltip>
                    </div>
                    <input className="form-control" value={this.state.inv_name} placeholder='Invocation Name' onChange={(e) => this.setState({ inv_name: e.target.value, inv_name_error: invNameError(e.target.value, this.props.skill.locales) })} />
                    <small className={"text-blue" + (this.state.flash ? ' blink' : '')}>{this.state.inv_name_error}</small>
                    <div className="super-center mt-4-5 mb-3">
                        <button className="purple-btn" onClick={this.updateAlexa}>Continue</button>
                    </div>
                </div>
            default:
                return <div>
                    <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload" />
                    <div className="modal-bg-txt text-center mt-2"> Upload your skill for testing</div>
                    <div className="modal-txt text-center mt-2"> Updating to Alexa will allow you to test on your Alexa device or the Alexa Developer Console</div>
                    <div className="super-center mb-3 mt-3">
                        <button className="purple-btn" onClick={this.updateAlexa}>Continue</button>
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
                    <p className="loading">{GOOGLE_STAGES[this.state.google_stage]}</p>
                </div>
            </div>
        } else if (this.state.google_stage === 5) {
            // Track upload on first session
            if(localStorage.getItem('is_first_session') === 'true'){
                axios.post('/analytics/track_first_session_upload')
                .then(() => {
                    localStorage.setItem('is_first_session', 'false')
                })
                .catch(err => {
                    localStorage.setItem('is_first_session', 'false')
                    console.log(err)
                })
            }

            // They completed their first upload successfully
            localStorage.setItem('is_first_upload', 'false')
            if(!this.state.is_first_upload){
                this.setState({
                    show_upload_prompt: true
                })
                modal_content = <div className="text-center mt-4">
                    <span className="modal-bg-txt text-center mb-2"> <span className="pass-icon mr-2"/>Upload Successful </span><br/>
                    <span className="modal-txt text-center">
                        You may test on the <a href={`https://console.actions.google.com/u/${this.props.skill.google_publish_info.google_link_user || '0'}/project/${this.state.project_id}/simulator`}
                            target="_blank" rel="noopener noreferrer">
                            Google Actions Simulator
                    </a>. To submit for review, please follow the instructions on the Google Actions Developer Console.
                </span>
                </div>
            } else {
                modal_content = <React.Fragment>
                    <img src="/images/clipboard-icon.svg" alt="Success" height="160" />
                    <br />
                    <span className="modal-bg-txt text-center mb-2"> Successfully uploaded to Google Actions </span>
                    <span className="modal-txt text-center">
                        You may test on the Google Actions Simulator. To submit for review, please follow the instructions on the Google Actions Developer Console.
                </span>
                    <div className="my-3">
                        <a href={`https://console.actions.google.com/u/${this.props.skill.google_publish_info.google_link_user || '0'}/project/${this.state.project_id}/simulator`}
                            className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
                            Test on Google Actions Simulator
                    </a>
                    </div>
                </React.Fragment>
            }
        } else {
            modal_content = <div>
                <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload" />
                <div className="modal-bg-txt text-center mt-2"> Upload your skill for testing</div>
                <div className="modal-txt text-center mt-2"> Updating to Google will allow you to test on your Google device or the Google Actions Console.</div>
                {(this.props.skill.live || this.props.skill.review) && <hr />}
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
        const link = `https://creator.getvoiceflow.com/preview/${this.props.skill.skill_id}/${this.props.diagram_id}`
        return (
            <React.Fragment>
                <Modal isOpen={this.state.updateModal && this.state.is_first_upload} toggle={this.toggleUpdate} onClosed={this.reset} className="stage_modal">
                    <ModalHeader toggle={this.toggleUpdate}>Update Skill</ModalHeader>
                    <ModalBody className="modal-info">
                        <div>
                            {this.props.platform === 'google' ?
                                ![0].includes(this.state.google_stage) && !ENDING_STAGES.google.includes(this.state.google_stage) && <div className="mb-2">
                                    <Progress type="circle" strokeWidth={5} theme={{default: {color: '#42a5ff'}}} percent={STAGE_PERCENTAGES.google[this.state.google_stage]}/>
                                </div>
                                :
                                ![0, 5, 6, 7, 8].includes(this.state.stage) && !ENDING_STAGES.alexa.includes(this.state.stage) && <div className="mb-2">
                                    <Progress type="circle" strokeWidth={5} theme={{default: {color: '#42a5ff'}}} percent={STAGE_PERCENTAGES.alexa[this.state.stage]}/>
                                </div>
                            }
                            {(this.props.platform === 'google') ? this.renderGoogleBody() : this.render_body()}
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.updateLiveModal} toggle={this.toggleUpdateLive} onClosed={() => { this.setState({ live_update_stage: 0 }) }} className="stage_modal">
                    <ModalHeader toggle={this.toggleUpdateLive}>Update Live Version</ModalHeader>
                    <ModalBody className="modal-info">
                        <div>
                            {this.renderLiveStage()}
                        </div>
                    </ModalBody>
                </Modal>

                <div id="middle-group">
                    <Tooltip
                        distance={16}
                        title={(this.props.platform === 'google') ? "Switch to Amazon View" : "Switch to Google View"}
                        position="bottom"
                        className="switch switch-blue mr-4"
                        tag='div'
                    >
                        <input onClick={() => { if (this.props.platform !== 'alexa') this.props.toggleGoogle() }} type="radio" className={`switch-input ${this.props.platform === 'alexa' ? 'checked' : ''}`} value="alexa_toggle" id="alexa_toggle" />
                        <label className="switch-label switch-label-on mt-2" htmlFor="alexa_toggle">Alexa</label>
                        <input onClick={() => { if (this.props.platform !== 'google') this.props.toggleGoogle() }} type="radio" className={`switch-input ${this.props.platform === 'google' ? 'checked' : ''}`} value="google_toggle" id="google_toggle" />
                        <label className="switch-label switch-label-off mt-2" htmlFor="google_toggle">Google</label>
                        <span className="switch-selection"></span>
                    </Tooltip>
                </div>

                <div className="title-group no-select">
                    <div className="align-icon">
                        <Tooltip
                            distance={16}
                            title={this.props.lastSave}
                            position="bottom"
                            className="mr-4"
                        >
                            <button id="icon-save" className={`${this.props.saved ? 'nav-btn btn-successful' : 'nav-btn unsaved'} ${this.props.saving ? 'saving' : ''}`} onClick={this.props.onSave}>
                                {this.props.saving && <span className="save-loader" />}
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
                            <PopoverBody style={{ minWidth: '260px' }}>
                                <div className="space-between">
                                    <label>Allow preview sharing</label>
                                    <Toggle
                                        checked={this.state.allowPreview}
                                        disabled={this.state.togglingPreview}
                                        icons={false}
                                        onChange={this.togglePreview}
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
                                                <i className="fas fa-copy" />
                                            </ClipBoard>
                                        </InputGroupAddon>
                                        <Input readOnly value={link} className="form-control-border right" />
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
                            <button className="nav-btn" onClick={this.props.onTest}><i className="far fa-play" /></button>
                        </Tooltip>
                    </div>

                    {this.renderUploadButton()}
                    {this.displayUploadPrompt()}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    skill: state.skills.skill,
    platform: state.skills.skill.platform,
})

const mapDispatchToProps = dispatch => {
    return {
        updateSkill: (type, val) => dispatch(updateSkill(type, val))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActionGroup);

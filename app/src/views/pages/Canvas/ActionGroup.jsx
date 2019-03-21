import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { updateSkill } from './../../../actions/skillActions'
import { setError } from 'actions/modalActions'
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
import Confetti from 'react-dom-confetti'

import AuthenticationService from './../../../services/Authentication'
import InvRegex from 'services/Regex'
// import { timingSafeEqual } from 'crypto';

import './ActionGroup.css'

const loading = (message) => {
    return <div className="super-center mb-2">
        <div className='text-center'>
            <p className="mb-0">{message}</p>
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

// USE AS REFERENCE
// const ALEXA_STAGES = {
//     "0": "Upload Skill",
//     "1": "Voiceflow Rendering",
//     "2": "Success",
//     "4": "Rendering Error",
//     "5": "Amazon Login",
//     "6": "Developer Account",
//     "7": "Check Vendor",
//     "8": "Verifying Login",
//     "9": "Amazon Error",
//     "11": "Uploading to Alexa",
//     "12": "Building Interaction Model",
//     "13": "Enable Skill",
//     "14": "Invocation Name",
// }

const SHOW_PROMPT_ALEXA = [4,5,6,9,14,2]

const STAGE_PERCENTAGES = {
    alexa: {
        1: [0, 5],
        11: [10, 49],
        12: [50, 95],
        13: [96, 100]
    },
    google: {
        3: [0, 59],
        4: [60, 98]
    }
}

// Loading without percentages
const LOADING_STAGES = {
  alexa: [7, 8],
  google: []
}

// const ERROR_STAGES = {
//   alexa: [4, 9],
//   google: [2]
// }

const ENDING_STAGES = {
  alexa: [2, 4, 9, 10],
  google: [2, 5]
}
const LAUNCH_PHRASES = ['launch', 'ask', 'tell', 'load', 'begin', 'enable']
const WAKE_WORDS = ['Alexa', 'Amazon', 'Echo', 'Skill', 'App']

const Video = (link, className) => {
    return <div className={`mt-3 rounded overflow-hidden ${className ? className : 'w-100'}`}>
        <video className="rounded w-100 overflow-hidden" controls>
            <source src={link} type="video/mp4"/>
        </video>
    </div>
}

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
    // localStorage.clear()
    super(props)

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
      is_error: false,
      should_pop_confetti: false,
      percentage: 0
    }

    this.toggle = this.toggle.bind(this)
    this.toggleShare = this.toggleShare.bind(this)
    this.togglePreview = this.togglePreview.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleGoogle = this.toggleGoogle.bind(this)
    this.toggleUpdateLive = this.toggleUpdateLive.bind(this)
    this.updateAlexa = this.updateAlexa.bind(this)
    this.openUpdate = this.openUpdate.bind(this)
    this.increment = this.increment.bind(this)
    this.openUpdateLive = this.openUpdateLive.bind(this)
    this.checkVendor = this.checkVendor.bind(this)
    this.reset = this.reset.bind(this)
    this.renderBody = this.renderBody.bind(this)
    this.renderAlexaBody = this.renderAlexaBody.bind(this)
    this.renderGoogleBody = this.renderGoogleBody.bind(this)
    this.updateGoogle = this.updateGoogle.bind(this)
    this.shouldReset = this.shouldReset.bind(this)
    this.updateAlexaStage = this.updateAlexaStage.bind(this)
    this.uploadSuccess = this.uploadSuccess.bind(this)
    this.closePrompt = this.closePrompt.bind(this)
    this.token = null
    this.updateLiveVersion = this.updateLiveVersion.bind(this)
    this.renderUploadButton = this.renderUploadButton.bind(this)
    this.isUploadLoading = this.isUploadLoading.bind(this)
    this.displayUploadPrompt = this.displayUploadPrompt.bind(this)

    // localStorage.setItem('is_first_session_' + window.user_detail.id, 'true')
  }

  componentDidMount() {
    AuthenticationService.AmazonAccessToken(token => {
        this.token = token;
        this.reset()
    })
    AuthenticationService.googleAccessToken(this.props.skill.skill_id).then(token => {
        this.google_token = token;
        this.reset()
    })
  }

  shouldReset() {
    if (ENDING_STAGES[this.props.platform].includes((this.props.platform === 'alexa' ? this.state.stage : this.state.google_stage))) {
      this.reset()
    }
  }

  openUpdate() {
    this.reset()
    if(this.timeout) clearInterval(this.timeout)
    if(this.state.is_first_upload){
      this.props.setCB(() => {
          this.setState({
              updateModal: true
          })
      })
      this.props.onSave()
    } else {
      this.setState({saving: true}, () => {
        this.props.setCB(() => {
          if(this.props.platform === 'alexa'){
              this.updateAlexa()
          } else {
              this.updateGoogle()
          }
          this.setState({saving: false})
        })
        this.props.onSave()
      })
    }
  }

  reset() {
    // TEST FIRST SESSION
    this.setState({
      percent: 1,
      amzn_error: false,
      stage: this.token ? 0 : 5,
      google_stage: this.google_token ? 2 : 0,
      is_first_upload: (localStorage.getItem('is_first_session_' + window.user_detail.id) !== 'false'),
      // // TESTING PURPOSES
      // saving: true,
      // show_upload_prompt: true,
      // stage: 2,
      // updateModal: true,
      // is_first_upload: true,
    })
  }

  uploadSuccess(platform='alexa', project_id){
    // Track upload on first session
    // They completed their first upload successfully
    if(platform === 'google'){
      this.setState({
          project_id: project_id || this.state.project_id
      })
      this.updateGoogleStage(5)
    }else{
      this.updateAlexaStage(2)
    }
    if(localStorage.getItem('is_first_session_' + window.user_detail.id) !== 'false'){
      localStorage.setItem('is_first_session_' + window.user_detail.id, 'false')
      setTimeout(()=>this.setState({should_pop_confetti: true}), 300)
      axios.post('/analytics/track_first_session_upload')
    }
  }

  increment(limit){
    if(this.state.percent <= limit){
      this.setState({percent: this.state.percent + 1})
      this.loading_timeout = setTimeout(()=>this.increment(limit), 250)
    }
  }

  updateAlexaStage(stage, cb, props) {
      if(SHOW_PROMPT_ALEXA.includes(stage)) this.showUploadPrompt()
      // if(!this.state.is_first_upload){
      //   if((ERROR_STAGES[this.props.platform].includes(stage) || stage === 2) && !this.timeout){
      //     this.timeout = setTimeout(() => {
      //       this.setState({show_upload_prompt: false})
      //       this.reset()
      //       this.timeout = null
      //     }, 8000)
      //   }
      // }
      if(STAGE_PERCENTAGES.alexa[stage]){
        let range = STAGE_PERCENTAGES.alexa[stage]
        if(this.loading_timeout) clearTimeout(this.loading_timeout)
        this.setState({percent: range[0]})
        this.increment(range[1])
      }
      this.setState({
          ...props,
          stage: stage,
      }, cb)
  }

  updateGoogleStage(stage) {
    if([2,5].includes(stage) && !this.state.is_first_upload){
      this.showUploadPrompt()
      this.timeout = setTimeout(() => {
        this.setState({show_upload_prompt: false})
        this.reset()
        this.timeout = null
      }, 8000)
    }
    if(STAGE_PERCENTAGES.google[stage]){
      let range = STAGE_PERCENTAGES.google[stage]
      if(this.loading_timeout) clearTimeout(this.loading_timeout)
      this.setState({percent: range[0]})
      this.increment(range[1])
    }
    this.setState({
      google_stage: stage
    })
  }

  openUpdateLive() {
    this.setState({
      updateLiveModal: true
    })
    this.props.onSave()
  }

  checkVendor() {
      this.updateAlexaStage(7)

      axios.get('/session/vendor')
      .then(() => {
          this.updateAlexaStage(0)
      })
      .catch(err => {
          this.updateAlexaStage(6)
      });
  }

  async enableSkill(locale) {
      this.updateAlexaStage(13)
      try {
          await axios.put(`/interaction_model/${this.props.skill.amzn_id}/enable`)
          this.SucceedLocale = locale
      } catch (err) {
          console.error(err)
      }
      this.uploadSuccess()
  }

  checkInteractionModel() {
      this.updateAlexaStage(12)
      this.SucceedLocale = null
      const iterate = (depth) => {
          // wait up to 20 seconds
          if (depth === 20) {
              this.uploadSuccess()
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
                          this.uploadSuccess()
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
          this.setState({ inv_name: inv_name, inv_name_error: error, flash: true}, () => {
              this.updateAlexaStage(14)
              setTimeout(() => this.setState({ flash: false }), 1500)
          })
          return
      }
      this.updateAlexaStage(1)
      if (this.state.stage === 14) {
          this.updateAlexaStage(1)
          try {
              await axios.patch(`/skill/${this.props.skill.skill_id}?inv_name=1`, { inv_name: this.state.inv_name })
              this.props.updateSkill('inv_name', this.state.inv_name)
          } catch (err) {
              this.updateAlexaStage(9, undefined, {upload_error: 'Unable to save Invocation Name'})
              return
          }
      }
      axios.post(`/diagram/${this.props.skill.diagram}/${this.props.skill.skill_id}/publish`, { platform: 'alexa' })
          .then(res => {
              let new_version_data = res.data
              this.updateAlexaStage(11, () => {
                  axios.post(`/skill/${new_version_data.new_skill.skill_id}/publish`)
                      .then(res => {
                          this.props.updateSkill('amzn_id', res.data)
                          this.checkInteractionModel()
                      })
                      .catch(err => {
                          if (err.status === 403 || err.response.status === 403) {
                              // No Vendor ID/Amazon Developer Account
                              this.updateAlexaStage(6)
                          } else if(err.status === 401 || err.response.status === 401) {
                              this.updateAlexaStage(5)
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
                              this.updateAlexaStage(9, undefined, {
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
              this.updateAlexaStage(4)
          })
  }

  updateGoogle() {
    const s = this.state
    const p = this.props

    if (s.google_stage === 0 || s.google_stage === 1 || !p.skill.google_publish_info || !p.skill.google_publish_info.project_id) {
        p.history.push(`/publish/${p.skill.skill_id}/google`)
        return
    }

    this.updateGoogleStage(3)

    axios.post(`/diagram/${p.skill.diagram}/${p.skill.skill_id}/publish`, { platform: 'google', project_id: p.skill.google_publish_info.project_id })
    .then(res => {
      this.updateGoogleStage(4)
      let new_version_data = res.data
      axios.post(`/skill/${new_version_data.new_skill.skill_id}/publishgoogle`)
          .then(res => {
              // They completed their first upload successfully
              this.uploadSuccess('google', res.data.project_id)
          })
          .catch(err => {
              this.setState({
                updateModal: false
              })
              this.updateGoogleStage(2)
              const error_msg = err.response && err.response.data ? err.response.data : err
              p.setError(error_msg)
          })
    })
    .catch(err => {
        p.setError(err)
    })
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
    })
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
          this.props.setError('Unable to toggle preview')
      })
    })
  }

  toggleShare() {
    this.setState({
        share: !this.state.share
    })
  }

  showUploadPrompt(){
    this.setState({
        show_upload_prompt: !this.state.is_first_upload 
    })
  }

  closePrompt(){
    this.setState({show_upload_prompt: false})
    if(!this.isUploadLoading()){
      this.reset()
    }
  }

  displayUploadPrompt() {
    if(this.state.show_upload_prompt){
      return  <div className="upload-success-popup">
          {this.renderBody(false)}
          <button className="close close-upload-success-popup" onClick={this.closePrompt}>&times;</button>
      </div>
    } 
    return
  }

  isUploadLoading(){
    if(this.state.saving) return true
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
              this.props.setError('Error updating live version')
          })
  }

  toggleGoogle() {
      let platform = this.props.platform === 'google' ? 'alexa' : 'google'
      this.props.updateSkill('platform', platform).then(() => {
          this.props.updateGoogleFade();
          this.props.updateLinter()
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
          return <div className="pb-4 mb-2">
            <div className={"text-center my-3"}>
              <div className="loader text-lg"/>
            </div>
            {loading('Rendering Flows')}
          </div>
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
              return <Button variant="contained" className="publish-btn publish-btn-disabled" onClick={()=>this.setState({show_upload_prompt: !this.state.show_upload_prompt})}>
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

  renderBody(modal) {
    if(this.state.saving){
      return <React.Fragment>
        <div className={"mb-3 text-center" + (modal ? '' : ' mt-3')}>
          <Progress type="circle" strokeWidth={5} theme={{default: {color: '#42a5ff'}}} percent={this.state.percent}/>
        </div>
        {loading('Saving Project')}
      </React.Fragment>
    }else if(this.props.platform === 'google'){
      return <React.Fragment>
        {![0].includes(this.state.google_stage) && !ENDING_STAGES.google.includes(this.state.google_stage) && 
        <div className={"mb-3 text-center" + (modal ? '' : ' mt-3')}>
          <Progress type="circle" strokeWidth={5} theme={{default: {color: '#42a5ff'}}} percent={this.state.percent}/>
        </div>}
        {this.renderGoogleBody(modal)}
      </React.Fragment>
    }else{
      return <React.Fragment>
        {(STAGE_PERCENTAGES.alexa[this.state.stage] && 
        <div className={"mb-3 text-center" + (modal ? '' : ' mt-3')}>
          <Progress type="circle" strokeWidth={5} theme={{default: {color: '#42a5ff'}}} percent={this.state.percent}/>
        </div>) || 
        (LOADING_STAGES.alexa.includes(this.state.stage) && <div className={"text-center mb-3" + (modal ? '' : ' mt-3')}><div className="loader text-lg"></div></div>)}
        {this.renderAlexaBody(modal)}
      </React.Fragment>
    }
  }

  renderAlexaBody(modal) {
      // I had to get this out really fast the states are all REALLY fucking wack
      if (!this.props.skill.locales) {
          return null;
      }

      switch (this.state.stage) {
          case 1:
              return loading('Rendering Flows')
          case 2:
              const locale = (this.SucceedLocale || this.props.skill.locales[0] || 'en-US').replace('-', '_')

              if(!modal){
                  return <div className="text-center">
                      <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2"> <span className="pass-icon mr-2"/> Upload Successful </div>
                      <div className="upload-prompt-text">
                          Your skill is now available to test on your Alexa and the <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${locale}/`}
                              target="_blank" rel="noopener noreferrer">
                              Amazon console
                          </a>.
                      </div>
                  </div>
              } else {
                  return <React.Fragment>
                      <div className="d-flex align-items-center justify-content-center"> <span className="pass-icon mr-2"/> Upload Successful </div>
                      {Video('https://s3.amazonaws.com/com.getvoiceflow.videos/loomopt.mp4', 'w-90')}
                      <span className="modal-txt text-center mt-3">
                          You may test on the Alexa simulator or live on your personal Alexa device
                      </span>
                      {!!this.SucceedLocale && <Alert className="w-75 mb-1 mt-3 text-center"><b>Alexa,</b> open {this.props.skill.inv_name}</Alert>}
                      <div className="my-45">
                          <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.props.skill.amzn_id}/development/${locale}/`}
                              className="purple-btn mr-2 no-underline" target="_blank" rel="noopener noreferrer">
                              Test on Alexa Simulator
                          </a>
                      </div>
                  </React.Fragment>
              }
          case 4:
              return <Alert color={"danger mb-0 w-90"}>
                  <span className="fail-icon"/>  Rendering Error
              </Alert>
          case 5:
              return <div className={"modal-txt flex-fill text-center mb-4" + (modal ? " w-100" : " mt-4") }>
                  {this.state.amzn_error && <Alert color="danger"><span className="fail-icon"/> Login With Amazon Failed - Try Again</Alert>}
                  Login with Amazon to test your skill on your own Alexa device, or in the Alexa developer console
                  {modal && Video('https://s3.amazonaws.com/com.getvoiceflow.videos/first.mp4')}
                  <div className="text-center mt-4">
                      <AmazonLogin
                          updateLogin={(stage) => {
                              if (stage === 2) {
                                  this.token = true;
                                  this.checkVendor();
                              } else if (1) {
                                  this.updateAlexaStage(8)
                              } else {
                                  this.updateAlexaStage(0, undefined, {amzn_error: true})
                              }
                          }}
                          small
                      />
                  </div>
              </div>
          case 6:
              return <div className={"w-100 " + (modal? "text-center" : "")}>
                  <p><b>Looks like you don't have a developer account</b></p>
                  <div className="text-muted mb-4 margin-auto" style={{maxWidth: 350}}><b>Important:</b> Make sure to use the same email associated with your Amazon account.</div>
                  <hr className="full-width"/>
                  <div className={modal ? 'super-center mb-2' : ''}>
                      <a href="https://developer.amazon.com/login.html" className="purple-btn mr-3 no-underline d-inline-block mb-2" target="_blank" rel="noopener noreferrer">
                          Developer Sign Up
                      </a>
                      <Button color="clear" className="faux-purple-btn d-inline-block mb-2" onClick={this.checkVendor}>
                          <i className="fas fa-sync-alt" /> Check Again
                      </Button>
                  </div>
              </div>
          case 7:
              return loading('Checking Vendor')
          case 8:
              return loading('Verifying Login')
          case 9:        
              return <div className={"w-100" + (modal? " text-center" : "")}>
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
                  <div className="d-flex text-muted align-items-center">
                      <label className="mr-1">Invocation Name</label>
                      <Tooltip
                          html={(<React.Fragment>Alexa listens for the Invocation Name<br /> to launch your skill<br /> e.g. <i>Alexa, open <b>Invocation Name</b></i></React.Fragment>)}
                          position="bottom"
                      >
                          <i className="fal fa-question-circle" />
                      </Tooltip>
                  </div>
                  <input className="form-control" value={this.state.inv_name} placeholder='Invocation Name' onChange={(e) => this.setState({ inv_name: e.target.value, inv_name_error: invNameError(e.target.value, this.props.skill.locales) })} />
                  <small className={"text-blue" + (this.state.flash ? ' blink' : '')}>{this.state.inv_name_error}</small>
                  <div className="super-center mt-3 mb-2">
                      <button className="purple-btn" onClick={this.updateAlexa}>Continue</button>
                  </div>
              </div>
          default:
              if (this.state.is_first_upload) {
                  axios.post('/analytics/track_dev_account')
                      .catch(err => {
                          console.error(err)
                      })
              }
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

  renderGoogleBody(modal) {
      let modal_content = null
      if (
          this.state.google_stage === 3 ||
          this.state.google_stage === 4
      ) {
          modal_content = loading(GOOGLE_STAGES[this.state.google_stage])
      } else if (this.state.google_stage === 5) {
          if(!modal){
              modal_content = <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2"> <span className="pass-icon mr-2"/> Upload Successful </div>
                  <div className="upload-prompt-text">
                    You may test on the <a href={`https://console.actions.google.com/u/${this.props.skill.google_publish_info.google_link_user || '0'}/project/${this.state.project_id}/simulator`}
                            target="_blank" rel="noopener noreferrer">
                            Google Actions Simulator
                    </a>. To submit for review, please follow the instructions on the Google Actions Developer Console.
                  </div>
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
          if (this.state.is_first_upload) {
              axios.post('/analytics/track_dev_account')
                  .catch(err => {
                      console.error(err)
                  })
          }
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
              {this.state.updateModal && <div id="confetti-positioner">
                  <Confetti active={this.state.should_pop_confetti} config={{
                      angle: 90,
                      spread: 70,
                      startVelocity: 50,
                      elementCount: 75,
                      dragFriction: 0.05,
                      duration: 8000,
                      delay: 0
                  }}/>
              </div>}
              <Modal isOpen={this.state.updateModal && this.state.is_first_upload} toggle={()=>this.setState({updateModal: false})} onClosed={this.shouldReset} className="stage_modal">
                  <ModalHeader toggle={()=>this.setState({updateModal: false})} className="pb-0 mb--4"/>
                  <ModalBody className="modal-info" style={{padding: '1rem 2rem'}}>
                      <div>
                          {this.renderBody(true)}
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
                      <input onClick={() => { if (this.props.platform !== 'alexa') this.toggleGoogle() }} type="radio" className={`switch-input ${this.props.platform === 'alexa' ? 'checked' : ''}`} value="alexa_toggle" id="alexa_toggle" />
                      <label className="switch-label switch-label-on mt-2" htmlFor="alexa_toggle">Alexa</label>
                      <input onClick={() => { if (this.props.platform !== 'google') this.toggleGoogle() }} type="radio" className={`switch-input ${this.props.platform === 'google' ? 'checked' : ''}`} value="google_toggle" id="google_toggle" />
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
    diagram_id: state.skills.skill.diagram,
    live_mode: state.skills.live_mode,
})

const mapDispatchToProps = dispatch => {
    return {
        updateSkill: (type, val) => dispatch(updateSkill(type, val)),
        setError: err => dispatch(setError(err))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActionGroup);

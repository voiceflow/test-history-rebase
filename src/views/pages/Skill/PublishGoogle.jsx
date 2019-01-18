import React, { Component } from 'react'

import './Skill.css'
import AuthenticationService from '../../../services/Authentication'

import axios from 'axios'
import validUrl from 'valid-url'

import { Button, ButtonGroup, Form, FormGroup, Label, Input, Modal, ModalBody, Collapse } from 'reactstrap'
import MUIButton from '@material-ui/core/Button'
import Textarea from 'react-textarea-autosize'
import moment from 'moment'
import Image from '../../components/Uploads/Image'
import Multiple from '../../components/Forms/Multiple'
import ErrorModal from '../../components/Modals/ErrorModal'
import ConfirmModal from '../../components/Modals/ConfirmModal'
import Select from 'react-select'
import { GOOGLE_CATEGORIES } from '../../../services/Categories'

const _ = require('lodash');

const GOOGLE_PUBLISH_STAGES = {
  "-1": "Login Failed",
  "0": "Authenticate with Google",
  "1": "Verifying Google Auth Token",
  "2": "Privacy & Compliance",
  "3": "Rendering",
  "4": "Publishing",
  "5": "Developer Account",
  "6": "Checking Vendor",
  "7": "Submit For Review",
  "8": "Building and Submitting",
  "9": "Privacy & Compliance Ext.",
  "10": "Submitted for Review",
  "11": "Awaiting Review",
  "12": "Confirming Withdraw"
}

const DISALLOW_CHANGES_STAGES = new Set([11, 12])
class GooglePublish extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth_error: null,
      invocations: [],
      skill_id: this.props.skill.skill_id,
      stage: 1,
      loaded: false,
      publish_modal_open: false,
      google_token: ''
    }

    this.googleLogin = this.googleLogin.bind(this)
    this.googleLoginError = this.googleLoginError.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.togglePublish = this.togglePublish.bind(this)
    this.googleAuthTokenContent = this.googleAuthTokenContent.bind(this)
    this.verifyGoogleToken = this.verifyGoogleToken.bind(this)
    this.save = this.save.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
  }

  togglePublish() {
    this.setState({
      publish_modal_open: !this.state.publish_modal_open
    });
  }

  handleSelection(value) {
    this.setState({
      category: value
    });
  }

  componentDidMount() {
    try {
      AuthenticationService.googleAccessToken().then(token => {
        this.setState({
          stage: token ? 2 : 0
        });
      });
    } catch (e) {
      console.error('Error checking google access token', e)
    }

    axios.get(`/skill/google/${this.state.skill_id}`)
      .then(res => {
        if (!_.isObject(res.data.publish_info)) {
          const s = this.props.skill
          res.data.publish_info = {
            name: s.name,
            inv_name: s.inv_name,
            category: '',
            invocations: [''],
            summary: '',
            description: ''
          }
        }

        const publish_info = res.data.publish_info

        if (publish_info.category) {
          for (let option of GOOGLE_CATEGORIES) {
            if (option.value === publish_info.category) {
              publish_info.category = option;
              break;
            }
          };
        }

        if (publish_info.invocations && publish_info.invocations.value) {
          publish_info.invocations = publish_info.invocations.value;
        }

        if (!Array.isArray(publish_info.invocations) || publish_info.invocations.length === 0) {
          publish_info.invocations = ['']
        }

        if (publish_info.review) {
          publish_info.stage = 11;
        } else {
          delete publish_info.stage;
        }
        publish_info.privacy_policy = !_.isEmpty(publish_info.privacy_policy) ?
          publish_info.privacy_policy :
          window.location.protocol + '//' + window.location.host + '/creator/privacy_policy'

        // TODO: Antipattern, fix this when we do redux
        this.setState({
          loaded: true,
          ...publish_info,
          created: res.data.created
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    if (this.state.loaded) {
      this.save(true)
    }
  }

  save(publish = false, cb) {
    const s = this.state;
    const category = (s.category && s.category.value ? s.category.value : '')
    let split_keywords = s.keywords ? s.keywords.split(',') : []

    if (s.privacy_policy && !validUrl.isUri(s.privacy_policy)) {
      this.setState({
        error: 'Privacy policy must be a url'
      })
    } else if (s.terms_and_cond && !validUrl.isUri(s.terms_and_cond)) {
      this.setState({
        error: 'Terms and conditions must be a url'
      })
    } else if (split_keywords.length > 30) {
      this.setState({
        error: 'Limited to 30 keywords'
      })
    } else if (s.keywords && s.keywords.length - split_keywords.length + 1 > 500) {
      this.setState({
        error: 'The total length of all keywords must be less than or equal to 150'
      })
    } else {
      let store;

      if (publish === true) {
        store = {
          purchase: s.purchase,
          personal: s.personal,
          copa: s.copa,
          ads: s.ads,
          export: s.export,
          instructions: s.instructions
        }
      }
      axios.patch(`/skill/${this.state.skill_id}?google=true${publish === true ? '&publish=true' : ''}`, {
        name: s.name,
        inv_name: s.inv_name,
        summary: s.summary,
        description: s.description,
        keywords: s.keywords,
        invocations: s.invocations,
        small_icon: s.small_icon,
        large_icon: s.large_icon,
        category: category,
        locales: s.locales,
        privacy_policy: !_.isEmpty(s.privacy_policy) ?
          s.privacy_policy :
          window.location.protocol + '//' + window.location.host + '/creator/privacy_policy',
        terms_and_cond: s.terms_and_cond,
        ...store
      })
        .then(res => {
          // TODO: Antipattern, fix this when we do redux
          this.setState({
            saved: true
          });
          if (typeof (cb) === 'function') cb();
        })
        .catch(err => {
          console.log(err);
          this.setState({
            error: 'Save Error, updates not saved'
          });
        });
    }
  }

  handleChange(event) {
    if (this.state.stage !== 11) {
      this.setState({
        saved: false,
        [event.target.name]: event.target.value
      });
    }
  }

  async verifyGoogleToken() {
    this.setState({
      stage: 1
    })
    try {
      const res = await AuthenticationService.verifyGoogleToken(this.state.google_token)
    } catch (e) {
      this.setState({
        auth_error: e
      })
    }
  }

  async googleLogin(googleResp) {
    try {
      await AuthenticationService.googlePublishLogin({
        code: googleResp.code,
        creator_id: window.user_detail.id
      })
    } catch (e) {
      this.setState({
        auth_error: e.response.data
      })
    }
    return false;
  }

  googleLoginError(error) {
    this.setState({
      auth_error: error
    })
  }

  googleAuthTokenContent() {
    if (this.state.stage !== 0) {
      return null
    } else {
      return (
        <div>
          <FormGroup className="google-form-group">
            <div className="row">
              <div className="col-3 google-verification-info">
                <p className="mb-0 text-secondary"><b>Allow Voiceflow to Manage your Google Assistant projects</b> by <a href="https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=237807841406-o6vu1tjkq8oqjub8jilj6vuc396e2d0c.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Factions.builder&state=state" target="_blank" className="google-link">logging in</a> and pasting your authentication token here.</p>
              </div>
              <div className="col-9 vertical-space">
                <Input className="form-bg" type="text" name="google_token" placeholder="Paste your Google Authentication Token here" value={this.state.google_token} onChange={this.handleChange}/>
                <div className="subheader-right">
                  <button variant="contained" className="purple-btn google-verify-btn" onClick={this.verifyGoogleToken}>Verify Token <i className="fab fa-google ml-2" /></button>
                </div>
              </div>
            </div>
          </FormGroup>
        </div>
      )
    }
  }

  render() {
    let modal_content = null

    if (
      this.state.stage === 1 ||
      this.state.stage === 3 ||
      this.state.stage === 4 ||
      this.state.stage === 6 ||
      this.state.stage === 7
    ) {
      modal_content = <div>
        <h1><span className="loader" /></h1>
        <p className="loading">{GOOGLE_PUBLISH_STAGES[this.state.stage]}</p>
      </div>
    } else if (this.state.stage === 0) {
      modal_content = this.googleAuthTokenContent()
    }

    let googleConsoleUrl = `https://developer.amazon.com/alexa/console/ask/build/custom/${this.state.amzn_id}/development/en_US/dashboard`;

    if (!this.state.loaded) return <div className="super-center h-100 w-100">
      <div className='text-center'>
        <h1><span className="loader" /></h1>
        Getting Skill Status
      </div>
    </div>;

    return (
      <React.Fragment>
        <div className="subheader">
          <div className="container space-between">
            <span className="text-muted">
              <span className="text-secondary">{this.state.name}</span>{' '}
              <small> / created {moment(this.state.created).fromNow()}</small>
            </span>
            <div className="subheader-right">
              <button variant="contained" className="purple-btn" onClick={() => this.setState({ publish_modal_open: true })}>Publish Skill <i className="fab fa-google ml-2" /></button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.publish_modal_open}
          toggle={this.togglePublish}
          className="stage_modal"
          centered
          size="lg"
          onClosed={this.closePublish}>
          <ModalBody>
            <div className="d-flex justify-content-between" ref={this.privacyTop}>
              <b>{GOOGLE_PUBLISH_STAGES[this.state.stage]}</b> <button type="button" className="close" onClick={this.togglePublish}>&times;</button>
            </div>
            <div className="modal-info">
              {modal_content}
            </div>
          </ModalBody>
        </Modal>
        <ConfirmModal
          confirm={this.state.displayingConfirmWithdraw}
          toggle={this.toggleConfirmWithdraw}
        />
        <ErrorModal error={this.state.error} dismiss={() => this.setState({ error: null })} />

        <span className="container position-fixed bg-white mt-3 ml-2 mr-2 border p-3 pb-0 rounded" id="publish-status">
          <div className="row justify-content-center">
            <h3>Status</h3>
          </div>
          <hr className="mt-0"></hr>
          <div className="row">
            <div className="col-2">
              {this.state.name ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Display Name</p>
            </div>
          </div>
          <hr className="mt-0"></hr>
          <div className="row">
            <div className="col-2">
              {this.state.inv_name ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Invocation Name</p>
            </div>
          </div>
          <hr className="mt-0"></hr>
          <div className="row">
            <div className="col-2">
              {this.state.small_icon && this.state.large_icon ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Icons</p>
            </div>
          </div>
          <hr className="mt-0"></hr>
          <div className="row">
            <div className="col-2">
              {this.state.summary ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Summary</p>
            </div>
          </div>
          <hr className="mt-0"></hr>
          <div className="row">
            <div className="col-2">
              {this.state.description ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Description</p>
            </div>
          </div>
          <hr className="mt-0"></hr>
          <div className="row">
            <div className="col-2">
              {this.state.category ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Category</p>
            </div>
          </div>
          <hr className="mt-0"></hr>
          <div className="row">
            <div className="col-2">
              {this.state.invocations[0] ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Invocations</p>
            </div>
          </div>
        </span>

        <div className='subheader-page-container'>
          <div>
            <div className='container pt-3'>
              {this.state.live ?
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">This skill currently has a live version in production</h5>
                  </div>
                </div>
                : null}
              {this.state.google_id ?
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>This skill is linked on the Google Actions Console</span>
                    <b onClick={() => this.setState({ id_collapse: !this.state.id_collapse })} className="pointer">{this.state.id_collapse ? 'Hide' : 'More Info'} <span style={{ width: '9px', display: 'inline-block', textAlign: 'right' }}><i className={"fas fa-caret-left rotate" + (this.state.id_collapse ? " fa-rotate--90" : "")} /></span></b>
                  </div>
                  <Collapse isOpen={this.state.id_collapse}>
                    <hr />
                    <span>Skill ID | </span>
                    <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.state.amzn_id}/development/${this.state.locales[0].replace('-', '_')}/`} target="_blank" rel="noopener noreferrer">
                      <b>{this.state.amzn_id}</b>
                    </a>
                  </Collapse>
                </div>
                : null}
              {DISALLOW_CHANGES_STAGES.has(this.state.stage) ?
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">This skill is currently in review so you cannot edit it.</h5>
                    <div>
                      <MUIButton variant="contained" className="white-btn" href={googleConsoleUrl} target="_blank">Visit Dashboard</MUIButton>
                      <MUIButton variant="contained" className="purple-btn ml-3" onClick={this.toggleConfirmWithdraw}>Withdraw Skill</MUIButton>
                    </div>
                  </div>
                </div>
                : null}
              <Form>
                <FormGroup>
                  <div className="row">
                    <div className="col-3 publish-info"></div>
                    <div className="col-9">
                      <Label>Display Name *</Label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 publish-info">
                      <p className="mb-0 text-secondary"><b>Display Name</b> is what we display for your skill on Google Assistant</p>
                    </div>
                    <div className="col-9">
                      <Input className="form-bg" type="text" name="name" placeholder="Storyflow - Interactive Story Adventures" value={this.state.name} onChange={this.handleChange} />
                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="row">
                    <div className="col-3 publish-info"></div>
                    <div className="col-9">
                      <Label>Invocation Name *</Label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 publish-info">
                      <p className="mb-0 text-secondary"><b>Invocation Name</b> is what users will use to open your Skill. For example, "<i>Duck Tales</i>".</p>
                    </div>
                    <div className="col-9">
                      <Input className="form-bg" type="text" name="inv_name" placeholder="Enter an invocation name that begins an interaction with your skill" value={this.state.inv_name} onChange={this.handleChange} />
                    </div>
                  </div>
                </FormGroup>

                <div className="d-flex row">
                  <div className="col-3 publish-info">
                    <p className="text-secondary mt-5"><b>Icons</b> are what will be displayed for your Skill in the Google Assistant Store.</p>
                  </div>
                  <div className="col-9 d-flex">
                    <div>
                      <label className="mt-0">Small icon *</label>
                      <Image
                        className='icon-image small-icon'
                        path='/small_icon'
                        image={this.state.small_icon}
                        update={(url) => this.setState({ small_icon: url })} />
                    </div>
                    <div className="pl-3">
                      <label className="mt-0">Large icon *</label>
                      <Image
                        className='icon-image large-icon'
                        path='/large_icon'
                        image={this.state.large_icon}
                        update={(url) => this.setState({ large_icon: url })} />
                    </div>
                  </div>
                </div>

                <FormGroup className="mt-0">
                  <div className="row">
                    <div className="col-3 publish-info"></div>
                    <div className="col-9">
                      <Label>Summary *</Label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 publish-info">
                      <p className="text-secondary">
                        <b>Summary</b> is a one sentence description of your amazing Skill.
                          </p>
                    </div>
                    <div className="col-9">
                      <Input className="form-bg" type="text" name="summary" placeholder="One Sentence Skill Summary" value={this.state.summary} onChange={this.handleChange} />
                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="row">
                    <div className="col-3 publish-info"></div>
                    <div className="col-9">
                      <Label>Description *</Label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-3 publish-info">
                      <p className="text-secondary">
                        <b>Description</b> is where you can provide a more detailed explanation of your Skill.
                          </p>
                    </div>
                    <div className="col-9">
                      <Textarea
                        name="description"
                        className="form-control"
                        value={this.state.description}
                        onChange={this.handleChange}
                        minRows={3}
                        placeholder="Skill Description"
                      />
                    </div>
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="row">
                    <div className="col-3 publish-info"></div>
                    <div className="col-9">
                      <Label>Category *</Label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 publish-info">
                      <p className="text-secondary">
                        <b>Category</b> is the type of your Skill. This helps users find your Skill more easily so choose the category that best applies to you.
                          </p>
                    </div>
                    <div className="col-9">
                      <Select
                        className="input-select"
                        name="category"
                        value={this.state.category}
                        onChange={this.handleSelection}
                        options={GOOGLE_CATEGORIES}
                      />
                    </div>
                  </div>
                </FormGroup>


                <FormGroup className="mt-0">
                  <div className="row">
                    <div className="col-3 publish-info"></div>
                    <div className="col-9">
                      <Label>Invocations *</Label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 mt-3 publish-info">
                      <p className="text-secondary"><b>Invocations</b> are the various phrases that Google will detect to run your Skill.</p>
                    </div>
                    <div className="col-9">
                      <Multiple
                        className="mt-0 input-group-text"
                        list={this.state.invocations}
                        max={3}
                        prepend="Alexa,"
                        update={(list) => this.setState({ invocations: list, saved: false })}
                        placeholder={"open/start/launch " + this.state.name}
                        add={<span><i className="fas fa-plus" /> Add Invocation</span>}
                      />
                    </div>
                  </div>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default GooglePublish;
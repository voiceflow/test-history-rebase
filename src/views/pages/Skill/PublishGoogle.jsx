import React, { Component } from 'react'

import './Skill.css'
import AuthenticationService from '../../../services/Authentication'

import axios from 'axios'

import { Form, FormGroup, Label, Input, Modal, ModalBody, Collapse } from 'reactstrap'
import MUIButton from '@material-ui/core/Button'
import moment from 'moment'
import ErrorModal from '../../components/Modals/ErrorModal'
import ConfirmModal from '../../components/Modals/ConfirmModal'


const _ = require('lodash');

const GOOGLE_PUBLISH_STAGES = {
  "-1": "Login Failed",
  "0": "Authenticate with Google",
  "1": "Verifying Google Auth Token",
  "2": "Rendering",
  "3": "Publishing",
  "4": "Published",
  "5": "Review"
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
      google_token: '',
      project_id: '',
      name: this.props.skill.name
    }

    this.privacyTop = React.createRef();

    this.handleChange = this.handleChange.bind(this)
    this.togglePublish = this.togglePublish.bind(this)
    this.googleAuthTokenContent = this.googleAuthTokenContent.bind(this)
    this.verifyGoogleToken = this.verifyGoogleToken.bind(this)
    this.save = this.save.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.onPublishClicked = this.onPublishClicked.bind(this)
    this.publishedContent = this.publishedContent.bind(this)
  }

  togglePublish() {
    this.setState({
      publish_modal_open: !this.state.publish_modal_open
    });
  }

  scrollToTop() {
    this.privacyTop.current.scrollIntoView(true);
  }

  onPublish() {
    this.save(true, () => {

      let s = this.state;

      if (!s.project_id) {
        this.setState({
          publish_modal_open: false
        })
        this.props.onError('Please fill all required fields before publishing')
        this.scrollToTop();
        return;
      }

      this.setState({ stage: 2 });

      axios.post(`/diagram/${this.state.diagram}/${this.state.skill_id}/publish`)
        .then(res => {
          this.setState({ stage: 3 });
          let new_version_data = res.data
          axios.post(`/skill/${new_version_data.new_skill.skill_id}/publishgoogle`)
            .then(res => {
              this.setState({
                stage: 4,
                project_id: res.data.project_id || this.state.project_id
              });
            })
            .catch(err => {
              this.setState({
                stage: 2,
                publish_modal_open: false
              })
              const error_msg = err.response && err.response.data ? err.response.data : err
              this.props.onError(error_msg)
            })
        })
        .catch(err => {
          this.props.onError(err)
        })
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
          res.data.publish_info = {
            project_id: ''
          }
        }

        const publish_info = res.data.publish_info

        if (publish_info.review) {
          publish_info.stage = 5;
        } else {
          delete publish_info.stage;
        }

        // TODO: Antipattern, fix this when we do redux
        this.setState({
          loaded: true,
          ...publish_info,
          created: res.data.created,
          diagram: res.data.diagram
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

    axios.patch(`/skill/${this.state.skill_id}?platform=google${publish === true ? '&publish=true' : ''}`, {
      google_publish_info: {
        project_id: s.project_id
      }
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
      await AuthenticationService.verifyGoogleToken(this.state.google_token)
      this.onPublish()
    } catch (e) {
      this.setState({
        stage: 0
      })
      this.props.onError(e)
    }
  }

  onPublishClicked() {
    this.setState({
      publish_modal_open: true
    })
    if (this.state.stage === 2) {
      this.onPublish()
    }
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
                <p className="mb-0 text-secondary"><b>Allow Voiceflow to Manage your Google Assistant projects</b> by <a href="https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=237807841406-o6vu1tjkq8oqjub8jilj6vuc396e2d0c.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Factions.builder&state=state" target="_blank" rel="noopener noreferrer" className="google-link">logging in</a> and pasting your authentication token here.</p>
              </div>
              <div className="col-9 vertical-space">
                <Input className="form-bg" type="text" name="google_token" placeholder="Paste your Google Authentication Token here" value={this.state.google_token} onChange={this.handleChange} />
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

  publishedContent() {
    if (this.state.stage !== 4) {
      return null
    } else {
      return (
        <div>
          <img src="/images/preview.svg" alt="Success" height="160" />
          <br />
          Your Skill Has been uploaded to Google Actions!
        <span className="text-muted text-center">
            You may test on the Google Actions Simulator. To submit for review, please follow the instructions on the Google Actions Developer Console.
        </span>
          <div className="my-3">
            <a href={`https://console.actions.google.com/project/${this.state.project_id}/simulator`}
              className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
              Test on Google Actions Simulator
            </a>
          </div>
        </div>
      )
    }
  }

  render() {
    let modal_content = null

    if (
      this.state.stage === 1 ||
      this.state.stage === 2 ||
      this.state.stage === 3 ||
      this.state.stage === 6 ||
      this.state.stage === 7
    ) {
      modal_content = <div>
        <h1><span className="loader" /></h1>
        <p className="loading">{GOOGLE_PUBLISH_STAGES[this.state.stage]}</p>
      </div>
    } else if (this.state.stage === 0) {
      modal_content = this.googleAuthTokenContent()
    } else if (this.state.stage === 4) {
      modal_content = this.publishedContent()
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
              <button variant="contained" className="purple-btn" onClick={this.onPublishClicked}>Publish Skill <i className="fab fa-google ml-2" /></button>
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
              {this.state.project_id ?
                <i className="fal fa-check-circle text-success"></i>
                :
                <i className="fal fa-times-circle text-danger"></i>
              }
            </div>
            <div className="col-10">
              <p>Project ID</p>
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
              {this.state.published ?
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
                      <Label>Google Project ID *</Label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 publish-info">
                      <p className="mb-0 text-secondary">Your <b>Google Project ID</b> for publishing. Instructions can be found <a href="https://console.actions.google.com/u/0/" target="_blank" className="google-link" rel="noopener noreferrer">here</a></p>
                    </div>
                    <div className="col-9">
                      <Input className="form-bg" type="text" name="project_id" placeholder="Sample-Project-abc123" value={this.state.project_id} onChange={this.handleChange} />
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
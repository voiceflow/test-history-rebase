import React, { Component } from 'react'
import _ from 'lodash'
import axios from 'axios'
import { connect } from 'react-redux'
import validUrl from 'valid-url'
import Select from 'react-select'
import {
  ButtonGroup, Form,
  FormGroup, Label, Input, Modal,
  ModalBody, Alert, Collapse, Button
} from 'reactstrap'
import { Link } from "react-router-dom";

import DefaultButton from 'components/Button'
import RadioButtons, { YES_NO_RADIO_BUTTONS } from 'components/RadioButtons'
import Textarea from 'react-textarea-autosize'
import Image from '../../components/Uploads/Image'
import Multiple from '../../components/Forms/Multiple'
import AmazonLogin from '../../components/Forms/AmazonLogin'

import LOCALE_MAP from '../../../services/LocaleMap'
import { AMAZON_CATEGORIES } from '../../../services/Categories'

import { updateVersion, updateEntireVersion, updateSkillDB } from 'ducks/version'
import { setConfirm, setError } from 'ducks/modal'
import { AmazonAccessToken } from 'ducks/account'

import "./Skill.css";

const stage_title = {
  "-1": "Login Failed",
  "0": "Login Developer with Amazon",
  "1": "Verifying",
  "2": "Privacy & Compliance",
  "3": "Rendering",
  "4": "Publishing",
  "5": "Developer Account",
  "6": "Checking Vendor",
  "8": "Submit For Review",
  "7": "Building and Submitting",
  "9": "Privacy & Compliance Ext.",
  "10": "Submitted for Review",
  "11": "Awaiting Review",
  "12": "Confirming Withdraw"
}

const disabled_stages = new Set([11, 12]);

class Skill extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      dropdown: false,
      stage: 1,
      publish: false,
      id_collapse: false,
      amzn_id: null,
      stage_error: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.toggle = this.toggle.bind(this);
    this.togglePublish = this.togglePublish.bind(this);
    this.closePublish = this.closePublish.bind(this);
    this.save = this.save.bind(this);
    this.onRadio = this.onRadio.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);
    this.checkVendor = this.checkVendor.bind(this);
    this.onCertify = this.onCertify.bind(this);
    this.onLocaleBtnClick = this.onLocaleBtnClick.bind(this);
    // this.transferIcon = this.transferIcon.bind(this)
    this.privacyTop = React.createRef();
  }

  componentDidMount() {
    AmazonAccessToken().then(token => {
      this.setState({
        stage: token ? 2 : 0
      });
    })

    axios.get('/skill/' + this.props.skill_id + '?verbose=1&review_check=1')
      .then(res => {
        if (res.data.category) {
          for (let option of AMAZON_CATEGORIES) {
            if (option.value === res.data.category) {
              res.data.category = option;
              break;
            }
          };
        }

        if (res.data.invocations && res.data.invocations.value) {
          res.data.invocations = res.data.invocations.value;
        }

        if (!Array.isArray(res.data.invocations) || res.data.invocations.length === 0) {
          res.data.invocations = ['']
        }

        if (!res.data.keywords) {
          res.data.keywords = ''
        }

        if (res.data.review) {
          res.data.stage = 11;
        } else {
          delete res.data.stage;
        }
        res.data.privacy_policy = !_.isEmpty(res.data.privacy_policy) ? res.data.privacy_policy : ''

        // TODO: Antipattern, fix this when we do redux
        this.setState({
          loaded: true,
          ...res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onRadio(type, value) {
    this.setState({
      [type]: value
    })
  }

  handleError(err, default_error) {
    console.error(err);

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
      publish: false,
      stage: 2
    })
    this.props.setError(((
      err.response &&
      err.response.data &&
      err.response.data.message) ? error_message : default_error))
  }

  onWithdraw() {
    axios.post(`/amazon/${this.state.amzn_id}/withdraw`)
      .then(() => {
        this.setState({
          stage: 0,
          displayingConfirmWithdraw: false
        });
      })
      .catch(err => {
        this.handleError(err, 'Withdrawal Error');
        this.setState({
          stage: 11
        });
      });
  }

  onDelete() {
    axios.delete(`/skill/${this.props.skill_id}`)
      .then(() => {
        this.props.history.push('/dashboard');
      })
      .catch(err => {
        this.handleError(err, "Deletion Error");
        this.setState({
          stage: 0
        });
      });
  }

  onCertify() {
    this.setState({
      stage: 7
    });
    axios.post(`/amazon/${this.props.skill_id}/${this.state.amzn_id}/certify`)
      .then(() => {
        this.setState({
          stage: 11,
          publish: false
        });
      })
      .catch(err => {
        console.dir(err)
        let error_message = 'Certification Error \n'
        if (err.response && err.response.data && err.response.data.message) {
          error_message += err.response.data.message

          if (err.response.data.violations) {
            for (let i = 0; i < err.response.data.violations.length; i++) {
              error_message += '\n' + err.response.data.violations[i].message
            }
          }
        }
        this.handleError(err, error_message);
      });
  }

  scrollToTop() {
    this.privacyTop.current.scrollIntoView(true);
  }

  onPublish() {
    this.save(true, () => {
      let s = this.state;
      let category = (s.category && s.category.value ? s.category.value : null);
      // let fields = ['name', 'inv_name', 'summary', 'description', 'invocations', 'small_icon', 'large_icon', 'category']
      let fields = {
        name: 'Name',
        inv_name: 'Invocation Name',
        summary: 'Summary',
        description: 'Description',
        invocations: 'Invocations',
        small_icon: 'Small Icon',
        large_icon: 'Large Icon',
        category: 'Category'
      }
      let invalid_fields = Object.keys(fields).filter((field) => {
        if (field === 'invocations') {
          return !s.invocations[0]
        } else if (field === 'category') {
          return !category
        } else {
          return !s[field]
        }
      })
      invalid_fields = _.values(invalid_fields)
      if (invalid_fields.length > 0) {
        this.setState({
          stage: 2,
          stage_error: {
            stage: 2,
            message: `Please fill all required fields before publishing. Missing fields: ${invalid_fields.join(', ')}`
          }
        });
        this.scrollToTop();
        return;
      }
      if (!s.export) {
        this.setState({
          stage: 2,
          stage_error: {
            stage: 2,
            message: 'Please Certify Alexa Skill Import/Export in Privacy/Complicance'
          }
        });
        this.scrollToTop();
        return;
      }
      if (!s.instructions) {
        this.setState({
          stage: 2,
          stage_error: {
            stage: 2,
            message: 'Please Provide Testing Instructions'
          }
        });
        this.scrollToTop();
        return;
      }

      axios.post(`/project/${this.props.project_id}/render`, { platform: 'alexa' })
        .then(res => {
          this.setState({ stage: 4 });
          let new_version_data = res.data
          axios.post(`/project/${this.props.project_id}/version/${new_version_data.new_skill.skill_id}/alexa`)
            .then(res => {
              this.setState({
                stage: 8,
                amzn_id: res.data
              });
            })
            .catch(err => {
              if (err.status === 403 || err.response.status === 403) {
                // No Vendor ID/Amazon Developer Account	
                this.setState({
                  stage: 5
                });
              } else {
                this.handleError(err, 'Publishing Error');
              }
            })
        })
        .catch(err => {
          this.handleError(err, 'Rendering Error');
        })
    })
    this.setState({ stage: 3 });


  }

  checkVendor() {
    this.setState({ stage: 6 });

    axios.get('/session/vendor')
      .then(() => {
        this.setState({ stage: 2 });
      })
      .catch(err => {
        console.error(err);
        this.setState({ stage: 5 });
      });
  }

  componentWillUnmount() {
    if (this.state.loaded) {
      this.save(true)
    }
  }

  validateForm() {
    const s = this.state;
    let split_keywords = s.keywords.split(',')
    if (s.privacy_policy && !validUrl.isUri(s.privacy_policy)) {
      this.props.setError('Privacy policy must be a url')
    } else if (s.terms_and_cond && !validUrl.isUri(s.terms_and_cond)) {
      this.props.setError('Terms and conditions must be a url')
    } else if (split_keywords.length > 30) {
      this.props.setError('Limited to 30 keywords')
    } else if (s.keywords.length - split_keywords.length + 1 > 500) {
      this.props.setError('The total length of all keywords must be less than or equal to 150')
    } else {
      this.setState({ publish: true })
    }
  }

  save(publish = false, cb) {
    const s = this.state;
    const category = (s.category && s.category.value ? s.category.value : null)

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

    let properties = {
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
      privacy_policy: !_.isEmpty(s.privacy_policy) ? s.privacy_policy : '',
      terms_and_cond: s.terms_and_cond,
      ...store
    }

    if (!properties.name) {
      return this.props.setError('Publish Settings not Saved: No Project Name')
    }

    axios.patch(('/skill/' + this.props.skill_id + (publish === true ? '?publish=true' : '')), { ...properties, locales: JSON.stringify(properties.locales) })
      .then(res => {
        this.props.updateEntireSkill(properties)
        if (typeof cb === 'function') cb()
      })
      .catch(err => {
        console.log(err)
        this.props.setError('Save Error, Publish Settings not Saved')
      })
  }

  handleChange(event) {
    if (this.state.stage !== 11) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  }

  handleSelection(value) {
    this.setState({
      category: value
    });
  }

  toggle() {
    this.setState({
      dropdown: !this.state.dropdown
    });
  }

  togglePublish() {
    this.setState({
      publish: !this.state.publish
    });
  }

  closePublish() {
    if (this.state.stage === 1) {
      this.setState({
        stage: 0
      });
    }
  }

  onLocaleBtnClick(locale) {
    let locales = this.state.locales;
    if (locales.includes(locale)) {
      if (locales.length > 1) {
        _.remove(locales, (v) => { return v === locale })
      }
    } else {
      locales.push(locale)
    }
    this.setState({
      locales: locales
    })
  }

  // transferIcon(){
  //     if(this.state.large_icon){
  //         this.setState({
  //             small_icon: this.state.large_icon
  //         })
  //     }
  // }

  render() {
    // Success Screen
    if (this.state.stage === 10) {
      return <div className="super-center h-100">
        <div className="success-page d-flex">
          <div className="success-text">
            <h1>Congrats! <span role="img" aria-label="happy">☺️</span></h1>
            <p className="text-muted">
              Your skill has been successfully submitted for review to the Amazon Skill store. You will be updated on the status of your skill via email.
                        </p>
            <Link to="/dashboard">
              <DefaultButton isPrimary variant="contained">Dashboard</DefaultButton>
            </Link>
            <DefaultButton isWhite variant="contained" className="ml-3" onClick={() => this.setState({ stage: 2 })}>Return to Project</DefaultButton>
          </div>
          <img src="/images/success.svg" alt="success" />
        </div>
      </div>
    }

    let content;
    let alexaDashboardUrl = `https://developer.amazon.com/alexa/console/ask/build/custom/${this.state.amzn_id}/development/en_US/dashboard`;
    if (this.state.stage === 0 || this.state.stage === -1) {
      content = <div>
        {this.state.stage === -1 ?
          <Alert color="danger">Login With Amazon Failed - Try Again.</Alert> : null
        }
        <AmazonLogin
          updateLogin={(stage) => {
            if (stage === 2) {
              this.checkVendor();
            } else {
              this.setState({ stage: stage });
            }
          }}
        />
      </div>
    } else if (
      this.state.stage === 1 ||
      this.state.stage === 3 ||
      this.state.stage === 4 ||
      this.state.stage === 6 ||
      this.state.stage === 7
    ) {
      content = <div>
        <h1><span className="loader" /></h1>
        <p className="loading">{stage_title[this.state.stage]}</p>
      </div>
    } else if (this.state.stage === 2) {
      content = <div className="MUIform">
        {this.state.stage_error && this.state.stage_error.stage === 2 ?
          <Alert color="danger">{this.state.stage_error.message}</Alert> : null
        }
        {[{
          value: 'purchase',
          text: 'Does this skill allow users to make purchases or spend real money?'
        }, {
          value: 'personal',
          text: 'Does this Alexa skill collect users\' personal information?'
        }, {
          value: 'copa',
          text: 'Is this skill directed to or does it target children under the age of 13?'
        }, {
          value: 'ads',
          text: 'Does this skill contain advertising?'
        }, {
          value: 'export',
          text: "This Alexa skill may be imported to and exported from the United States and all other countries and regions in which Amazon operates their program or in which you've authorized sales to end users (without the need for us to obtain any license or clearance or take any other action) and is in full compliance with all applicable laws and regulations governing imports and exports, including those applicable to software that makes use of encryption technology.",
          buttons: [{
            id: true,
            label: 'I certify',
          }, {
            id: false,
            label: 'I do not certify'
          }]
        }].map((form, i) => {
          return (
            <div className="p-3 my-3 paper" key={i}>
              {form.text}
                <RadioButtons
                  buttons={form.buttons ? form.buttons : YES_NO_RADIO_BUTTONS}
                  checked={this.state[form.value]}
                  onChange={(val) => this.onRadio(form.value, val)}
                />
            </div>
          );
        })}
        <div className="p-3 my-3 paper">
          <Label>Testing Instructions</Label>
          <Textarea
            name="instructions"
            className="blank"
            value={this.state.instructions}
            onChange={this.handleChange}
            minRows={3}
            placeholder="Any Particular Testing Instructions for Amazon Approval Process"
          />
        </div>
        <DefaultButton isBtn isPrimary onClick={this.onPublish}>Submit to Alexa</DefaultButton>
      </div>
    } else if (this.state.stage === 5 || this.state.stage === 6) {
      content = <div>
        Your Amazon Account needs to set up developer settings to Upload Skills
                <Alert className="mt-4">
          Press "Create your Amazon Developer account"
          and sign up with the same email as your Amazon Account.
                </Alert>
        <div className="my-3">
          <a href="https://developer.amazon.com/login.html" className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
            Developer Sign Up
                    </a>
          <DefaultButton isClear onClick={this.checkVendor}>
            <i className="fas fa-sync-alt" /> Check Again
          </DefaultButton>
        </div>
      </div>
    } else if (this.state.stage === 8) {
      content = <div>
        <img src="/images/preview.svg" alt="Success" height="160" />
        <br />
        Your Skill Has been uploaded to Alexa Development!
                <span className="text-muted text-center">
          You may test on the Alexa Simulator or Submit your Skill for review
                </span>
        <div className="my-3">
          <a href={`https://developer.amazon.com/alexa/console/ask/test/${this.state.amzn_id}/development/${this.state.locales[0].replace('-', '_')}/`}
            className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer">
            Test on Alexa Simulator
                    </a>
          <DefaultButton isClear onClick={this.onCertify}>
            Submit for Review
          </DefaultButton>
        </div>
      </div>
    }

    if (!this.state.loaded) return <div className="super-center h-100 w-100">
      <div className='text-center'>
        <h1><span className="loader" /></h1>
        Getting Skill Status
                </div>
    </div>;
    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.publish}
          toggle={this.togglePublish}
          className="stage_modal"
          centered
          size="lg"
          onClosed={this.closePublish}>
          <ModalBody>
            <div className="d-flex justify-content-between" ref={this.privacyTop}>
              <b>{stage_title[this.state.stage]}</b>
              <DefaultButton isClose type="button" onClick={this.togglePublish} />
            </div>
            <div className="modal-info">
              {content}
            </div>
          </ModalBody>
        </Modal>

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
              {this.state.amzn_id ?
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>This skill is linked on Amazon Developer Console</span>
                    <div onClick={() => this.setState({ id_collapse: !this.state.id_collapse })} className="pointer">{this.state.id_collapse ? 'Hide' : 'More Info'} <span style={{ width: '9px', display: 'inline-block', textAlign: 'right' }}><i className={"fas fa-caret-left rotate" + (this.state.id_collapse ? " fa-rotate--90" : "")} /></span></div>
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
              {disabled_stages.has(this.state.stage) ?
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">This skill is currently in review so you cannot edit it.</h5>
                    <div>
                      <DefaultButton isWhite variant="contained" href={alexaDashboardUrl} target="_blank">Visit Dashboard</DefaultButton>
                      <DefaultButton isPrimary variant="contained" className="ml-3" onClick={() => {
                        this.props.onConfirm({
                          text: "Are you sure you want to withdraw this Skill?",
                          confirm: this.onWithdraw
                        })
                      }}>
                        Withdraw Skill
                      </DefaultButton>
                    </div>
                  </div>
                </div>
                : null}


              <Form>
                <div className="big-settings-alignment-div">
                  <div className="mb-3 mt-5"><label className="dark">Basic Skill Info</label></div>
                  <div className="big-settings-content">
                    <FormGroup>
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="mb-0 helper-text"><b>Display Name</b> is what we display for your Skill on Voiceflow/Amazon</p>
                        </div>
                        <div className="col-9 mb-4">
                          <Label className="publish-label">Display Name *</Label>
                          <Input className="form-bg" type="text" name="name" disabled={disabled_stages.has(this.state.stage)} placeholder="Storyflow - Interactive Story Adventures" value={this.state.name} onChange={this.handleChange} />
                        </div>
                      </div>
                    </FormGroup>

                    <div className="d-flex row mb-5">
                      <div className="col-3 publish-info">
                        <p className="helper-text mt-5"><b>Icons</b> are what will be displayed for your Skill in the Amazon web store.</p>
                      </div>
                      <div className="col-9 d-flex">
                        <div>
                          <Image
                            className='icon-image large-icon text-center mr-xl-5 mr-4'
                            isDisabled={disabled_stages.has(this.state.stage)}
                            path='/image/large_icon'
                            image={this.state.large_icon}
                            update={(url) => this.setState({ large_icon: url })}
                            title='Large Icon *' />
                        </div>
                        <div>
                          <Image
                            className='icon-image small-icon text-center'
                            isDisabled={disabled_stages.has(this.state.stage)}
                            path='/image/small_icon'
                            image={this.state.small_icon}
                            update={(url) => this.setState({ small_icon: url })}
                            title='Small Icon *' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="big-settings-alignment-div">
                  <div className="mb-4"><label className="dark">Skill Description</label></div>
                  <div className="big-settings-content">
                    <FormGroup className="mt-0">
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            <b>Summary</b> is a one sentence description of your amazing Skill.
                                            </p>
                        </div>
                        <div className="col-9 mb-4">
                          <Label className="publish-label">Summary *</Label>
                          <Input className="form-bg" type="text" name="summary" disabled={disabled_stages.has(this.state.stage)} placeholder="One Sentence Skill Summary" value={this.state.summary} onChange={this.handleChange} />
                        </div>
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            <b>Description</b> is where you can provide a more detailed explanation of your Skill.
                                            </p>
                        </div>
                        <div className="col-9 mb-4">
                          <Label className="publish-label">Description *</Label>
                          <Textarea
                            name="description"
                            className="form-control"
                            disabled={disabled_stages.has(this.state.stage)}
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
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            <b>Category</b> is the type of your Skill. This helps users find your Skill in the store.
                                            </p>
                        </div>
                        <div className="col-9 mb-4">
                          <Label className="publish-label">Category *</Label>
                          <Select
                            classNamePrefix="select-box"
                            name="category"
                            isDisabled={disabled_stages.has(this.state.stage)}
                            value={this.state.category}
                            onChange={this.handleSelection}
                            options={AMAZON_CATEGORIES}
                          />
                        </div>
                      </div>
                    </FormGroup>

                    <FormGroup className="mt-0">
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            <b>Keywords</b> are words that will help your Skill be found when users are searching the Skill store.
                                            </p>
                        </div>
                        <div className="col-9">
                          <Label className="publish-label">Keywords (Search Tags) <small>optional</small></Label>
                          <Input className="form-bg" type="text" name="keywords" disabled={disabled_stages.has(this.state.stage)} placeholder="Keywords (Separated By Commas) e.g. Game, Space, Adventure" value={this.state.keywords} onChange={this.handleChange} />
                        </div>
                      </div>
                    </FormGroup>
                  </div>
                </div>

                <div className="big-settings-alignment-div">
                  <div className="mb-4"><label className="dark">Skill Invocation</label></div>
                  <div className="big-settings-content">
                    <FormGroup>
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="mb-0 helper-text"><b>Invocation Name</b> is what users will use to open your Skill. For example, "<i>Tiny Tales</i>".</p>
                        </div>
                        <div className="col-9 mb-4">
                          <Label className="publish-label">Invocation Name *</Label>
                          <Input className="form-bg" type="text" name="inv_name" disabled={disabled_stages.has(this.state.stage)} placeholder="Enter an invocation name that begins an interaction with your skill" value={this.state.inv_name} onChange={this.handleChange} />
                        </div>
                      </div>
                    </FormGroup>

                    <FormGroup className="mt-0">
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text"><b>Invocations</b> are the various phrases that will open your Skill.</p>
                        </div>
                        <div className="col-9">
                          <Label className="publish-label">Invocations *</Label>
                          <Multiple
                            className="mt-0 input-group-text"
                            list={this.state.invocations}
                            max={3}
                            prepend="Alexa,"
                            update={(list) => this.setState({ invocations: list })}
                            isDisabled={disabled_stages.has(this.state.stage)}
                            placeholder={"open/start/launch " + this.state.name}
                            add={<span><i className="fas fa-plus" /> Add Invocation</span>}
                          />
                        </div>
                      </div>
                    </FormGroup>
                  </div>
                </div>

                <div className="big-settings-alignment-div">
                  <div className="mb-4"><label className="dark">Locales</label></div>
                  <div className="big-settings-content">

                    <FormGroup className="mt-0">
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            <b>Locale</b> determines your skill's availability. Your skill will be available in the regions you select here.
                                            </p>
                        </div>
                        <div className="col-9">
                          <Label className="publish-label">Location(s)</Label>
                          <ButtonGroup className="locale-button-group">
                            {LOCALE_MAP.map((locale, i) => {
                              const active = this.state.locales.includes(locale.value) ? "active" : "";
                              return (
                                <Button
                                  outline
                                  color="primary"
                                  className={`locale-button ${active}`}
                                  key={i}
                                  onClick={() => {
                                    this.onLocaleBtnClick(
                                      locale.value
                                    );
                                  }}
                                >
                                  {locale.name}
                                </Button>
                              );
                            })}
                          </ButtonGroup>
                        </div>
                      </div>
                    </FormGroup>
                  </div>
                </div>

                <div className="big-settings-alignment-div">
                  <div className="mb-4"><label className="dark">Privacy and Terms</label></div>
                  <div className="big-settings-content">
                    <FormGroup>
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            The <b>privacy policy url</b> is a link to the privacy policy your users will agree to when using your Skill.
                                            </p>
                        </div>
                        <div className="col-9 mb-4">
                          <Label className="publish-label">Privacy Policy URL</Label>
                          <Input className="form-bg" type="text" name="privacy_policy" disabled={disabled_stages.has(this.state.stage)} placeholder="Privacy Policy" value={this.state.privacy_policy} onChange={this.handleChange} />
                        </div>
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            The <b>terms and conditions url</b> is a link to the terms and conditions your users will agree to when using your Skill.
                                            </p>
                        </div>
                        <div className="col-9 mb-4">
                          <Label className="publish-label">Terms and Conditions URL</Label>
                          <Input className="form-bg" type="text" name="terms_and_cond" disabled={disabled_stages.has(this.state.stage)} placeholder="Terms and Conditions" value={this.state.terms_and_cond} onChange={this.handleChange} />
                        </div>
                      </div>
                    </FormGroup>
                  </div>
                </div>
              </Form>
              <div className="text-center">
                {disabled_stages.has(this.state.stage) ?
                  null :
                  <Button
                    isPrimary
                    variant="contained"
                    onClick={() => {
                      this.validateForm()
                    }}
                  >
                    Publish Skill
                                    <i className="fab fa-amazon ml-2" />
                  </Button>
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  skill_id: state.skills.skill.skill_id,
  project_id: state.skills.skill.project_id
})
const mapDispatchToProps = dispatch => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    updateEntireSkill: (val) => dispatch(updateEntireVersion(val)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: err => dispatch(setError(err)),
    save: (publish, cb) => dispatch(updateSkillDB(publish, cb))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Skill);

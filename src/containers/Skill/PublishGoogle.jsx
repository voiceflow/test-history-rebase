import './Skill.css';

import axios from 'axios';
import DefaultButton from 'components/Button';
import GoogleAuth from 'components/Modals/GoogleAuthenticationModalContent';
import { ModalHeader } from 'components/Modals/ModalHeader';
import { dialogflowToken, googleAccessToken, verifyGoogleToken } from 'ducks/account';
import { setConfirm, setError } from 'ducks/modal';
import * as _ from 'lodash';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Alert, Button, ButtonGroup, Collapse, Form, FormGroup, Input, Label, Modal, ModalBody } from 'reactstrap';

import { GOOGLE_LOCALES } from 'Constants';

const MAX_SIZE = 10 * 1024 * 1024;

const L = GOOGLE_LOCALES;
const LOCALE_DISPLAY_NAMES = {
  [L.HK]: 'Chinese-Cantonese (zh-HK)',
  [L.CN]: 'Chinese-Simplified (zh-CN)',
  [L.TW]: 'Chinese-Traditional (zh-TW)',
  [L.DA]: 'Danish (da)',
  [L.NL]: 'Dutch (nl)',
  [L.EN]: 'English (en)',
  [L.FR]: 'French (fr)',
  [L.DE]: 'German (de)',
  [L.HI]: 'Hindi (hi)',
  [L.ID]: 'Indonesian (id)',
  [L.IT]: 'Italian (it)',
  [L.JA]: 'Japanese (ja)',
  [L.KO]: 'Korean (ko)',
  [L.NO]: 'Norwegian (no)',
  [L.PL]: 'Polish (pl)',
  [L.PT]: 'Portuguese (pt)',
  [L.BR]: 'Portuguese-Brazilian (pt-BR)',
  [L.RU]: 'Russian (ru)',
  [L.ES]: 'Spanish (es)',
  [L.SV]: 'Swedish (sv)',
  [L.TH]: 'Thai (th)',
  [L.TR]: 'Turkish (tr)',
  [L.UK]: 'Ukranian (uk)',
};

const FORMATTED_LOCALES = Object.keys(GOOGLE_LOCALES).map((key) => {
  return { value: GOOGLE_LOCALES[key], name: LOCALE_DISPLAY_NAMES[GOOGLE_LOCALES[key]] };
});

const GOOGLE_PUBLISH_STAGES = {
  '-1': 'Login Failed',
  0: 'Last step: Authenticate with Google Actions',
  1: 'Last step: Authenticate with Google Actions',
  2: 'Rendering',
  3: 'Publishing',
  4: 'Published',
  5: 'Review',
};

const DISALLOW_CHANGES_STAGES = new Set([11, 12]);
class GooglePublish extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth_error: null,
      invocations: [],
      stage: 1,
      loaded: false,
      publish_modal_open: false,
      google_token: '',
      google_id: '',
      name: this.props.skill.name,
      credentials: false,
      locales: [],
      main_locale: null,
      uploaded: false,
    };

    this.privacyTop = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.togglePublish = this.togglePublish.bind(this);
    this.googleAuthTokenContent = this.googleAuthTokenContent.bind(this);
    this.verifyGoogleToken = this.verifyGoogleToken.bind(this);
    this.save = this.save.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.onPublishClicked = this.onPublishClicked.bind(this);
    this.publishedContent = this.publishedContent.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.unlinkGoogle = this.unlinkGoogle.bind(this);
    this.onUnlinkClick = this.onUnlinkClick.bind(this);
  }

  togglePublish() {
    this.setState({
      publish_modal_open: !this.state.publish_modal_open,
    });
  }

  scrollToTop() {
    this.privacyTop.current.scrollIntoView(true);
  }

  onPublish() {
    this.save(true, () => {
      const s = this.state;

      if (!s.google_id) {
        this.setState({
          publish_modal_open: false,
        });
        this.props.setError('Please fill all required fields before publishing');
        this.scrollToTop();
        return;
      }

      this.setState({ stage: 2 });

      axios
        .post(`/project/${this.props.project_id}/render`, { platform: 'google', google_id: s.google_id })
        .then((res) => {
          this.setState({ stage: 3 });
          const new_version_data = res.data;
          axios
            .post(`/project/${this.props.project_id}/version/${new_version_data.new_skill.skill_id}/google`)
            .then((res) => {
              this.setState({
                stage: 4,
                google_id: res.data.google_id || this.state.google_id,
                uploaded: true,
              });
            })
            .catch((err) => {
              this.setState({
                stage: 2,
                publish_modal_open: false,
              });
              const error_msg = err.response && err.response.data ? err.response.data : err;
              this.props.setError(error_msg);
            });
        })
        .catch((err) => {
          // TODO: do clean up here
          this.setState({
            publish_modal_open: false,
          });
          const error_msg = err.response && err.response.data ? err.response.data : err;
          this.props.setError(error_msg);
        });
    });
  }

  handleSelection(value) {
    this.setState({
      category: value,
    });
  }

  componentDidMount() {
    try {
      googleAccessToken().then((g_token) => {
        dialogflowToken(this.props.project_id).then((d_token) => {
          this.setState({
            credentials: !!d_token,
            publish_modal_open: d_token && !g_token.token,
            stage: g_token.token ? 2 : 0,
          });
        });
      });
    } catch (e) {
      console.error('Error checking google access token', e);
    }

    axios
      .get(`/skill/google/${this.props.skill_id}`)
      .then((res) => {
        if (!_.isObject(res.data.publish_info)) {
          res.data.publish_info = {};
        }

        const publish_info = res.data.publish_info;

        if (publish_info.review) {
          publish_info.stage = 5;
        } else {
          delete publish_info.stage;
        }

        if (!publish_info.locales) {
          publish_info.locales = [];
        }
        if (!publish_info.main_locale) {
          publish_info.main_locale = 'en';
        }

        if (!publish_info.google_link_user) {
          publish_info.google_link_user = '0';
        }

        const { google_id, created, diagram, privacy_policy, terms_and_cond } = res.data;

        // TODO: Antipattern, fix this when we do redux
        this.setState({
          loaded: true,
          ...publish_info,
          google_id,
          created,
          diagram,
          privacy_policy,
          terms_and_cond,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  componentWillUnmount() {
    if (this.state.loaded && this.state.credentials) {
      this.save(true);
    }
  }

  save(publish = false, cb) {
    const s = this.state;

    const publish_info = {
      google_publish_info: {
        locales: s.locales,
        main_locale: s.main_locale,
        uploaded: s.uploaded,
        google_link_user: s.google_link_user,
      },
    };

    axios
      .patch(`/skill/${this.props.skill_id}?platform=google${publish === true ? '&publish=true' : ''}`, publish_info)
      .then(() => {
        // eslint-disable-next-line callback-return
        if (typeof cb === 'function') cb();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        this.props.setError('Save Error, updates not saved');
      });
  }

  handleChange(event) {
    if (this.state.stage !== 11) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }

  async verifyGoogleToken() {
    this.setState({
      stage: 1,
    });
    try {
      await verifyGoogleToken(this.state.google_token);
      this.setState({
        stage: 2,
        publish_modal_open: this.state.publish_clicked,
      });
      if (this.state.publish_clicked) {
        this.onPublish();
      } else {
        this.props.setConfirm({
          warning: false,
          text: (
            <Alert color="success" className="mb-0">
              Success! Your project is now ready for upload.
            </Alert>
          ),
          confirm: _.noop,
        });
      }
    } catch (e) {
      this.setState({
        stage: 0,
      });
      this.props.setError(e);
    }
  }

  onUnlinkClick() {
    this.props.setConfirm({
      warning: true,
      text: (
        <Alert color="warning" className="mb-0">
          Are you sure you want to unlink the google project {this.state.google_id}? You will be able to link a new google project afterwards.
        </Alert>
      ),
      confirm: () => {
        this.unlinkGoogle();
      },
    });
  }

  async unlinkGoogle() {
    this.setState({
      unlink_loading: true,
    });

    try {
      await axios.delete('/session/google/dialogflow_access_token', {
        data: {
          project_id: this.props.project_id,
        },
      });

      const reset_google_publish_info = {
        locales: [],
        main_locale: null,
        uploaded: false,
        google_link_user: 0,
      };

      this.setState({
        credentials: false,
        google_id: '',
        ...reset_google_publish_info,
      });
    } catch (e) {
      this.props.setError(e);
    }

    this.setState({
      unlink_loading: false,
    });
  }

  onLocaleBtnClick(locale) {
    let locales = this.state.locales;

    if (locales.includes(locale)) {
      locales = _.without(locales, locale);
    } else {
      locales.push(locale);
    }

    this.setState({
      locales,
    });
  }

  onMainLocaleBtnClick(locale) {
    this.setState({
      main_locale: locale,
    });
  }

  async onDrop(files) {
    if (files.length === 1) {
      this.setState({ loading_creds: true });

      // eslint-disable-next-line compat/compat
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        try {
          const res = await axios.post('/session/google/verify_dialogflow_token', {
            token: text,
            project_id: this.props.project_id,
          });

          this.setState({
            credentials: true,
            loading_creds: false,
            google_id: res.data.google_id,
            publish_modal_open: this.state.stage === 0,
          });
        } catch (e) {
          this.props.setError(e.response.data || e);
          this.setState({
            loading_creds: false,
            publish_modal_open: false,
          });
        }
      };
      reader.readAsText(files[0], 'UTF-8');
    }
  }

  onPublishClicked() {
    this.setState({
      publish_modal_open: true,
      publish_clicked: true,
    });
    if (this.state.stage === 2) {
      this.onPublish();
    }
  }

  googleAuthTokenContent() {
    if (this.state.stage !== 0 && this.state.stage !== 1) {
      return null;
    }
    return (
      <GoogleAuth onVerify={this.verifyGoogleToken} token={this.state.google_token} onChange={this.handleChange} loading={this.state.stage === 1} />
    );
  }

  publishedContent() {
    if (this.state.stage !== 4) {
      return null;
    }
    return (
      <div>
        <img src="/images/preview.svg" alt="Success" height="160" />
        <br />
        Your Action Has been uploaded to Google Actions!
        <span className="text-muted text-center">
          You may test on the Google Actions Simulator. To submit for review, please follow the instructions on the Google Actions Developer Console.
        </span>
        <div className="my-3">
          <a
            href={`https://console.actions.google.com/u/${this.state.google_link_user || '0'}/project/${this.state.google_id}/simulator`}
            className="btn btn-primary mr-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Test on Google Actions Simulator
          </a>
          <a
            href="http://learn.voiceflow.com/advanced-voiceflow-tutorials/uploading-your-project-to-google-assistant"
            className="btn btn-default"
            target="_blank"
            rel="noopener noreferrer"
          >
            Submit for Review
          </a>
        </div>
      </div>
    );
  }

  render() {
    let modal_content = null;

    if (this.state.stage === 2 || this.state.stage === 3 || this.state.stage === 6 || this.state.stage === 7) {
      modal_content = (
        <div>
          <h1>
            <span className="loader" />
          </h1>
          <p className="loading">{GOOGLE_PUBLISH_STAGES[this.state.stage]}</p>
        </div>
      );
    } else if (this.state.stage === 0 || this.state.stage === 1) {
      modal_content = this.googleAuthTokenContent();
    } else if (this.state.stage === 4) {
      modal_content = this.publishedContent();
    }

    const googleConsoleUrl = `https://console.actions.google.com/u/${this.state.google_link_user || '0'}/project/${this.state.google_id}/overview`;

    if (!this.state.loaded)
      return (
        <div className="super-center h-100 w-100">
          <div className="text-center">
            <h1>
              <span className="loader" />
            </h1>
            Getting Action Status
          </div>
        </div>
      );

    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.publish_modal_open}
          toggle={this.togglePublish}
          className="stage_modal"
          centered
          size={[0, 1].includes(this.state.stage) ? 'md' : 'lg'}
          onClosed={this.closePublish}
        >
          <ModalHeader
            toggle={this.togglePublish}
            className="w-100"
            header={
              <div className="d-flex justify-content-between" ref={this.privacyTop}>
                <div>{GOOGLE_PUBLISH_STAGES[this.state.stage]}</div>
              </div>
            }
          />
          <ModalBody className="p-0">
            <div className="modal-info" style={{ padding: '0 2rem 1rem 2rem' }}>
              {modal_content}
            </div>
          </ModalBody>
        </Modal>

        <span className="container position-fixed bg-white mt-3 ml-2 mr-2 border p-3 pb-0 rounded" id="publish-status">
          <div className="row justify-content-center">
            <h3>Status</h3>
          </div>
          <hr className="mt-0" />
          <div className="row">
            <div className="col-2">
              {this.state.credentials ? <i className="fal fa-check-circle text-success" /> : <i className="fal fa-times-circle text-danger" />}
            </div>
            <div className="col-10">
              <p>Credentials File</p>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              {this.state.main_locale ? <i className="fal fa-check-circle text-success" /> : <i className="fal fa-times-circle text-danger" />}
            </div>
            <div className="col-10">
              <p>Main Language</p>
            </div>
          </div>
        </span>

        <div className="subheader-page-container">
          <div>
            <div className="container pt-3">
              {this.state.live ? (
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">This Action currently has a live version in production</h5>
                  </div>
                </div>
              ) : null}
              {this.state.google_id && this.state.uploaded ? (
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>This Action is linked on the Google Actions Console</span>
                    <b onClick={() => this.setState({ id_collapse: !this.state.id_collapse })} className="pointer">
                      {this.state.id_collapse ? 'Hide' : 'More Info'}{' '}
                      <span style={{ width: '9px', display: 'inline-block', textAlign: 'right' }}>
                        <i className={`fas fa-caret-left rotate${this.state.id_collapse ? ' fa-rotate--90' : ''}`} />
                      </span>
                    </b>
                  </div>
                  <Collapse isOpen={this.state.id_collapse}>
                    <hr />
                    <span>Project ID | </span>
                    <a
                      href={`https://console.actions.google.com/u/${this.state.google_link_user || '0'}/project/${this.state.google_id}/simulator`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{this.state.google_id} </b>
                    </a>

                    {!this.state.modify_url && (
                      <span
                        onClick={() => {
                          this.setState({ modify_url: true });
                        }}
                        className="tooltip-link ml-2"
                      >
                        Link not working? Modify your google user ID
                      </span>
                    )}

                    {this.state.modify_url && (
                      <span className="ml-2 google-link-publish">
                        <a
                          href={`https://console.actions.google.com/u/${this.state.google_link_user || '0'}/project/${
                            this.state.google_id
                          }/simulator`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {'https://console.actions.google.com/u/'}
                          <span>
                            <Input
                              className="google-link-input"
                              name="google_link_user"
                              value={this.state.google_link_user}
                              onChange={this.handleChange}
                              onClick={(e) => e.preventDefault()}
                            />
                          </span>
                          {`/project/${this.state.google_id}/simulator`}
                        </a>
                        <Tooltip
                          target="tooltip"
                          className="menu-tip"
                          theme="menu"
                          position="bottom"
                          title="This changes the Google Account that your link points to. A value of '0' will use your default Google Account, '1' will use the second Google Account you are logged into, and so on."
                        >
                          <i className="fas fa-question" />
                        </Tooltip>
                      </span>
                    )}
                  </Collapse>
                </div>
              ) : null}
              {DISALLOW_CHANGES_STAGES.has(this.state.stage) ? (
                <div className="alert alert-success mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">This Action is currently in review so you cannot edit it.</h5>
                    <div>
                      <DefaultButton isWhite variant="contained" href={googleConsoleUrl} target="_blank">
                        Visit Dashboard
                      </DefaultButton>
                      <DefaultButton isPrimary variant="contained" className="ml-3" onClick={this.toggleConfirmWithdraw}>
                        Withdraw Skill
                      </DefaultButton>
                    </div>
                  </div>
                </div>
              ) : null}
              <Form>
                <div className="big-settings-alignment-div">
                  <div className="mb-4 mt-5">
                    <label className="dark">Credentials</label>
                  </div>
                  <div className="big-settings-content">
                    <FormGroup>
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            Your <b>Dialogflow Credentials File</b> for publishing. Instructions can be found{' '}
                            <a
                              href="http://learn.voiceflow.com/advanced-voiceflow-tutorials/uploading-your-project-to-google-assistant"
                              target="_blank"
                              className="google-link"
                              rel="noopener noreferrer"
                            >
                              here
                            </a>
                          </p>
                        </div>
                        <div className="col-9">
                          <Label className="publish-label">Dialogflow Credentials File *</Label>
                          <div>
                            <Dropzone
                              className={`dropzone google-upload ${this.state.credentials ? 'disabled' : ''}`}
                              activeClassName="active"
                              rejectClassName="reject"
                              multiple={false}
                              disableClick={false}
                              maxSize={MAX_SIZE}
                              onDrop={this.onDrop}
                              disabled={this.state.credentials}
                            >
                              <div>
                                {!this.state.credentials && !this.state.loading_creds && (
                                  <div className="drop-child">
                                    Drag and Drop your file here
                                    <br />
                                    <small className="d-inline-block mt-2">OR</small>
                                    <br />
                                    <div>
                                      <div className="btn-primary-small mt-2">Add File</div>
                                    </div>
                                  </div>
                                )}
                                {this.state.loading_creds && (
                                  <div className="d-flex publish-loader">
                                    <span className="loader align-self-center" />
                                  </div>
                                )}
                                {this.state.credentials && (
                                  <div className="align-self-center mx-2 d-flex">
                                    <i className="fal fa-check-circle text-success align-self-center mx-2" />
                                    <span>
                                      <Label>File uploaded</Label>
                                    </span>
                                  </div>
                                )}
                                <div className="rejected-file text-danger">
                                  <b>File not Accepted</b>
                                </div>
                              </div>
                            </Dropzone>
                          </div>
                        </div>
                      </div>
                    </FormGroup>
                    {this.state.credentials && (
                      <FormGroup>
                        <div className="row">
                          <div className="col-3 publish-info">
                            <p className="helper-text">
                              <b>Google Project ID</b> is the ID of your project in the Google Actions Console (read-only).
                            </p>
                          </div>
                          <div className="col-9">
                            <Label className="publish-label">Google Project ID</Label>
                            <Input
                              className="form-bg"
                              type="text"
                              name="project_id"
                              placeholder="No Project ID Found"
                              value={this.state.google_id}
                              readOnly
                            />
                          </div>
                        </div>
                      </FormGroup>
                    )}
                    {this.state.credentials && (
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            <b>Unlink</b> the current Google Actions project.
                          </p>
                        </div>
                        <div className="col-9">
                          <Button className="w-100" color="danger" onClick={this.onUnlinkClick}>
                            {this.state.unlink_loading ? <span className="loader" /> : 'Unlink Google Project'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {this.state.credentials && (
                  <div className="big-settings-alignment-div">
                    <div className="mb-4">
                      <b>Languages</b>
                    </div>
                    <div className="big-settings-content">
                      <FormGroup>
                        <div className="row">
                          <div className="col-3 publish-info">
                            <p className="helper-text">
                              Your Action's <b>Main Language</b> determines its availability. Your Action will be available in regions which speak
                              your selected language.
                            </p>
                          </div>
                          <div className="col-9">
                            <Label className="publish-label">Main Language *</Label>
                            <ButtonGroup className="locale-button-group">
                              {FORMATTED_LOCALES.map((locale, i) => {
                                const active = this.state.main_locale === locale.value ? 'active' : '';
                                return (
                                  <Button
                                    outline
                                    color="primary"
                                    className={`locale-button ${active}`}
                                    key={i}
                                    onClick={() => {
                                      this.onMainLocaleBtnClick(locale.value);
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

                      {/* Disabled for now, because Dialogflow listEntityTypes(...) is not working as expected */}
                      {/* <FormGroup>
                      <div className="row">
                        <div className="col-3 publish-info">
                          <p className="helper-text">
                            <b>Additional languages</b> allow your skill to be adapted to support additional languages beyond your main language.
                                    </p>
                        </div>
                        <div className="col-9">
                          <Label className="publish-label">Additional Languages</Label>
                          <ButtonGroup className="locale-button-group">
                            {FORMATTED_LOCALES.map((locale, i) => {
                              const disabled = this.state.main_locale === locale.value
                              const active = this.state.locales.includes(locale.value) && !disabled ? "active" : "";
                              return <Button outline color="primary" className={`locale-button ${active} ${disabled ? 'disabled' : ''}`} key={i} onClick={() => { this.onLocaleBtnClick(locale.value) }}>{locale.name}</Button>
                            })}
                          </ButtonGroup>
                        </div>
                      </div>
                    </FormGroup> */}
                    </div>
                  </div>
                )}

                {this.state.credentials && (
                  <div className="big-settings-alignment-div">
                    <div className="mb-4">
                      <b>Legal</b>
                    </div>
                    <div className="big-settings-content">
                      <FormGroup>
                        <div className="row">
                          <div className="col-3 publish-info">
                            <p className="helper-text">
                              The <b>privacy policy url</b> is a link to the privacy policy your users will agree to when using your Action (this
                              field is for reference only).
                            </p>
                          </div>
                          <div className="col-9">
                            <Label className="publish-label">Privacy Policy URL</Label>
                            <Input
                              className="form-bg"
                              type="text"
                              name="privacy_policy"
                              readOnly
                              placeholder="Privacy Policy"
                              value={this.state.privacy_policy}
                            />
                          </div>
                        </div>
                      </FormGroup>

                      <FormGroup>
                        <div className="row">
                          <div className="col-3 publish-info">
                            <p className="helper-text">
                              The <b>terms and conditions url</b> is a link to the terms and conditions your users will agree to when using your
                              Action (this field is for reference only).
                            </p>
                          </div>
                          <div className="col-9">
                            <Label className="publish-label">Terms and Conditions URL</Label>
                            <Input
                              className="form-bg"
                              type="text"
                              name="terms_and_cond"
                              readOnly
                              placeholder="Terms and Conditions"
                              value={this.state.terms_and_cond}
                            />
                          </div>
                        </div>
                      </FormGroup>
                    </div>
                  </div>
                )}
              </Form>
              {this.state.credentials && (
                <div className="text-center">
                  <button variant="contained" className="btn-primary" onClick={this.onPublishClicked}>
                    Publish Action
                    <i className="fab fa-google ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill.skill_id,
  project_id: state.skills.skill.project_id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (err) => dispatch(setError(err)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GooglePublish);

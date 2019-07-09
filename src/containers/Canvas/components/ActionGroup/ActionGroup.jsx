import './ActionGroup.css';
import 'react-sweet-progress/lib/style.css';

import axios from 'axios';
import cn from 'classnames';
import Button from 'components/Button';
import AmazonLogin from 'components/Forms/AmazonLogin';
import { ModalHeader } from 'components/Modals/ModalHeader';
import { AmazonAccessToken, getVendors, googleAccessToken } from 'ducks/account';
import { setError } from 'ducks/modal';
import { updateVendorId } from 'ducks/project';
import { updateLocales, updateSkillDB, updateVersion } from 'ducks/version';
import React, { PureComponent } from 'react';
import Confetti from 'react-dom-confetti';
import { connect } from 'react-redux';
import { Progress } from 'react-sweet-progress';
import { Tooltip } from 'react-tippy';
import { Alert, Modal, ModalBody } from 'reactstrap';
import LOCALE_MAP from 'services/LocaleMap';
import InvRegex from 'services/Regex';

import Settings from '../../../Skill/Settings';
import ShareTest from '../../Test/ShareTest';
import UploadButton from '../UploadButton/UploadButton';

const loading = (message) => {
  return (
    <div className="super-center mb-4">
      <div className="text-center">
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );
};

const matchesKeyword = (splitName) => (l) =>
  splitName.find((split) => {
    return split === l.toLowerCase();
  });

const GOOGLE_STAGES = {
  0: 'No Google Token Found',
  1: 'No Project ID Found',
  2: 'Confirm Publish',
  3: 'Rendering',
  4: 'Publishing',
  5: 'Published',
};

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

const SHOW_PROMPT_ALEXA = [4, 5, 6, 9, 14, 2];

const STAGE_PERCENTAGES = {
  alexa: {
    1: [0, 5],
    11: [10, 49],
    12: [50, 95],
    13: [96, 100],
  },
  google: {
    3: [0, 59],
    4: [60, 98],
  },
};

// Loading without percentages
const LOADING_STAGES = {
  alexa: [7, 8],
  google: [],
};

// const ERROR_STAGES = {
//   alexa: [4, 9],
//   google: [2]
// }

const ENDING_STAGES = {
  alexa: [2, 4, 9, 10],
  google: [2, 5],
};
const LAUNCH_PHRASES = ['launch', 'ask', 'tell', 'load', 'begin', 'enable'];
const WAKE_WORDS = ['Alexa', 'Amazon', 'Echo', 'Skill', 'App'];

const Video = (link, className) => {
  return (
    <div className={`mt-3 rounded overflow-hidden ${className || 'w-100'}`}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="rounded w-100 overflow-hidden" controls>
        <source src={link} type="video/mp4" />
      </video>
    </div>
  );
};

const invNameError = (name, locales) => {
  if (!name || !name.trim()) {
    return 'Invocation name required for Alexa';
  }
  let characters = InvRegex.validLatinChars;
  let inv_name_error = `[${locales
    .filter((l) => l !== 'jp-JP')
    .join(',')}] Invocation name may only contain Latin characters, apostrophes, periods and spaces`;
  if (locales.length === 1 && locales[0] === 'ja-JP') {
    characters = InvRegex.validSpokenCharacters;
    inv_name_error = 'Invocation name may only contain Japanese/English characters, apostrophes, periods and spaces';
  } else if (locales.some((l) => l.includes('en'))) {
    // If an English Skill No Accents Allowed
    inv_name_error = `[${locales
      .filter((l) => l.includes('en'))
      .join(',')}] Invocation name may only contain alphabetic characters, apostrophes, periods and spaces`;
    characters = InvRegex.validCharacters;
  }

  const validRegex = `[^${characters}.' ]+`;
  const match = name.match(validRegex);
  const split_name = name.split(' ').map((splits) => {
    return splits.toLowerCase();
  });
  if (match) {
    return `${inv_name_error} - Invalid Characters: "${match.join()}"`;
  }
  if (WAKE_WORDS.some(matchesKeyword(split_name))) {
    return `Invocation name cannot contain Alexa keywords e.g. ${WAKE_WORDS.join(', ')}`;
  }
  if (LAUNCH_PHRASES.some(matchesKeyword(split_name))) {
    return `Invocation name cannot contain Launch Phrases e.g. ${LAUNCH_PHRASES.join(', ')}`;
  }
  return null;
};

export class ActionGroup extends PureComponent {
  constructor(props) {
    // localStorage.clear()
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
      is_error: false,
      should_pop_confetti: false,
      percentage: 0,
      upload_button_loading: true,
      selected_vendor: props.vendor_id,
      settingsModal: false,
    };

    this.token = null;
  }

  async componentDidMount() {
    const { skill } = this.props;
    // perform google fetch async
    googleAccessToken(skill.skill_id).then((token) => {
      this.google_token = token.token;
      this.reset();
    });

    try {
      const token = await AmazonAccessToken();
      this.token = token;
    } catch (err) {
      console.error(err);
    }
    this.reset();
  }

  shouldReset = () => {
    const { platform } = this.props;
    const { stage, google_stage } = this.state;

    if (ENDING_STAGES[platform].includes(platform === 'alexa' ? stage : google_stage)) {
      this.reset();
    }
  };

  openUpdate = () => {
    const { is_first_upload } = this.state;
    const { setCB, onSave, platform } = this.props;

    this.reset();
    if (this.timeout) clearInterval(this.timeout);
    if (is_first_upload) {
      setCB(() => {
        this.setState({
          updateModal: true,
        });
      });
      onSave();
    } else {
      this.setState({ saving: true }, () => {
        setCB(() => {
          if (platform === 'alexa') {
            this.updateAlexa();
          } else {
            this.updateGoogle();
          }
          this.setState({ saving: false });
        });
        onSave();
      });
    }
  };

  reset = () => {
    const { vendors, user } = this.props;
    // TEST FIRST SESSION
    this.setState({
      percent: 1,
      amzn_error: false,
      // eslint-disable-next-line no-nested-ternary
      stage: this.token ? (vendors.length === 0 ? 6 : 0) : 5,
      google_stage: this.google_token ? 2 : 0,
      is_first_upload: localStorage.getItem(`is_first_session_${user.id}`) !== 'false',
      // // TESTING PURPOSES
      // saving: true,
      // show_upload_prompt: true,
      // stage: 2,
      // updateModal: true,
      // is_first_upload: true,
    });
  };

  uploadSuccess = (platform = 'alexa', google_id) => {
    const { google_id: stateGoogleId } = this.state;
    const { user } = this.props;
    // Track upload on first session
    // They completed their first upload successfully
    if (platform === 'google') {
      this.setState({
        google_id: google_id || stateGoogleId,
      });
      this.updateGoogleStage(5);
    } else {
      this.updateAlexaStage(2);
    }
    if (localStorage.getItem(`is_first_session_${user.id}`) !== 'false') {
      localStorage.setItem(`is_first_session_${user.id}`, 'false');
      setTimeout(() => this.setState({ should_pop_confetti: true }), 300);
      axios.post('/analytics/track_first_session_upload');
    }
  };

  increment = (limit) => {
    const { percent } = this.state;
    if (percent <= limit) {
      this.setState({ percent: percent + 1 });
      this.loading_timeout = setTimeout(() => this.increment(limit), 250);
    }
  };

  updateAlexaStage = (stage, cb, props) => {
    if (SHOW_PROMPT_ALEXA.includes(stage)) this.showUploadPrompt();
    // if(!is_first_upload){
    //   if((ERROR_STAGES[platform].includes(stage) || stage === 2) && !this.timeout){
    //     this.timeout = setTimeout(() => {
    //       this.setState({show_upload_prompt: false})
    //       this.reset()
    //       this.timeout = null
    //     }, 8000)
    //   }
    // }
    if (STAGE_PERCENTAGES.alexa[stage]) {
      const range = STAGE_PERCENTAGES.alexa[stage];
      if (this.loading_timeout) clearTimeout(this.loading_timeout);
      this.setState({ percent: range[0] });
      this.increment(range[1]);
    }
    this.setState(
      {
        ...props,
        stage,
      },
      cb
    );
  };

  updateGoogleStage = (stage) => {
    const { is_first_upload } = this.state;
    if ([2, 5].includes(stage) && !is_first_upload) {
      this.showUploadPrompt();
      // this.timeout = setTimeout(() => {
      //   this.setState({show_upload_prompt: false})
      //   this.reset()
      //   this.timeout = null
      // }, 8000)
    }
    if (STAGE_PERCENTAGES.google[stage]) {
      const range = STAGE_PERCENTAGES.google[stage];
      if (this.loading_timeout) clearTimeout(this.loading_timeout);
      this.setState({ percent: range[0] });
      this.increment(range[1]);
    }
    this.setState({
      google_stage: stage,
    });
  };

  openUpdateLive = () => {
    const { onSave } = this.props;
    this.setState({
      updateLiveModal: true,
    });
    onSave();
  };

  checkVendor = async () => {
    const { vendors, getVendors } = this.props;

    this.updateAlexaStage(7);

    if (vendors.length === 0) {
      await getVendors();
      if (vendors.length === 0) {
        this.updateAlexaStage(6);
      } else {
        this.updateAlexaStage(0);
      }
    } else {
      this.updateAlexaStage(0);
    }
  };

  enableSkill = async (locale) => {
    const { skill } = this.props;
    this.updateAlexaStage(13);
    try {
      await axios.put(`/interaction_model/${skill.amzn_id}/enable`);
      this.SucceedLocale = locale;
    } catch (err) {
      console.error(err);
    }
    this.uploadSuccess();
  };

  checkInteractionModel = () => {
    const { skill } = this.props;
    this.updateAlexaStage(12);
    this.SucceedLocale = null;
    const iterate = (depth) => {
      // wait up to 20 seconds
      if (depth === 20) {
        this.uploadSuccess();
      } else {
        setTimeout(() => {
          axios
            .get(`/interaction_model/${skill.amzn_id}/status`)
            .then((res) => {
              if (res.data && res.data.interactionModel) {
                // eslint-disable-next-line no-restricted-syntax, guard-for-in
                for (const key in res.data.interactionModel) {
                  const locale = res.data.interactionModel[key];
                  if (locale.lastUpdateRequest && locale.lastUpdateRequest.status && locale.lastUpdateRequest.status === 'SUCCEEDED') {
                    this.enableSkill(key);
                    return;
                  }
                }
              }
              iterate(depth + 1);
            })
            .catch(() => {
              this.uploadSuccess();
            });
        }, 3000);
      }
    };

    iterate(0);
  };

  updateInvName = async () => {
    const { inv_name: stateInvName } = this.state;
    const { skill, updateSkill } = this.props;

    const inv_name = stateInvName || skill.inv_name;
    try {
      await axios.patch(`/skill/${skill.skill_id}?inv_name=1`, { inv_name });
      updateSkill('inv_name', inv_name);
    } catch (err) {
      this.updateAlexaStage(9, undefined, {
        upload_error: 'Unable to save Invocation Name',
      });
    }
  };

  updateAlexa = async () => {
    const { vendors, skill, updateSkill } = this.props;
    const { inv_name: stateInvName, stage } = this.state;
    if (!this.token) {
      return this.updateAlexaStage(5);
    }
    if (vendors.length === 0) {
      return this.updateAlexaStage(6);
    }
    const inv_name = stateInvName || skill.inv_name;
    const error = invNameError(inv_name, skill.locales);
    if (error) {
      this.setState(
        {
          inv_name,
          inv_name_error: error,
          flash: true,
        },
        () => {
          this.updateAlexaStage(14);
          setTimeout(() => this.setState({ flash: false }), 1500);
        }
      );
      return;
    }
    this.updateAlexaStage(1);
    if (stage === 14) {
      this.updateAlexaStage(1);
      this.updateInvName();
    }
    axios
      .post(`/project/${skill.project_id}/render`, { platform: 'alexa' })
      .then((res) => {
        const new_version_data = res.data;
        this.updateAlexaStage(11, () => {
          axios
            .post(`/project/${skill.project_id}/version/${new_version_data.new_skill.skill_id}/alexa`)
            .then((res) => {
              updateSkill('amzn_id', res.data);
              this.checkInteractionModel();
            })
            .catch((err) => {
              if (err.status === 403 || err.response.status === 403) {
                // No Vendor ID/Amazon Developer Account
                this.updateAlexaStage(6);
              } else if (err.status === 401 || err.response.status === 401) {
                this.updateAlexaStage(5);
              } else {
                let error_message = '';
                if (err.response && err.response.data && err.response.data.message) {
                  error_message += err.response.data.message;

                  if (err.response.data.violations) {
                    for (let i = 0; i < err.response.data.violations.length; i++) {
                      error_message += `\n${err.response.data.violations[i].message}`;
                    }
                  }
                }
                this.updateAlexaStage(9, undefined, {
                  upload_error: err.response && err.response.data && err.response.data.message ? error_message : 'Error Encountered',
                });
              }
            });
        });
      })
      .catch(() => {
        this.updateAlexaStage(4);
      });
  };

  updateGoogle = () => {
    const s = this.state;
    const p = this.props;

    const { skill } = this.props;

    if (s.google_stage === 0 || s.google_stage === 1 || !p.skill.google_publish_info || !p.skill.google_id) {
      p.history.push(`/publish/${p.skill.skill_id}/google`);
      return;
    }

    this.updateGoogleStage(3);

    axios
      .post(`/project/${skill.project_id}/render`, {
        platform: 'google',
        google_id: p.skill.google_id,
      })
      .then((res) => {
        this.updateGoogleStage(4);
        const new_version_data = res.data;
        axios
          .post(`/project/${skill.project_id}/version/${new_version_data.new_skill.skill_id}/google`)
          .then((res) => {
            // They completed their first upload successfully
            this.uploadSuccess('google', res.data.google_id);
          })
          .catch((err) => {
            this.setState({
              updateModal: false,
            });
            this.updateGoogleStage(2);
            const error_msg = err.response && err.response.data ? err.response.data : err;
            p.setError(error_msg);
          });
      })
      .catch((err) => {
        p.setError(err);
      });
  };

  toggleUpdateLive = () => {
    this.setState((prev_state) => ({
      updateLiveModal: !prev_state.updateLiveModal,
    }));
  };

  toggleVendors = () => {
    const { vendors_open } = this.state;
    this.setState({ vendors_open: !vendors_open });
  };

  showUploadPrompt = () => {
    const { is_first_upload } = this.state;
    this.setState({
      show_upload_prompt: !is_first_upload,
    });
  };

  closePrompt = () => {
    this.setState({ show_upload_prompt: false });
    if (!this.isUploadLoading()) {
      this.reset();
    }
  };

  displayUploadPrompt = () => {
    const { show_upload_prompt } = this.state;
    if (show_upload_prompt) {
      return (
        <div className="upload-success-popup">
          <Button className="close close-upload-success-popup mt-2" onClick={this.closePrompt} />
          {this.renderBody(false)}
        </div>
      );
    }
  };

  isUploadLoading = () => {
    const { saving, stage, google_stage } = this.state;
    const { platform } = this.props;
    if (saving) return true;
    if (platform === 'alexa') {
      return !ENDING_STAGES[platform].includes(stage) && ![0, 5, 6, 8].includes(stage);
    }
    return !ENDING_STAGES[platform].includes(google_stage) && ![0, 5, 6, 8].includes(google_stage);
  };

  updateLiveVersion = () => {
    const { saveSkill, skill, setError } = this.props;
    this.setState({ live_update_stage: 1 });
    saveSkill(true, () => {
      axios
        .post(`/diagram/${skill.diagram}/${skill.skill_id}/rerender`)
        .then(() => {
          this.setState({
            live_update_stage: 2,
          });
        })
        .catch(() => {
          setError('Error updating live version');
        });
    });
  };

  renderLiveStage = () => {
    const { live_update_stage } = this.state;
    if (live_update_stage === 2) {
      return (
        <>
          <img className="modal-img-small mb-4 mt-3 mx-auto" src="/live-success.svg" alt="Upload" />
          <div className="modal-bg-txt text-center mt-2"> Live Version Updated</div>
          <div className="modal-txt text-center mt-2 mb-3">This may take a few minutes to be reflected on your device.</div>
        </>
      );
    }
    if (live_update_stage === 1) {
      return (
        <div className="pb-4 mb-2">
          <div className="text-center my-3">
            <div className="loader text-lg" />
          </div>
          {loading('Rendering Flows')}
        </div>
      );
    }
    return (
      <>
        <img className="modal-img-small mb-4 mt-3 mx-auto" src="/live.svg" alt="Upload" />
        <div className="modal-bg-txt text-center mt-2"> Confirm Live Update</div>
        <div className="modal-txt text-center mt-2 mb-3">
          This update will affect the live version of your project. Please be sure you wish to do this.
        </div>
        <Button isPrimary className="mb-3" onClick={this.updateLiveVersion}>
          Confirm Update
        </Button>
      </>
    );
  };

  renderBody = (modal) => {
    const { saving, percent, google_stage, stage } = this.state;
    const { platform } = this.props;

    if (saving) {
      return (
        <>
          <div
            // eslint-disable-next-line sonarjs/no-duplicate-string
            className={cn('mb-3', 'text-center', {
              'mt-3': !modal,
            })}
          >
            <Progress type="circle" strokeWidth={5} theme={{ default: { color: '#42a5ff' } }} percent={percent} />
          </div>
          {loading('Saving Project')}
        </>
      );
    }
    if (platform === 'google') {
      return (
        <>
          {![0].includes(google_stage) && !ENDING_STAGES.google.includes(google_stage) && (
            <div
              className={cn('mb-3', 'text-center', {
                'mt-3': !modal,
              })}
            >
              <Progress type="circle" strokeWidth={5} theme={{ default: { color: '#42a5ff' } }} percent={percent} />
            </div>
          )}
          {this.renderGoogleBody(modal)}
        </>
      );
    }
    return (
      <>
        {(STAGE_PERCENTAGES.alexa[stage] && (
          <div
            className={cn('mb-3', 'text-center', {
              'mt-3': !modal,
            })}
          >
            <Progress type="circle" strokeWidth={5} theme={{ default: { color: '#42a5ff' } }} percent={percent} />
          </div>
        )) ||
          (LOADING_STAGES.alexa.includes(stage) && (
            <div
              className={cn('mb-3', 'text-center', {
                'mt-3': !modal,
              })}
            >
              <div className="loader text-lg" />
            </div>
          ))}
        {this.renderAlexaBody(modal)}
      </>
    );
  };

  renderAlexaBody = (modal) => {
    const { skill, updateSkill, saveSkill, updateSkillLocale } = this.props;
    const { stage, amzn_error, upload_error, inv_name, flash, is_first_upload, inv_name_error } = this.state;
    // I had to get this out really fast the states are all REALLY fucking wack
    if (!skill.locales) {
      return null;
    }

    switch (stage) {
      case 1:
        return loading('Rendering Flows');
      case 2:
        // eslint-disable-next-line no-case-declarations
        const locale = (this.SucceedLocale || skill.locales[0] || 'en-US').replace('-', '_');

        if (!modal) {
          return (
            <div className="text-center">
              <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2">
                {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
                <span className="pass-icon mr-2" /> Upload Successful
              </div>
              <div className="upload-prompt-text">
                Your Skill is now available to test on your Alexa and the{' '}
                <a
                  href={`https://developer.amazon.com/alexa/console/ask/test/${skill.amzn_id}/development/${locale}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Amazon console
                </a>
                .
              </div>
            </div>
          );
        }
        return (
          <>
            {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
            <div className="d-flex align-items-center justify-content-center">
              <span className="pass-icon mr-2" /> Upload Successful
            </div>
            {Video('https://s3.amazonaws.com/com.getvoiceflow.videos/loomopt.mp4', 'w-90')}
            <span className="modal-txt text-center mt-3">You may test on the Alexa simulator or live on your personal Alexa device</span>
            {!!this.SucceedLocale && (
              <Alert className="w-75 mb-1 mt-3 text-center">
                <b>Alexa,</b> open {skill.inv_name}
              </Alert>
            )}
            <div className="my-45">
              <a
                href={`https://developer.amazon.com/alexa/console/ask/test/${skill.amzn_id}/development/${locale}/`}
                className="btn-primary mr-2 no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Test on Alexa Simulator
              </a>
            </div>
          </>
        );

      case 4:
        return (
          <Alert color="danger mb-0 w-90">
            <span className="fail-icon" /> Rendering Error
          </Alert>
        );
      case 5:
        return (
          <div className={`modal-txt flex-fill text-center mb-4 mt-3${modal ? ' w-100' : ' mt-4'}`}>
            {amzn_error && (
              <Alert color="danger">
                <span className="fail-icon" /> Login With Amazon Failed - Try Again
              </Alert>
            )}
            Login with Amazon to test your Skill on your own Alexa device, or in the Alexa developer console
            {modal && Video('https://s3.amazonaws.com/com.getvoiceflow.videos/first.mp4')}
            <div className="text-center mt-4">
              <AmazonLogin
                updateLogin={(stage) => {
                  if (stage === 2) {
                    this.token = true;
                    this.checkVendor();
                  } else if (1) {
                    this.updateAlexaStage(8);
                  } else {
                    this.updateAlexaStage(0, undefined, { amzn_error: true });
                  }
                }}
                small
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className={`w-100 ${modal ? 'text-center' : ''}`}>
            <p>
              <b>Looks like you don't have a developer account</b>
            </p>
            <div className="text-muted mb-4 margin-auto" style={{ maxWidth: 350 }}>
              <b>Important:</b> Make sure to use the same email associated with your Amazon account.
            </div>
            <hr className="full-width" />
            <div className={modal ? 'super-center mb-2' : ''}>
              <a
                href="https://developer.amazon.com/login.html"
                className="btn-primary mr-3 no-underline d-inline-block mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Developer Sign Up
              </a>
              <Button isSecondary className="mb-2" onClick={this.checkVendor}>
                <i className="fas fa-sync-alt" /> Check Again
              </Button>
            </div>
          </div>
        );
      case 7:
        return loading('Checking Vendor');
      case 8:
        return loading('Verifying Login');
      case 9:
        return (
          <div className={`w-100${modal ? ' text-center' : ''}`}>
            <div className="d-flex align-items-center jusitfy-content-center">
              <span className="fail-icon mr-2" />
              Amazon Error Response
            </div>
            <Alert color="danger" className="mt-1">
              {upload_error}
            </Alert>
            <Alert>
              Amazon responded with an error, Visit our{' '}
              <u>
                <a href="https://forum.voiceflow.com">community</a>
              </u>{' '}
              or contact us for help
            </Alert>
          </div>
        );
      case 11:
        return loading('Uploading to Alexa');
      case 12:
        return loading('Building Interaction Model');
      case 13:
        return loading('Enabling Skill');
      case 14:
        return (
          <div className="w-100">
            <div className="d-flex text-muted align-items-center">
              <label className="mr-1">Invocation Name</label>
              <Tooltip
                html={
                  <>
                    Alexa listens for the Invocation Name
                    <br /> to launch your Skill
                    <br /> e.g.{' '}
                    <i>
                      Alexa, open <b>Invocation Name</b>
                    </i>
                  </>
                }
                position="bottom"
              >
                <i className="fal fa-question-circle" />
              </Tooltip>
            </div>
            <input
              className="form-control"
              value={inv_name}
              placeholder="Invocation Name"
              onChange={(e) =>
                this.setState({
                  inv_name: e.target.value,
                  inv_name_error: invNameError(e.target.value, skill.locales),
                })
              }
            />
            <small className={`text-blue${flash ? ' blink' : ''}`}>{inv_name_error}</small>
            <div className="super-center mt-3 mb-2">
              <Button isPrimary onClick={this.updateAlexa}>
                Continue
              </Button>
            </div>
          </div>
        );
      default:
        if (is_first_upload) {
          axios.post('/analytics/track_dev_account').catch((err) => {
            console.error(err);
          });
          return (
            <div id="name-box" className="text-center">
              <div className="mb-5 mt-3">
                <input
                  id="skill-name"
                  className="input-underline"
                  type="text"
                  name="name"
                  value={skill.name}
                  onChange={(e) => {
                    updateSkill('name', e.target.value);
                    updateSkill('inv_name', e.target.value);
                  }}
                  placeholder="Enter your project name"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  required
                />
              </div>
              <div className="text-muted mt-4 mb-3">Select Regions</div>
              <div className="grid-col-3 mx--1">
                {LOCALE_MAP.map((locale, i) => {
                  const active = skill.locales.includes(locale.value) ? 'active' : '';
                  return (
                    <Button
                      className={`country-checkbox btn-darken ${active}`}
                      key={i}
                      onClick={() => {
                        updateSkillLocale(locale.value);
                      }}
                    >
                      <span>{locale.name}</span>
                      <img src={`/images/icons/countries/${locale.value}.svg`} alt={locale.name} />
                    </Button>
                  );
                })}
              </div>
              <div className="mt-4 mb-5">
                <Button
                  isPrimary
                  varient="contained"
                  onClick={() => {
                    this.updateInvName();
                    this.updateAlexa();
                    saveSkill();
                  }}
                >
                  Confirm Upload
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div>
            <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload" />
            <div className="modal-bg-txt text-center mt-2"> Upload your Skill for testing</div>
            <div className="modal-txt text-center mt-2">
              Updating to Alexa will allow you to test on your Alexa device or the Alexa Developer Console
            </div>
            <div className="super-center mb-3 mt-3">
              <Button isPrimary onClick={this.updateAlexa}>
                Continue
              </Button>
            </div>
          </div>
        );
    }
  };

  renderGoogleBody = (modal) => {
    const { google_stage, google_id, is_first_upload } = this.state;
    const { skill } = this.props;

    let modal_content = null;
    if (google_stage === 3 || google_stage === 4) {
      modal_content = loading(GOOGLE_STAGES[google_stage]);
    } else if (google_stage === 5) {
      if (!modal) {
        modal_content = (
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2">
              <span className="pass-icon mr-2" /> Upload Successful
            </div>
            <div className="upload-prompt-text">
              You may test on the{' '}
              <a
                href={`https://console.actions.google.com/u/${skill.google_publish_info.google_link_user || '0'}/project/${google_id}/simulator`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Actions Simulator
              </a>
              . To submit for review, please follow the instructions on the Google Actions Developer Console.
            </div>
          </div>
        );
      } else {
        modal_content = (
          <>
            <img src="/images/clipboard-icon.svg" alt="Success" height="160" />
            <br />
            <span className="modal-bg-txt text-center mb-2"> Successfully uploaded to Google Actions </span>
            <span className="modal-txt text-center">
              You may test on the Google Actions Simulator. To submit for review, please follow the instructions on the Google Actions Developer
              Console.
            </span>
            <div className="my-3">
              <a
                href={`https://console.actions.google.com/u/${skill.google_publish_info.google_link_user || '0'}/project/${google_id}/simulator`}
                className="btn btn-primary mr-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Test on Google Actions Simulator
              </a>
            </div>
          </>
        );
      }
    } else {
      if (is_first_upload) {
        axios.post('/analytics/track_dev_account').catch((err) => {
          console.error(err);
        });
      }
      modal_content = (
        <div>
          <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload" />
          <div className="modal-bg-txt text-center mt-2"> Upload your Action for testing</div>
          <div className="modal-txt text-center mt-2">
            Updating to Google will allow you to test on your Google device or the Google Actions Console.
          </div>
          {(skill.live || skill.review) && <hr />}
          <div>
            {skill.google_publish_info && skill.google_publish_info.live && (
              <Alert color="danger">This Action is in production, updating will change the flow for all production users</Alert>
            )}
            {skill.google_publish_info && skill.google_publish_info.review && (
              <Alert color="danger">This Action is under review, updating will change the flow during the review process</Alert>
            )}
          </div>

          <div className="super-center mb-3 mt-3">
            <Button isPrimary onClick={this.updateGoogle}>
              Confirm Upload
            </Button>
          </div>
        </div>
      );
    }
    return modal_content;
  };

  render() {
    const { updateModal, should_pop_confetti, updateLiveModal, show_upload_prompt, vendors_open, stage, is_first_upload } = this.state;
    const { skill, platform, live_mode, vendors, show_upload_prompt: props_show_upload_prompt } = this.props;

    return (
      <>
        {updateModal && (
          <div id="confetti-positioner">
            <Confetti
              active={should_pop_confetti}
              config={{
                angle: 90,
                spread: 70,
                startVelocity: 50,
                elementCount: 75,
                dragFriction: 0.05,
                duration: 8000,
                delay: 0,
              }}
            />
          </div>
        )}
        <Modal
          size={stage === 0 ? 'lg' : undefined}
          isOpen={updateModal && is_first_upload}
          toggle={() => this.setState({ updateModal: false })}
          onClosed={this.shouldReset}
          className="stage_modal"
        >
          <ModalHeader toggle={() => this.setState({ updateModal: false })} className="pb-0 mb--4" header="Upload Project" />
          <ModalBody className="modal-info" style={{ padding: '0rem 2rem' }}>
            <div>{this.renderBody(true)}</div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={updateLiveModal}
          toggle={this.toggleUpdateLive}
          onClosed={() => {
            this.setState({ live_update_stage: 0 });
          }}
          className="stage_modal"
        >
          <ModalHeader toggle={this.toggleUpdateLive} header="Update Live Version" />
          <ModalBody className="modal-info">
            <div>{this.renderLiveStage()}</div>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.settingsModal} toggle={() => this.setState({ settingsModal: false })} className="ag__settings_modal">
          <div className="ag__settings_header">
            <ModalHeader toggle={() => this.setState({ settingsModal: false })} className="pb-2" header="Project Settings" />
          </div>
          <Settings {...this.props} page="basic" toggleUpgrade={this.toggleUpgrade} />
        </Modal>

        <div className="title-group-sub">
          <Tooltip title="Settings" position="bottom">
            <Button
              className={cn('dropdown-button-border', { active: this.state.settingsModal })}
              id="settings-icon"
              type="button"
              onClick={() => {
                this.props.unfocus();
                this.setState({ settingsModal: true });
              }}
            />
          </Tooltip>
        </div>
        <div className="title-group-sub">
          <ShareTest render />
        </div>
        <UploadButton
          live_mode={live_mode}
          show_upload_prompt={show_upload_prompt}
          vendors={vendors}
          platform={platform}
          vendors_open={vendors_open}
          project_id={skill.project_id}
          openUpdateLive={() => this.openUpdateLive()}
          toggle_upload_prompt={() => this.setState({ show_upload_prompt: !props_show_upload_prompt })}
          isUploadLoading={() => this.isUploadLoading()}
          openUpdate={() => this.openUpdate()}
          toggleVendors={() => this.toggleVendors()}
        />
        {this.displayUploadPrompt()}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  skill: state.skills.skill,
  platform: state.skills.skill.platform,
  diagram_id: state.skills.skill.diagram,
  live_mode: state.skills.live_mode,
  vendor_id: state.skills.skill.vendor_id,
  vendors: state.account.vendors,
});

const mapDispatchToProps = (dispatch) => ({
  updateSkill: (type, val) => dispatch(updateVersion(type, val)),
  setError: (err) => dispatch(setError(err)),
  updateSkillLocale: (val) => dispatch(updateLocales(val)),
  saveSkill: (publish, cb) => dispatch(updateSkillDB(publish, cb)),
  updateVendorId: (projectId, vendorId) => dispatch(updateVendorId(projectId, vendorId)),
  getVendors: () => dispatch(getVendors()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionGroup);

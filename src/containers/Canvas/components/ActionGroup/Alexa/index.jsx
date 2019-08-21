import '../ActionGroup.css';
import 'react-sweet-progress/lib/style.css';

import axios from 'axios';
import cn from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Progress } from 'react-sweet-progress';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { AmazonAccessToken, getVendors } from '@/ducks/account';
import { setError, showSettingsModal } from '@/ducks/modal';
import { updateSkillDB, updateVersion } from '@/ducks/version';

import Settings from '../../../../Publish/Settings';
import UploadButton from '../../UploadButton/UploadButton';
import { ENDING_STAGES, LOADING_STAGES, STAGE_PERCENTAGES } from '../Constants';
import { Confetti, DisplayUploadPrompt, SettingsModal } from '../popups';
import SubTitleActions from '../sub-title-actions';
import { invNameError, loading } from '../utils';
import AlexaBody from './popup-body';

export class ActionGroup extends PureComponent {
  state = {
    stage: 0,
    amzn_error: false,
    inv_name: null,
    inv_name_error: '',
    is_first_upload: false,
    live_update_stage: 0,
    percent: 0,
    publish: false,
    should_pop_confetti: false,
    show_upload_prompt: false,
    updateLiveModal: false,
    upload_error: 'No Error',
  };

  amazon_token = null;

  SucceedLocale = null;

  loading_timeout = null;

  // timeout=null;

  render() {
    const { should_pop_confetti, updateLiveModal, show_upload_prompt, is_first_upload } = this.state;
    const { skill, platform, live_mode, vendors, showSettings, showSettingsModal, unfocus } = this.props;

    return (
      <>
        <SubTitleActions
          activeButton={showSettings.show}
          onButtonClick={() => {
            unfocus();
            showSettingsModal(true);
          }}
        />

        <UploadButton
          live_mode={live_mode}
          vendors={vendors}
          platform={platform}
          project_id={skill.project_id}
          openUpdateLive={this.openUpdateLive}
          isUploadLoading={this.isUploadLoading()}
          openUpdate={this.openUpdate}
          toggle_upload_prompt={this.toggleUploadPrompt}
        />

        {/* All the popups */}

        {show_upload_prompt && <Confetti active={should_pop_confetti} />}

        <DisplayUploadPrompt onButtonClick={this.closePrompt} showPrompt={show_upload_prompt}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {updateLiveModal ? this.renderLiveStage() : is_first_upload ? this.renderBody(true) : this.renderBody(false)}
        </DisplayUploadPrompt>

        <SettingsModal isOpen={showSettings.show} onToggle={() => showSettingsModal(false)}>
          <Settings {...this.props} tag={showSettings.tag} />
        </SettingsModal>
      </>
    );
  }

  // Step 1 - when component renders
  async componentDidMount() {
    try {
      this.amazon_token = await AmazonAccessToken();
    } catch (err) {
      console.error(err);
    }
    this.reset();
  }

  // Step 2 - used in Step 1, Step 5, Step 13
  reset = () => {
    const { vendors, user } = this.props;
    this.setState({
      // eslint-disable-next-line no-nested-ternary
      stage: this.amazon_token ? (vendors.length === 0 ? 6 : 0) : 5,
      is_first_upload: localStorage.getItem(`is_first_session_${user.creator_id}`) !== 'false',
      percent: 1,
      amzn_error: false,
    });
  };

  // Step 3 - used in <UploadButton/>, Step 14
  isUploadLoading = () => {
    const { saving, stage, live_update_stage } = this.state;
    const { platform, live_mode } = this.props;

    if (live_mode) {
      // checkes if live stage is enabled(0) and is done publishing (2)
      return ![0, 2].includes(live_update_stage);
    }

    if (saving) return true;

    return !ENDING_STAGES[platform].includes(stage) && ![0, 2, 4, 5, 6, 8, 9, 14].includes(stage);
  };

  // Step 4 - used in <UploadButton/>
  toggleUploadPrompt = (value = !this.state.show_upload_prompt) => this.setState({ show_upload_prompt: value });

  // Step 5 - used in <UploadButton/>
  openUpdate = () => {
    const { is_first_upload } = this.state;
    const { setCB, onSave } = this.props;

    this.reset();
    // if (this.timeout) clearInterval(this.timeout);
    if (is_first_upload) {
      setCB(() =>
        this.setState({
          show_upload_prompt: true,
        })
      );
      onSave();
    } else {
      this.setState({ saving: true }, () => {
        setCB(() => {
          this.updateAlexa();
          this.setState({ saving: false });
        });
        onSave();
      });
    }
  };

  // Step 6 - used in Step 5 and Step 15
  updateAlexa = async () => {
    if (!this.amazon_token) {
      this.toggleUploadPrompt(true);
      return this.updateAlexaStage(5);
    }

    // If already logged in and they press the button again and they now have a dev account made async from voiceflow
    const { vendors, skill, updateSkill } = this.props;
    if (vendors.length === 0) {
      // get vendors and check again
      this.updateAlexaStage(7);
      this.toggleUploadPrompt(true);
      const updatedVendors = await this.props.getVendors();
      if (updatedVendors.length === 0) {
        return this.updateAlexaStage(6);
      }
    }

    const { inv_name: stateInvName, stage } = this.state;
    const inv_name = stateInvName || skill.inv_name;
    const error = invNameError(inv_name, skill.locales);

    if (error) {
      this.setState(
        {
          inv_name,
          inv_name_error: error,
          show_upload_prompt: true,
        },
        () => this.updateAlexaStage(14)
      );
      return;
    }

    this.updateAlexaStage(1);

    if (stage === 14) {
      this.updateAlexaStage(1);
      this.updateInvName();
    }

    let newVersionData;
    try {
      newVersionData = (await axios.post(`/project/${skill.project_id}/render`, { platform: 'alexa' })).data;
    } catch (err) {
      // RENDERING ERROR
      this.toggleUploadPrompt(true);
      return this.updateAlexaStage(4);
    }
    try {
      this.updateAlexaStage(11);
      const { data } = await axios.post(`/project/${skill.project_id}/version/${newVersionData.new_skill.skill_id}/alexa`);
      updateSkill('amzn_id', data);
      this.checkInteractionModel();
    } catch (err) {
      if (err.status === 403 || err.response.status === 403) {
        // No Vendor ID/Amazon Developer Account
        this.updateAlexaStage(6);
      } else if (err.status === 401 || err.response.status === 401) {
        this.updateAlexaStage(5);
      } else {
        let errorMessage = '';
        const errorData = _.get(err, ['response', 'data']) || {};
        const { message, violations } = errorData;
        if (message) {
          errorMessage += err.response.data.message;
        }

        if (violations) {
          violations.forEach(({ message }) => {
            if (message) {
              errorMessage += `\n${message}`;
            }
          });
        }

        if (!errorMessage && _.isString(errorData)) errorMessage = errorData;
        this.toggleUploadPrompt(true);
        this.updateAlexaStage(9, undefined, {
          upload_error: errorMessage || 'Error Encountered',
        });
      }
    }
  };

  // Step 7 - used in Step 6, Step 9, Step 10, Step 11, Step 12
  updateAlexaStage = (stage, cb, props) => {
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

  // Step 8 - used in Step 7
  increment = (limit) => {
    const { percent } = this.state;
    if (percent <= limit) {
      this.setState({ percent: percent + 1 });
      this.loading_timeout = setTimeout(() => this.increment(limit), 250);
    }
  };

  // Step 9 - used in Step 6, Step 15
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

  // Step 10 - used in Step 6
  checkInteractionModel = () => {
    const { skill } = this.props;

    this.updateAlexaStage(12);
    this.SucceedLocale = null;

    const iterate = (depth) => {
      // wait up to 60 seconds
      if (depth === 20) {
        this.toggleUploadPrompt(true);
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
              this.toggleUploadPrompt(true);
              this.uploadSuccess();
            });
        }, 3000);
      }
    };

    iterate(0);
  };

  // Step 11 - used in Step 10, Step 12
  uploadSuccess = () => {
    const { user } = this.props;
    // Track upload on first session
    // They completed their first upload successfully
    this.updateAlexaStage(2);
    this.setState({ show_upload_prompt: true });

    if (localStorage.getItem(`is_first_session_${user.creator_id}`) !== 'false') {
      localStorage.setItem(`is_first_session_${user.creator_id}`, 'false');
      setTimeout(() => this.setState({ should_pop_confetti: true }), 300);
      axios.post('/analytics/track_first_session_upload');
    }
  };

  // Step 12 - used in Step 10
  enableSkill = async (locale) => {
    const { skill } = this.props;

    this.updateAlexaStage(13);
    try {
      await axios.put(`/interaction_model/${skill.amzn_id}/enable`);
      this.SucceedLocale = locale;
    } catch (err) {
      console.error(err);
    }
    this.toggleUploadPrompt(true);
    this.uploadSuccess();
  };

  // Step 13 - used in <DisplayUploadPrompt/>
  closePrompt = () => {
    const { stage } = this.state;
    const { live_mode, platform } = this.props;

    !this.isUploadLoading() && this.reset();
    ENDING_STAGES[platform].includes(stage) && this.reset();
    live_mode && this.setState({ live_update_stage: 0 });

    this.setState({ show_upload_prompt: false });
  };

  // Step 14 - used in <FirstUploadModal/> and <DisplayUploadPrompt/>
  renderBody = (modal) => {
    const { saving, percent, stage } = this.state;
    const { skill, saveSkill } = this.props;

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
              <Spinner isEmpty />
            </div>
          ))}
        <AlexaBody
          modal={modal}
          succeedLocale={this.SucceedLocale}
          updateAlexaStage={this.updateAlexaStage}
          // eslint-disable-next-line no-return-assign
          setAmazonToken={() => (this.amazon_token = true)}
          stateProps={this.state}
          updateAlexa={this.updateAlexa}
          onInvocatonNameChange={(e) =>
            this.setState({
              inv_name: e.target.value,
              inv_name_error: invNameError(e.target.value, skill.locales),
            })
          }
          toggle_upload_prompt={this.toggleUploadPrompt}
          onConfirmUpload={() => {
            this.updateInvName();
            this.updateAlexa();
            saveSkill();
          }}
          {...this.props}
        />
      </>
    );
  };

  // ------- for live skill cases -----------

  openUpdateLive = () => {
    const { onSave } = this.props;
    this.toggleUploadPrompt(true);
    this.setState({
      updateLiveModal: true,
    });
    onSave();
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
          <Spinner message="Rendering Flows" />
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

  updateLiveVersion = () => {
    const { saveSkill, skill, setError, root_id } = this.props;
    this.setState({ live_update_stage: 1 });
    saveSkill(true, () => {
      axios
        .post(`/diagram/${root_id}/${skill.skill_id}/rerender`)
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

  // ---------live skill end-----
}

ActionGroup.proptypes = {
  user: PropTypes.object,
  skill: PropTypes.object,
  platform: PropTypes.string,
  live_mode: PropTypes.bool,
  showSettings: PropTypes.object,
  vendors: PropTypes.arrayOf(PropTypes.object),

  updateSkill: PropTypes.func,
  setError: PropTypes.func,
  saveSkill: PropTypes.func,
  getVendors: PropTypes.func,
  showSettingsModal: PropTypes.func,
  unfocus: PropTypes.func,
  setCB: PropTypes.func,
  onSave: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.account,
  skill: state.skills.skill,
  platform: state.skills.skill.platform,
  live_mode: state.skills.live_mode,
  vendors: state.account.vendors,
  showSettings: state.modal.showSettings,
});

const mapDispatchToProps = (dispatch) => ({
  updateSkill: (type, val) => dispatch(updateVersion(type, val)),
  setError: (err) => dispatch(setError(err)),
  saveSkill: (publish, cb) => dispatch(updateSkillDB(publish, cb)),
  getVendors: () => dispatch(getVendors()),
  showSettingsModal: (showSettings, tab) => dispatch(showSettingsModal(showSettings, tab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionGroup);

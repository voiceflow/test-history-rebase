import '../ActionGroup.css';
import 'react-sweet-progress/lib/style.css';

import axios from 'axios';
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Progress } from 'react-sweet-progress';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { googleAccessToken } from '@/ducks/account';
import { setError, showSettingsModal } from '@/ducks/modal';
import { updateSkillDB } from '@/ducks/version';

import Settings from '../../../../Skill/Settings';
import UploadButton from '../../UploadButton/UploadButton';
import { ENDING_STAGES, STAGE_PERCENTAGES } from '../Constants';
import { DisplayUploadPrompt, SettingsModal } from '../popups';
import SubTitleActions from '../sub-title-actions';
import { loading } from '../utils';
import GoogleBody from './popup-body';

export class ActionGroup extends PureComponent {
  state = {
    saving: null,
    google_stage: 0,
    is_first_upload: false,
    live_update_stage: 0,
    percent: 0,
    show_upload_prompt: false,
    updateLiveModal: false,
  };

  google_token = null;

  loading_timeout = null;
  // timeout=null;

  render() {
    const { show_upload_prompt, updateLiveModal } = this.state;
    const { skill, platform, live_mode, showSettings, showSettingsModal, unfocus } = this.props;

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
          platform={platform}
          project_id={skill.project_id}
          openUpdateLive={this.openUpdateLive}
          isUploadLoading={this.isUploadLoading()}
          openUpdate={this.openUpdate}
          toggle_upload_prompt={this.toggleUploadPrompt}
        />

        <DisplayUploadPrompt onButtonClick={this.closePrompt} showPrompt={show_upload_prompt}>
          {updateLiveModal ? this.renderLiveStage() : this.renderBody(false)}
        </DisplayUploadPrompt>

        <SettingsModal isOpen={showSettings.show} onToggle={() => showSettingsModal(false)}>
          <Settings {...this.props} tag={showSettings.tag} />
        </SettingsModal>
      </>
    );
  }

  // Step 1
  async componentDidMount() {
    try {
      const { token } = await googleAccessToken();
      this.google_token = token;
    } catch (err) {
      console.error('this error', err);
    }

    this.reset();
  }

  // Step 2
  reset = () => {
    const { user } = this.props;

    this.setState({
      percent: 1,
      google_stage: this.google_token ? 2 : 0,
      is_first_upload: localStorage.getItem(`is_first_session_${user.creator_id}`) !== 'false',
    });
  };

  // Step 3
  toggleUploadPrompt = () => this.setState({ show_upload_prompt: !this.state.show_upload_prompt });

  // Step 4
  isUploadLoading = () => {
    const { saving, google_stage, live_update_stage } = this.state;
    const { platform, live_mode } = this.props;

    if (live_mode) {
      // checkes if live stage is enabled(0) and is done publishing (2)
      return ![0, 2].includes(live_update_stage);
    }

    if (saving) return true;

    return !ENDING_STAGES[platform].includes(google_stage) && ![0, 5].includes(google_stage);
  };

  // Step 5
  openUpdate = () => {
    const { is_first_upload } = this.state;
    const { setCB, onSave } = this.props;

    this.reset();
    // if (this.timeout) clearInterval(this.timeout);
    if (is_first_upload) {
      setCB(() => {
        this.updateGoogle();
      });
      onSave();
    } else {
      this.setState({ saving: true }, () => {
        setCB(() => {
          this.updateGoogle();
          this.setState({ saving: false });
        });
        onSave();
      });
    }
  };

  // Step 6
  updateGoogle = () => {
    const { google_stage } = this.state;
    const {
      skill: { google_publish_info, google_id, skill_id, project_id },
      history,
      setError,
    } = this.props;

    if ([0, 1].includes(google_stage) || !google_publish_info || !google_id) {
      history.push(`/publish/${skill_id}/google`);
      return;
    }

    this.updateGoogleStage(3);

    axios
      .post(`/project/${project_id}/render`, {
        google_id,
        platform: 'google',
      })
      .then((res) => {
        this.updateGoogleStage(4);
        const new_version_data = res.data;
        axios
          .post(`/project/${project_id}/version/${new_version_data.new_skill.skill_id}/google`)
          .then((res) => {
            this.uploadSuccess(res.data);
          })
          .catch((err) => {
            this.setState({
              show_upload_prompt: true,
            });
            this.updateGoogleStage(2);
            const error_msg = err.response && err.response.data ? err.response.data : err;
            setError(error_msg);
          });
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Step 7
  updateGoogleStage = (stage) => {
    const { is_first_upload } = this.state;
    if ([2, 5].includes(stage) && !is_first_upload) {
      this.setState({
        show_upload_prompt: !is_first_upload,
      });
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

  // Step 8
  increment = (limit) => {
    const { percent } = this.state;
    if (percent <= limit) {
      this.setState({ percent: percent + 1 });
      this.loading_timeout = setTimeout(() => this.increment(limit), 250);
    }
  };

  // Step 9
  uploadSuccess = (google_id) => {
    const { google_id: stateGoogleId } = this.state;
    const { user } = this.props;
    // Track upload on first session
    // They completed their first upload successfully
    this.setState({
      google_id: google_id || stateGoogleId,
    });

    this.updateGoogleStage(5);

    if (localStorage.getItem(`is_first_session_${user.creator_id}`) !== 'false') {
      localStorage.setItem(`is_first_session_${user.creator_id}`, 'false');
      setTimeout(() => this.setState({ should_pop_confetti: true }), 300);
      axios.post('/analytics/track_first_session_upload');
    }
  };

  // Step 10 - used in <DisplayUploadPrompt />
  closePrompt = () => {
    this.setState({ show_upload_prompt: false });
    !this.isUploadLoading() && this.reset();
    this.props.live_mode && this.setState({ live_update_stage: 0 });
  };

  // Step 11
  renderBody = (modal) => {
    const { saving, percent, google_stage } = this.state;

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
        {![0].includes(google_stage) && !ENDING_STAGES.google.includes(google_stage) && (
          <div
            className={cn('mb-3', 'text-center', {
              'mt-3': !modal,
            })}
          >
            <Progress type="circle" strokeWidth={5} theme={{ default: { color: '#42a5ff' } }} percent={percent} />
          </div>
        )}
        <GoogleBody modal={modal} stateProps={this.state} updateGoogle={this.updateGoogle} {...this.props} />
      </>
    );
  };

  // live  version methods
  // Step 12
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

  // Step 13 - used in UploadButton
  openUpdateLive = () => {
    const { onSave } = this.props;
    this.setState({
      updateLiveModal: true,
    });
    onSave();
  };

  // Step 14 - used in Step 12
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
}

ActionGroup.proptypes = {
  user: PropTypes.object,
  skill: PropTypes.object,
  platform: PropTypes.string,
  live_mode: PropTypes.bool,
  showSettings: PropTypes.object,

  setError: PropTypes.func,
  saveSkill: PropTypes.func,
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
  showSettings: state.modal.showSettings,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (err) => dispatch(setError(err)),
  saveSkill: (publish, cb) => dispatch(updateSkillDB(publish, cb)),
  showSettingsModal: (showSettings, tab) => dispatch(showSettingsModal(showSettings, tab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionGroup);

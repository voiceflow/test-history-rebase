import axios from 'axios';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';
import { compose } from 'recompose';

import Button from '@/components/Button';
// Components
import Header from '@/components/Header';
import DefaultModal from '@/components/Modals/DefaultModal';
import SecondaryNavBar from '@/components/NavBar/SecondaryNavBar';
import { Spinner } from '@/components/Spinner/Spinner';
import Migrate from '@/containers/Skill/Migrate';
// Ducks
import { unnormalize } from '@/ducks/_normalize';
import { getVendors } from '@/ducks/account';
import { fetchDiagrams } from '@/ducks/diagram';
import { fetchDisplays } from '@/ducks/display';
import { fetchProducts } from '@/ducks/product';
import { fetchVersion, resetVersion, setLiveModeModal, updateVersion } from '@/ducks/version';
// HOCs
import { errorScreen, loadSession, socketCheck } from '@/hocs/socketCheck';

import Business from './containers/Business';
// Views
import Canvas from './containers/Canvas';
import Logs from './containers/Logs';
import Publish from './containers/Skill/Publish';
import Settings from './containers/Skill/Settings';
import Visuals from './containers/Visuals';

const live_modal_content = (
  <div className="text-center">
    <img className="modal-img-small mb-4 mt-3" src="/warning.svg" alt="Upload" />
    <div className="modal-bg-txt mt-2">Entering Live Editing</div>
    <div className="modal-txt mt-2 mb-3">
      Updating your skill in live mode will not affect the live version of the skill until you hit the upload button.
    </div>
  </div>
);

/* Code for detecting whether a user visits a different tab */
let hidden = null;
let visibilityChange = null;
// eslint-disable-next-line compat/compat
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

const ENDING_STAGES = {
  alexa: [2, 4, 9, 10],
  google: [2, 5],
};

class Skill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: true,
      linter: [],
      upgrade_modal: false,
      selected_plan: 1,
      load_skill: true,
      editName: false,
    };

    this.time_mounted = null;

    this.renderPage = this.renderPage.bind(this);
    this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this);

    this.child_canvas = React.createRef();
    this.trackCanvasTime = this.trackCanvasTime.bind(this);

    /* Logic for detecting when page refreshed */
    // eslint-disable-next-line compat/compat
    if (window.performance && performance.navigation.type === 1) {
      this.trackCanvasTime();
    }
  }

  trackCanvasTime() {
    const time_unmounted = new Date();
    if (this.props.skill) {
      axios.post('/analytics/track_session_time', {
        duration: time_unmounted - this.time_mounted,
        skill_id: this.props.skill.skill_id,
      });
    }
    this.time_mounted = null;
  }

  componentGracefulUnmount() {
    this.setState({ mounted: false });
    window.removeEventListener('beforeunload', this.componentGracefulUnmount);
  }

  async componentDidMount() {
    this.setState({
      mounted: true,
    });
    window.addEventListener('beforeunload', this.componentGracefulUnmount);
    await this.props.getVendors();
    if (_.has(this.props, ['computedMatch', 'params', 'skill_id'])) {
      this.props.getVersion(this.props.computedMatch.params.skill_id, this.props.preview, this.props.computedMatch.params.diagram_id).then(() => {
        document.title = this.props.skill.name !== undefined ? this.props.skill.name : 'Voiceflow Creator';
        this.setState({ load_skill: false });
        if (!this.props.preview) {
          // LOAD MULTIMODAL/VISUAL TEMPLATES
          try {
            this.props.getDisplays(this.props.skill.skill_id);
          } catch (err) {
            console.error(err);
          }

          // LOAD PRODUCTS
          if (this.props.skill.locales && this.props.skill.locales.includes('en-US')) {
            try {
              this.props.getProducts(this.props.skill.skill_id);
            } catch (err) {
              console.error(err);
            }
          }
        }
      });
      this.props.getDiagrams(this.props.computedMatch.params.skill_id);
    } else {
      this.setState({
        load_skill: false,
      });
    }
    document.addEventListener(visibilityChange, this.handleVisibilityChange, false);
    this.time_mounted = new Date();
  }

  componentWillUnmount() {
    if (this.props.skill) {
      this.trackCanvasTime();
    }
    this.props.resetSkill();

    document.removeEventListener(visibilityChange, this.handleVisibilityChange);
    this.componentGracefulUnmount();

    document.title = 'Voiceflow Creator';
  }

  handleVisibilityChange = () => {
    // eslint-disable-next-line compat/compat
    if (document[hidden]) {
      this.trackCanvasTime();
    } else {
      this.time_mounted = new Date();
    }
  };

  toggleGoogle = () => {
    const platform = this.props.skill.platform === 'google' ? 'alexa' : 'google';
    // eslint-disable-next-line lodash/prefer-noop
    this.props.updateSkill('platform', platform).then(() => {
      // this.props.updateGoogleFade();
      // this.props.updateLinter()
    });
  };

  renderPage() {
    switch (this.props.page) {
      case 'canvas':
      case 'test':
        return (
          <Canvas
            {...this.props}
            live_mode={this.props.live_mode}
            ref={this.child_canvas}
            linter={this.state.linter}
            toggleUpgrade={this.toggleUpgrade}
            test={this.props.page === 'test'}
          />
        );
      case 'tools':
        return <Business {...this.props} page={this.props.secondaryPage} toggleUpgrade={this.toggleUpgrade} />;
      case 'settings':
        return <Settings {...this.props} page={this.props.secondaryPage} live_mode={this.props.live_mode} toggleUpgrade={this.toggleUpgrade} />;
      case 'publish':
        return <Publish {...this.props} page={this.props.secondaryPage} />;
      case 'logs':
        return <Logs {...this.props} />;
      case 'visuals':
        return <Visuals {...this.props} page={this.props.secondaryPage} />;
      case 'migrate':
        return <Migrate {...this.props} />;
      default:
        return null;
    }
  }

  isUploadLoading = () => {
    if (this.state.saving) return true;
    if (this.props.platform === 'alexa') {
      return !ENDING_STAGES[this.props.platform].includes(this.state.stage) && ![0, 5, 6, 8].includes(this.state.stage);
    }
    return !ENDING_STAGES[this.props.platform].includes(this.state.google_stage) && ![0, 5, 6, 8].includes(this.state.google_stage);
  };

  displayUploadPrompt = () => {
    if (this.state.show_upload_prompt) {
      return (
        <div className="upload-success-popup">
          <Button className="close close-upload-success-popup mt-2" onClick={this.closePrompt} />
          {this.renderBody(false)}
        </div>
      );
    }
  };

  renderUploadButton = () => {
    if (this.props.live_mode) {
      return (
        <Tooltip html={<div style={{ width: 155 }}>Update your live version with your local changes</div>} position="bottom" distance={16}>
          <Button variant="contained" className="publish-btn" onClick={this.openUpdateLive}>
            Update Live{' '}
            <div className="launch">
              <div className="first">
                <img src="/up.svg" alt="upload" width="16" height="16" />
              </div>
              <div className="second">
                <img src="/rocket.svg" alt="check" width="16" height="16" />
              </div>
            </div>
          </Button>
        </Tooltip>
      );
    }
    if (this.isUploadLoading()) {
      return (
        <Button isPublish disabled variant="contained" onClick={() => this.setState({ show_upload_prompt: !this.state.show_upload_prompt })}>
          <p className="loading-btn m-0 p-0">Uploading</p>
          <div className="launch">
            <div className="load-spinner pt-1">
              <span className="save-loader-white" />
            </div>
          </div>
        </Button>
      );
    }
    return (
      <Tooltip
        html={
          <div style={{ width: 155 }}>
            {this.props.platform === 'google'
              ? 'Test your Action on your own Google device, or in the Google Actions console'
              : 'Test your Skill on your own Alexa device, or in the Alexa developer console'}
          </div>
        }
        position="bottom"
        distance={16}
      >
        <Button isPublish variant="contained" onClick={this.openUpdate}>
          {this.props.platform === 'google' ? 'Upload to Google' : 'Upload to Alexa'}
          <div className="launch">
            <div className="first">
              <img src="/up.svg" alt="upload" width="15" height="15" />
            </div>
            <div className="second">
              <img src="/check-white.svg" alt="check" width="15" height="15" />
            </div>
          </div>
        </Button>
      </Tooltip>
    );
  };

  render() {
    if (!this.state.mounted) return null;

    if (this.props.errorScreen) {
      return <div className="super-center w-100 h-100">{this.props.errorScreen}</div>;
    }

    if (this.props.skill_error) {
      return (
        <div className="super-center w-100 h-100">
          <Alert color="danger">{this.props.skill_error}</Alert>
        </div>
      );
    }

    return (
      <>
        <DefaultModal
          open={this.props.show_live_mode_modal}
          toggle={() => {
            this.props.setLiveModal(false);
          }}
          content={live_modal_content}
          header="Live Mode Disclaimer"
          close_button_text="Confirm"
        />
        {this.state.load_skill ||
        this.props.load_diagram ||
        this.props.loadSession ||
        ((!this.props.skill || !this.props.skill.skill_id) && !this.props.new) ? (
          React.createElement(Spinner, { name: 'Project' })
        ) : (
          <>
            <div id="app" className={this.props.page}>
              {this.props.page !== 'canvas' && this.props.page !== 'test' && (
                <div className="main-container-header">
                  <Header
                    // title={this.props.skill.name}
                    history={this.props.history}
                    leftRenderer={() => (
                      <div onDoubleClick={() => this.setState({ editName: true })}>
                        <Link to="/" className="mx-3">
                          <img src="/back.svg" alt="back" className="mr-3" />
                        </Link>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {this.state.editName ? (
                          <input
                            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                            className="edit-input"
                            value={this.props.skill.name}
                            onChange={(e) => {
                              this.props.updateSkill('name', e.target.value);
                              this.props.updateSkill('inv_name', e.target.value);
                            }}
                            onBlur={() => this.setState({ editName: false })}
                          />
                        ) : this.props.skill && this.props.skill.name ? (
                          this.props.skill.name
                        ) : (
                          'Loading Skill'
                        )}
                      </div>
                    )}
                    subHeaderRenderer={() => !this.props.preview && <SecondaryNavBar page={this.props.page} history={this.props.history} />}
                  />
                </div>
              )}
              {this.renderPage()}
            </div>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  platform: state.skills.skill.platform,
  diagram_id: state.skills.skill.diagram,
  skill_error: state.skills.error,
  load_diagram: state.diagrams.loading,
  error: state.skills.error,
  show_live_mode_modal: state.skills.show_live_mode_modal,
  live_mode: state.skills.live_mode,
  dev_skill: state.skills.dev_skill ? state.skills.dev_skill : state.skills.skill,
  user: state.account,
  boards_array: unnormalize(state.board),
  team_id: state.team.team_id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getDiagrams: (skill_id) => dispatch(fetchDiagrams(skill_id)),
    getVersion: (version_id, preview, diagram_id) => dispatch(fetchVersion(version_id, preview, diagram_id)),
    setLiveModal: (isLive) => dispatch(setLiveModeModal(isLive)),
    getProducts: (skill_id) => dispatch(fetchProducts(skill_id)),
    getDisplays: (skill_id) => dispatch(fetchDisplays(skill_id)),
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    resetSkill: () => dispatch(resetVersion()),
    getVendors: () => dispatch(getVendors()),
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  errorScreen,
  loadSession,
  socketCheck
)(Skill);

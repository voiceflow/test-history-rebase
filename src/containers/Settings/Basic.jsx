import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';
import Toggle from 'react-toggle';
import { Collapse, FormGroup, Input, Label } from 'reactstrap';

import Button from '@/components/Button';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import SvgIcon from '@/components/SvgIcon';
import Prompt from '@/components/Uploads/Prompt';
import { setError } from '@/ducks/modal';
import { activeSkillSelector, getImportToken, saveSkillSettings, skillMetaSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

class BasicSettings extends Component {
  constructor(props) {
    super(props);
    const { invName, resumePrompt, repeat, restart } = props.meta;
    const { name } = props.skill;
    // creates a copy of settings as local state and updates redux store when saved
    this.state = {
      name,
      settings: {
        repeat,
        restart,
        invName,
        resumePrompt: resumePrompt || { voice: 'Alexa', content: '' },
      },
      hideResume: !resumePrompt,
      resumeCollapse: !!resumePrompt && !!resumePrompt.follow_content,
      importCollapse: false,
    };

    // compare against for diff
    this.baseline = JSON.stringify(this.state);
  }

  componentDidMount() {
    this.props.getImportToken();
  }

  componentWillUnmount() {
    this.saveSettings();
  }

  toggleResumeFollowUp = () => {
    this.setState({
      resumeCollapse: !this.state.resumeCollapse,
    });
  };

  toggleRepeat = (low, high) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { repeat: { $set: settings.repeat > low ? low : high } }),
    });
  };

  handleUpdate = (e) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { [e.target.name]: { $set: e.target.value } }),
    });
  };

  updateName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  updateResumePrompt = (prompt) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { resumePrompt: { $merge: prompt } }),
    });
  };

  toggleSwitch = (e) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { [e.target.name]: { $set: !settings[e.target.name] } }),
    });
  };

  saveSettings = async () => {
    const { name, settings, hideResume, resumeCollapse } = this.state;
    const { setError, saveSkillSettings } = this.props;

    // Don't save if nothing has changed - save me some HTTP calls
    const stateString = JSON.stringify(this.state);
    if (this.baseline === stateString) return;
    this.baseline = stateString;

    const tempSettings = _.cloneDeep(settings);
    tempSettings.name = name;
    if (hideResume || !settings.resumePrompt.content) {
      // if hidden (toggled off or no content) set to null
      tempSettings.resumePrompt = null;
    } else if (!resumeCollapse) {
      // if collapsed remove all traces of follow content/voice
      delete tempSettings.resumePrompt.follow_content;
      delete tempSettings.resumePrompt.follow_voice;
    }

    try {
      await saveSkillSettings(tempSettings);
    } catch (err) {
      setError('Settings Save Error');
    }
  };

  render() {
    const { meta } = this.props;
    const { importToken } = meta;

    const { name, resumeCollapse, importCollapse, hideResume, settings } = this.state;
    const { invName, repeat, restart, resumePrompt } = settings;

    return (
      <div>
        <div className="settings-content pb-11 no-bottom mt-4">
          <FormGroup>
            <Label>Project Name</Label>
            <Input className="form-bg mb-3" name="name" value={name} onChange={this.updateName} placeholder="Enter Project Name" />
            <Label>Invocation Name</Label>
            <Input className="form-bg" type="text" name="invName" placeholder="Enter invocation name" value={invName} onChange={this.handleUpdate} />
          </FormGroup>
          <hr />
          <FormGroup>
            {/* <Label className="mb-1">Repeat</Label> */}
            <div className="helper-text">
              <div className="row space-between">
                {/* <div className="helper-text col-10">Users will be able to say repeat at any choice/interaction and the dialog will repeat</div> */}
                <div className="col-10 s__label_text">
                  Allow Users to Repeat
                  <Tooltip
                    html="Users will be able to say repeat at any choice/interaction and the dialog will repeat"
                    className="s__label_tooltip"
                    position="top"
                  >
                    <img alt="info" src="/info.svg" />
                  </Tooltip>
                </div>
                <div className="col-2">
                  <Toggle icons={false} checked={repeat > 0} onChange={() => this.toggleRepeat(0, 100)} />
                </div>
              </div>
            </div>
            {repeat > 0 && (
              <>
                <hr />
                <div className="helper-text">
                  <div className="row space-between">
                    <div className="s__label_text col-10">
                      Complete Repeat
                      <Tooltip
                        html={
                          repeat > 1
                            ? 'When the user asks to repeat, everything after the last choice/interaction block will repeat'
                            : 'When the user asks to repeat, only the last speak block before the choice/interaction will be repeated'
                        }
                        className="s__label_tooltip"
                        position="top"
                      >
                        <img alt="info" src="/info.svg" />
                      </Tooltip>
                    </div>
                    <div className="col-2">
                      <Toggle icons={false} checked={repeat > 1} onChange={() => this.toggleRepeat(1, 100)} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </FormGroup>
          <hr />
        </div>
        <div className="settings-content settings-basic no-bottom">
          <FormGroup>
            {/* <Label className="mb-1">Restart Every Session</Label> */}
            <div className="helper-text">
              <div className="row space-between">
                <div className="s__label_text col-10">
                  Restart Every Session
                  <Tooltip
                    html={
                      restart
                        ? 'The project will restart from the beginning every time the user starts a session'
                        : 'The project will resume from the last block the user was on before quitting'
                    }
                    className="s__label_tooltip"
                    position="top"
                  >
                    <img alt="info" src="/info.svg" />
                  </Tooltip>
                </div>
                <div className="col-2">
                  <Toggle icons={false} name="restart" checked={restart} onChange={this.toggleSwitch} />
                </div>
              </div>
            </div>
            <hr />
            {!restart && (
              <>
                {/* <Label className="mb-1">Resume Prompt</Label> */}
                <div className="helper-text">
                  <div className="row space-between mb-3">
                    <div className="s__label_text col-10">
                      Allow Users to Resume
                      <Tooltip html="Give the user a YES/NO prompt whether to resume" className="s__label_tooltip" position="top">
                        <img alt="info" src="/info.svg" />{' '}
                      </Tooltip>
                    </div>
                    <div className="col-2">
                      <Toggle
                        name="restart"
                        checked={!hideResume}
                        onChange={() =>
                          this.setState({
                            hideResume: !hideResume,
                          })
                        }
                        icons={false}
                      />
                    </div>
                  </div>
                </div>
                {!hideResume && (
                  <>
                    <Prompt
                      placeholder="Welcome back, would you like to resume?"
                      voice={resumePrompt.voice}
                      content={resumePrompt.content}
                      updatePrompt={this.updateResumePrompt}
                    />
                    <Collapse isOpen={resumeCollapse} className="pt-3">
                      <Label>Resume Follow Up</Label>
                      <div className="helper-text mb-2">Add a response when the user wants to resume</div>
                      <Prompt
                        placeholder="Welcome back, would you like to resume?"
                        voice_id="follow_voice"
                        content_id="follow_content"
                        voice={resumePrompt.follow_voice}
                        content={resumePrompt.follow_content}
                        updatePrompt={this.updateResumePrompt}
                      />
                    </Collapse>
                    <Button isClear className="mt-3" onClick={this.toggleResumeFollowUp}>
                      {resumeCollapse ? 'Cancel Follow Up' : 'Resume Follow Up'}
                    </Button>
                  </>
                )}
                <hr />
              </>
            )}
          </FormGroup>
        </div>
        <div className="settings-content settings-basic no-bottom">
          <FormGroup>
            <div className="helper-text">
              <div className="row space-between mb-3" onClick={() => this.setState({ importCollapse: !importCollapse })}>
                <div className="s__label_text col-11">
                  Downloadable Link
                  <Tooltip
                    html="This link allows someone to import this project into their Voiceflow Account"
                    className="s__label_tooltip"
                    position="top"
                  >
                    <img alt="info" src="/info.svg" />
                  </Tooltip>
                </div>
                <SvgIcon icon="arrowLeft" color="#BECEDC" size={13} style={{ transform: importCollapse ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
              </div>
              <Collapse isOpen={importCollapse}>
                <ClipBoard name="link" value={`${window.location.origin}/dashboard?import=${importToken}`} id="shareLink" />
              </Collapse>
            </div>
            <hr />
          </FormGroup>
        </div>
      </div>
    );
  }
}

const mapStateToProps = {
  meta: skillMetaSelector,
  skill: activeSkillSelector,
};

const mapDispatchToProps = {
  setError,
  saveSkillSettings,
  getImportToken,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicSettings);

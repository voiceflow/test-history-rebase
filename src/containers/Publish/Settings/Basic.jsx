import axios from 'axios';
import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import Toggle from 'react-toggle';
import { Collapse, FormGroup, Input, Label } from 'reactstrap';

import Button from '@/components/Button';
import Prompt from '@/components/Uploads/Prompt';
import { setError } from '@/ducks/modal';
import { updateVersionMerge } from '@/ducks/version';

class BasicSettings extends Component {
  constructor(props) {
    super(props);

    const { name, inv_name, resume_prompt, repeat, restart } = props.skill;
    // creates a copy of settings as local state and updates redux store when saved
    this.state = {
      settings: {
        name,
        repeat,
        restart,
        inv_name,
        resume_prompt: resume_prompt || { voice: 'Alexa', content: '' },
      },
      hideResume: !resume_prompt,
      resumeCollapse: !!resume_prompt && resume_prompt.follow_content,
    };

    // compare against for diff
    this.baseline = JSON.stringify(this.state);
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

  updateResumePrompt = (prompt) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { resume_prompt: { $merge: prompt } }),
    });
  };

  toggleSwitch = (e) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { [e.target.name]: { $set: !settings[e.target.name] } }),
    });
  };

  saveSettings = async () => {
    const { settings, hideResume, resumeCollapse } = this.state;
    const { setError, updateVersionMerge, skill } = this.props;

    // Don't save if nothing has changed - save me some HTTP calls
    const stateString = JSON.stringify(this.state);
    if (this.baseline === stateString) return;
    this.baseline = stateString;

    const tempSettings = _.cloneDeep(settings);

    if (hideResume || !settings.resume_prompt.content) {
      // if hidden (toggled off or no content) set to null
      tempSettings.resume_prompt = null;
    } else if (!resumeCollapse) {
      // if collapsed remove all traces of follow content/voice
      delete tempSettings.resume_prompt.follow_content;
      delete tempSettings.resume_prompt.follow_voice;
    }

    try {
      await axios.patch(`/skill/${skill.skill_id}?settings=1`, tempSettings);
      updateVersionMerge(tempSettings);
    } catch (err) {
      setError('Settings Save Error');
    }
  };

  render() {
    const { name, inv_name, repeat, restart, resume_prompt } = this.state.settings;
    const { resumeCollapse, hideResume } = this.state;
    return (
      <>
        <div className="settings-content clearfix pb-11 no-bottom">
          <FormGroup>
            <Label>Project Name</Label>
            <Input className="form-bg mb-3" name="name" value={name} onChange={this.handleUpdate} placeholder="Enter Project Name" />
            <Label>Invocation Name</Label>
            <Input
              className="form-bg"
              type="text"
              name="inv_name"
              placeholder="Enter invocation name"
              value={inv_name}
              onChange={this.handleUpdate}
            />
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
        <div className="settings-content settings-basic clearfix no-bottom">
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
                {hideResume && <hr />}
                {!hideResume && (
                  <>
                    <Prompt
                      placeholder="Welcome back, would you like to resume?"
                      voice={resume_prompt.voice}
                      content={resume_prompt.content}
                      updatePrompt={this.updateResumePrompt}
                    />
                    <Collapse isOpen={resumeCollapse} className="pt-3">
                      <Label>Resume Follow Up</Label>
                      <div className="helper-text mb-2">Add a response when the user wants to resume</div>
                      <Prompt
                        placeholder="Welcome back, would you like to resume?"
                        voice_id="follow_voice"
                        content_id="follow_content"
                        voice={resume_prompt.follow_voice}
                        content={resume_prompt.follow_content}
                        updatePrompt={this.updateResumePrompt}
                      />
                    </Collapse>
                    <Button isClear className="mt-3" onClick={this.toggleResumeFollowUp}>
                      {resumeCollapse ? 'Cancel Follow Up' : 'Resume Follow Up'}
                    </Button>
                  </>
                )}
              </>
            )}
          </FormGroup>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  skill: state.skills.skill,
});

const mapDispatchToProps = {
  updateVersionMerge,
  setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicSettings);

import 'brace/mode/json';
import 'brace/ext/language_tools';

import axios from 'axios';
import Button from 'components/Button';
import Prompt from 'components/Uploads/Prompt';
import { setError } from 'ducks/modal';
import { updateVersion, updateVersionMerge } from 'ducks/version';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import { Collapse, FormGroup, Input, Label } from 'reactstrap';

const disabled_stages = new Set([11, 12]);

class BasicSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide_resume: !props.skill.resume_prompt,
    };

    if (!props.skill.error_prompt) {
      const error_prompt = {
        voice: 'Alexa',
        content: '',
      };
      props.skill.error_prompt = error_prompt;
    }
    if (!props.skill.resume_prompt) {
      const resume_prompt = {
        voice: 'Alexa',
        content: '',
      };
      props.skill.resume_prompt = resume_prompt;
    }
    if (!props.skill.alexa_events) {
      props.skill.alexa_events = '';
    }

    this.baseline = _.cloneDeep(props.skill);

    this.state.resume_collapse = props.skill.resume_prompt ? !!props.skill.resume_prompt.follow_content : false;
  }

  componentWillUnmount() {
    this.saveSettings();
  }

  toggleResumeFollowUp() {
    const { resume_collapse } = this.state;
    this.setState({
      resume_collapse: !resume_collapse,
    });
  }

  toggleRepeat = (low, high) => {
    this.props.updateSkill('repeat', this.props.skill.repeat > low ? low : high);
  };

  handleUpdate = (e) => {
    this.props.updateSkill(e.target.name, e.target.value);
  };

  toggleSwitch = (e) => {
    this.props.updateSkill(e.target.name, !this.props.skill[e.target.name]);
  };

  saveSettings = () => {
    if (this.state.hide_resume || !this.props.skill.resume_prompt.content) {
      this.props.updateSkill('resume_prompt', null);
    } else if (!this.state.resume_collapse) {
      delete this.props.skill.resume_prompt.follow_content;
      delete this.props.skill.resume_prompt.follow_voice;
    }

    // Don't save if nothing has changed - save me some HTTP calls
    if (_.isEqual(this.baseline, skill)) return;
    // this.baseline = _.cloneDeep(skill)

    if (!skill.error_prompt.content) {
      updateSkill('error_prompt', null);
    }
    if (skill.alexa_events.trim()) {
      try {
        JSON.parse(skill.alexa_events);
      } catch (err) {
        setError(`Invalid JSON For Skill Events: ${err.message}`);
        return;
      }
    } else {
      updateSkill('alexa_events', null);
    }

    axios.patch(`/skill/${skill.skill_id}?settings=1`, skill).catch(() => {
      setError('Settings Save Error');
    });
  };

  render() {
    const { name, inv_name } = this.props.skill;
    return (
      <React.Fragment>
        <div className="settings-content clearfix mt-4">
          <FormGroup>
            <Label>Project Name</Label>
            <Input className="form-bg mb-4" name="name" value={skill.name} onChange={this.handleUpdate} />
            <Label>Invocation Name</Label>
            <Input
              className="form-bg"
              type="text"
              name="inv_name"
              disabled={disabled_stages.has(this.state.stage)}
              placeholder="Enter invocation name"
              value={inv_name}
              onChange={this.handleUpdate}
            />
          </FormGroup>
          <hr />
          <FormGroup>
            <Label className="mb-1">Repeat</Label>
            <div className="helper-text mb-3">
              <div className="row mb-3 space-between">
                <div className="helper-text col-10">Users will be able to say repeat at any choice/interaction and the dialog will repeat</div>
                <div className="col-2">
                  <Toggle icons={false} checked={skill.repeat > 0} onChange={() => this.toggleRepeat(0, 100)} />
                </div>
              </div>
            </div>

            {skill.repeat > 0 && (
              <React.Fragment>
                <Label className="mb-1">Complete Repeat</Label>
                <div className="row">
                  <div className="helper-text col-10">
                    {skill.repeat > 1
                      ? 'When the user asks to repeat, everything after the last choice/interaction block will repeat'
                      : 'When the user asks to repeat, only the last speak block before the choice/interaction will be repeated'}
                  </div>
                  <div className="col-2">
                    <Toggle icons={false} checked={skill.repeat > 1} onChange={() => this.toggleRepeat(1, 100)} />
                  </div>
                </div>
              </React.Fragment>
            )}
          </FormGroup>
        </div>
        <div className="settings-content clearfix mb-5">
          <FormGroup>
            <Label className="mb-1">Restart Every Session</Label>
            <div className="row">
              <div className="helper-text mb-2 col-10">
                {skill.restart
                  ? 'The project will restart from the beginning every time the user starts a session'
                  : 'The project will resume from the last block the user was on before quitting'}
              </div>
              <div className="col-2">
                <Toggle icons={false} name="restart" checked={skill.restart} onChange={this.toggleSwitch} />
              </div>
            </div>
            {!skill.restart && (
              <React.Fragment>
                <Label className="mb-1">Resume Prompt</Label>
                <div className="row">
                  <div className="helper-text mb-2 col-10">Give the user a YES/NO prompt whether to resume</div>
                  <div className="col-2">
                    <Toggle
                      name="restart"
                      checked={!hide_resume}
                      onChange={() =>
                        this.setState({
                          hide_resume: !hide_resume,
                        })
                      }
                      icons={false}
                    />
                  </div>
                </div>
                {!hide_resume && (
                  <React.Fragment>
                    <Prompt
                      placeholder="Would you like to resume your current story, yes or no?"
                      voice={skill.resume_prompt.voice}
                      content={skill.resume_prompt.content}
                      updatePrompt={(prompt) => updateSkillMerge('resume_prompt', prompt)}
                    />
                    <Collapse isOpen={resume_collapse} className="pt-3">
                      <Label>Resume Follow Up</Label>
                      <div className="helper-text mb-2">Add a response when the user wants to resume</div>
                      <Prompt
                        placeholder="Would you like to resume your current story, yes or no?"
                        voice_id="follow_voice"
                        content_id="follow_content"
                        voice={skill.resume_prompt.follow_voice}
                        content={skill.resume_prompt.follow_content}
                        updatePrompt={(prompt) => updateSkillMerge('resume_prompt', prompt)}
                      />
                    </Collapse>
                    <Button isClear className="mt-3" onClick={this.toggleResumeFollowUp}>
                      {resume_collapse ? 'Cancel Follow Up' : 'Resume Follow Up'}
                    </Button>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </FormGroup>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  skill: state.skills.skill,
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    updateSkillMerge: (type, val) => dispatch(updateVersionMerge(type, val)),
    setError: (err) => dispatch(setError(err)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicSettings);

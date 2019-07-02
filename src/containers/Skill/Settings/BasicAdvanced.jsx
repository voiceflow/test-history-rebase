import axios from 'axios';
import AceEditor from 'components/AceEditor';
import Button from 'components/Button';
import DefaultModal from 'components/Modals/DefaultModal';
import Prompt from 'components/Uploads/Prompt';
import { setConfirm, setError } from 'ducks/modal';
import { deleteProject } from 'ducks/project';
import { updateVersion, updateVersionMerge } from 'ducks/version';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import { Alert, Collapse, FormGroup, Input, Label } from 'reactstrap';

import AccountLinkTemplate from '../../Business/AccountLinkTemplate';

class BasicAdvancedSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      hide_resume: !props.skill.resume_prompt,
      show_overwrite_modal: false,
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

    this.confirmDelete = this.confirmDelete.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.toggleRepeat = this.toggleRepeat.bind(this);
    this.overwriteSuccessModal = this.overwriteSuccessModal.bind(this);
    this.confirmOverwrite = this.confirmOverwrite.bind(this);
    this.toggleResumeFollowUp = this.toggleResumeFollowUp.bind(this);
  }

  toggleResumeFollowUp() {
    this.setState({
      resume_collapse: !this.state.resume_collapse,
    });
  }

  toggleRepeat(low, high) {
    this.props.updateSkill('repeat', this.props.skill.repeat > low ? low : high);
  }

  handleUpdate(e) {
    this.props.updateSkill(e.target.name, e.target.value);
  }

  confirmDelete() {
    this.props.setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone, <i>{this.props.skill.name}</i> and all flows can not be recovered
        </Alert>
      ),
      confirm: () =>
        this.props
          .deleteProject(this.props.skill.project_id)
          .then(() => this.props.history.push('/dashboard'))
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
            this.props.setError('Error Deleting Skill');
          }),
    });
  }

  toggleSwitch(e) {
    this.props.updateSkill(e.target.name, !this.props.skill[e.target.name]);
  }

  componentWillUnmount() {
    this.saveSettings();
  }

  saveSettings() {
    if (this.state.hide_resume || !this.props.skill.resume_prompt.content) {
      this.props.updateSkill('resume_prompt', null);
    } else if (!this.state.resume_collapse) {
      delete this.props.skill.resume_prompt.follow_content;
      delete this.props.skill.resume_prompt.follow_voice;
    }

    // Don't save if nothing has changed - save me some HTTP calls
    if (_.isEqual(this.baseline, this.props.skill)) return;
    // this.baseline = _.cloneDeep(this.props.skill)

    if (!this.props.skill.error_prompt.content) {
      this.props.updateSkill('error_prompt', null);
    }
    if (this.props.skill.alexa_events.trim()) {
      try {
        JSON.parse(this.props.skill.alexa_events);
      } catch (err) {
        this.props.setError(`Invalid JSON For Skill Events: ${err.message}`);
        return;
      }
    } else {
      this.props.updateSkill('alexa_events', null);
    }

    axios.patch(`/skill/${this.props.skill.skill_id}?settings=1`, this.props.skill).catch(() => {
      this.props.setError('Settings Save Error');
    });
  }

  overwriteSuccessModal(result) {
    const msg = result ? 'Devlopment version successfully overwritten' : 'Overwrite failed.';

    this.setState({
      show_overwrite_modal: true,
      overwrite_status: msg,
    });
  }

  confirmOverwrite() {
    this.props.setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone and will replace your development version completely with your live version.
        </Alert>
      ),
      confirm: this.props.onSwapVersions,
      params: [this.props.skill.skill_id, true, this.overwriteSuccessModal],
    });
  }

  renderSettings() {
    // check to make sure there are actual differences before making a server call
    if (this.props.page === 'advanced') {
      // ADVANCED SETTINGS
      return (
        <React.Fragment>
          <DefaultModal
            open={this.state.show_overwrite_modal}
            toggle={() => {
              this.setState({ show_overwrite_modal: false });
            }}
            content={this.state.overwrite_status}
            header="Overwrite Status"
          />
          <div className="settings-content clearfix">
            <FormGroup>
              <Label>Error Prompt</Label>
              <div className="helper-text mb-2">What to say if the skill encounters an unexpected error</div>
              <Prompt
                placeholder="Sorry, this skill has encountered an error"
                voice={this.props.skill.error_prompt.voice}
                content={this.props.skill.error_prompt.content}
                updatePrompt={(prompt) => this.props.updateSkillMerge('error_prompt', prompt)}
              />
            </FormGroup>
          </div>
          <div className="settings-content clearfix">
            <FormGroup>
              <div className="mt-4">
                <Label>Skill Events (events: {'{object}'})</Label>
                <AceEditor
                  name="datasource_editor"
                  className="datasource_editor"
                  mode="json"
                  onChange={(value) => {
                    this.props.updateSkill('alexa_events', value);
                  }}
                  fontSize={14}
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.props.skill.alexa_events}
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                    useWorker: false,
                  }}
                />
              </div>
            </FormGroup>
          </div>
          {this.props.live_mode && (
            <div className="settings-content clearfix">
              <FormGroup>
                <Label>Overwrite Development Version with Live Version</Label>
                <Alert color="danger between">
                  <span>This action cannot be undone.</span>
                  <br />
                  <Button isWarning onClick={this.confirmOverwrite}>
                    Overwrite
                  </Button>
                </Alert>
              </FormGroup>
            </div>
          )}
          <div className="settings-content clearfix">
            <AccountLinkTemplate {...this.props} />
          </div>
          <div className="settings-content clearfix">
            <FormGroup>
              <Label>Delete Project</Label>
              <Alert color="danger between">
                <span>This action cannot be undone</span>
                <br />
                <Button isWarning onClick={this.confirmDelete}>
                  Delete Project
                </Button>
              </Alert>
            </FormGroup>
          </div>
        </React.Fragment>
      );
    }

    // BASIC SETTINGS
    return (
      <React.Fragment>
        <div className="settings-content clearfix">
          <FormGroup>
            <Label>Project Name</Label>
            <Input className="form-bg mb-4" name="name" value={this.props.skill.name} onChange={this.handleUpdate} />
          </FormGroup>
          <hr />
          <FormGroup>
            <Label className="mb-1">Repeat</Label>
            <div className="helper-text mb-3">
              <div className="row mb-3 space-between">
                <div className="helper-text col-10">Users will be able to say repeat at any choice/interaction and the dialog will repeat</div>
                <div className="col-2">
                  <Toggle icons={false} checked={this.props.skill.repeat > 0} onChange={() => this.toggleRepeat(0, 100)} />
                </div>
              </div>
            </div>

            {this.props.skill.repeat > 0 && (
              <React.Fragment>
                <Label className="mb-1">Complete Repeat</Label>
                <div className="row">
                  <div className="helper-text col-10">
                    {this.props.skill.repeat > 1
                      ? 'When the user asks to repeat, everything after the last choice/interaction block will repeat'
                      : 'When the user asks to repeat, only the last speak block before the choice/interaction will be repeated'}
                  </div>
                  <div className="col-2">
                    <Toggle icons={false} checked={this.props.skill.repeat > 1} onChange={() => this.toggleRepeat(1, 100)} />
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
                {this.props.skill.restart
                  ? 'The project will restart from the beginning every time the user starts a session'
                  : 'The project will resume from the last block the user was on before quitting'}
              </div>
              <div className="col-2">
                <Toggle icons={false} name="restart" checked={this.props.skill.restart} onChange={this.toggleSwitch} />
              </div>
            </div>
            {!this.props.skill.restart && (
              <React.Fragment>
                <Label className="mb-1">Resume Prompt</Label>
                <div className="row">
                  <div className="helper-text mb-2 col-10">Give the user a YES/NO prompt whether to resume</div>
                  <div className="col-2">
                    <Toggle
                      name="restart"
                      checked={!this.state.hide_resume}
                      onChange={() =>
                        this.setState({
                          hide_resume: !this.state.hide_resume,
                        })
                      }
                      icons={false}
                    />
                  </div>
                </div>
                {!this.state.hide_resume && (
                  <React.Fragment>
                    <Prompt
                      placeholder="Would you like to resume your current story, yes or no?"
                      voice={this.props.skill.resume_prompt.voice}
                      content={this.props.skill.resume_prompt.content}
                      updatePrompt={(prompt) => this.props.updateSkillMerge('resume_prompt', prompt)}
                    />
                    <Collapse isOpen={this.state.resume_collapse} className="pt-3">
                      <Label>Resume Follow Up</Label>
                      <div className="helper-text mb-2">Add a response when the user wants to resume</div>
                      <Prompt
                        placeholder="Would you like to resume your current story, yes or no?"
                        voice_id="follow_voice"
                        content_id="follow_content"
                        voice={this.props.skill.resume_prompt.follow_voice}
                        content={this.props.skill.resume_prompt.follow_content}
                        updatePrompt={(prompt) => this.props.updateSkillMerge('resume_prompt', prompt)}
                      />
                    </Collapse>
                    <Button isClear className="mt-3" onClick={this.toggleResumeFollowUp}>
                      {this.state.resume_collapse ? 'Cancel Follow Up' : 'Resume Follow Up'}
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

  render() {
    return <React.Fragment>{this.renderSettings()}</React.Fragment>;
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  skill: state.skills.skill,
});

const mapDispatchToProps = (dispatch) => {
  return {
    deleteProject: (p_id) => dispatch(deleteProject(p_id)),
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    updateSkillMerge: (type, val) => dispatch(updateVersionMerge(type, val)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (err) => dispatch(setError(err)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicAdvancedSettings);

import 'brace/mode/json';
import 'brace/ext/language_tools';

import axios from 'axios';
import Button from 'components/Button';
import DefaultModal from 'components/Modals/DefaultModal';
import Prompt from 'components/Uploads/Prompt';
import { setConfirm, setError } from 'ducks/modal';
import { deleteProject } from 'ducks/project';
import { updateVersion, updateVersionMerge } from 'ducks/version';
import _ from 'lodash';
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import { Alert, Collapse, FormGroup, Input, Label } from 'reactstrap';

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
    const { resume_collapse } = this.state;
    this.setState({
      resume_collapse: !resume_collapse,
    });
  }

  toggleRepeat(low, high) {
    const { updateSkill, skill } = this.props;
    updateSkill('repeat', skill.repeat > low ? low : high);
  }

  handleUpdate(e) {
    const { updateSkill } = this.props;
    updateSkill(e.target.name, e.target.value);
  }

  confirmDelete() {
    const { setConfirm, skill, history, setError, deleteProject } = this.props;
    setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone, <i>{skill.name}</i> and all flows can not be recovered
        </Alert>
      ),
      confirm: () =>
        deleteProject(skill.project_id)
          .then(() => history.push('/dashboard'))
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
            setError('Error Deleting Skill');
          }),
    });
  }

  toggleSwitch(e) {
    const { updateSkill, skill } = this.props;
    updateSkill(e.target.name, !skill[e.target.name]);
  }

  componentWillUnmount() {
    this.saveSettings();
  }

  saveSettings() {
    const { hide_resume, resume_collapse } = this.state;
    const { skill, updateSkill, setError } = this.props;
    if (hide_resume || !skill.resume_prompt.content) {
      updateSkill('resume_prompt', null);
    } else if (!resume_collapse) {
      delete skill.resume_prompt.follow_content;
      delete skill.resume_prompt.follow_voice;
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
  }

  overwriteSuccessModal(result) {
    const msg = result ? 'Devlopment version successfully overwritten' : 'Overwrite failed.';

    this.setState({
      show_overwrite_modal: true,
      overwrite_status: msg,
    });
  }

  confirmOverwrite() {
    const { setConfirm, onSwapVersions, skill } = this.props;
    setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone and will replace your development version completely with your live version.
        </Alert>
      ),
      confirm: onSwapVersions,
      params: [skill.skill_id, true, this.overwriteSuccessModal],
    });
  }

  renderSettings() {
    const { page, skill, updateSkillMerge, updateSkill, live_mode } = this.props;
    const { show_overwrite_modal, overwrite_status, hide_resume, resume_collapse } = this.state;
    // check to make sure there are actual differences before making a server call
    if (page === 'advanced') {
      // ADVANCED SETTINGS
      return (
        <React.Fragment>
          <DefaultModal
            open={show_overwrite_modal}
            toggle={() => {
              this.setState({ show_overwrite_modal: false });
            }}
            content={overwrite_status}
            header="Overwrite Status"
          />
          <div className="settings-content clearfix mt-4">
            <FormGroup>
              <Label>Error Prompt</Label>
              <div className="helper-text mb-2">What to say if the skill encounters an unexpected error</div>
              <Prompt
                placeholder="Sorry, this skill has encountered an error"
                voice={skill.error_prompt.voice}
                content={skill.error_prompt.content}
                updatePrompt={(prompt) => updateSkillMerge('error_prompt', prompt)}
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
                    updateSkill('alexa_events', value);
                  }}
                  fontSize={14}
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={skill.alexa_events}
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
          {live_mode && (
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
        <div className="settings-content clearfix mt-4">
          <FormGroup>
            <Label>Project Name</Label>
            <Input className="form-bg mb-4" name="name" value={skill.name} onChange={this.handleUpdate} />
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

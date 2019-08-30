// import AceEditor from '@/components/AceEditor';
import axios from 'axios';
import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, FormGroup, Label } from 'reactstrap';

import AceEditor from '@/components/AceEditor';
import Button from '@/components/Button';
import DefaultModal from '@/components/Modals/DefaultModal';
import Prompt from '@/components/Uploads/Prompt';
import AccountLinkTemplate from '@/containers/Business/AccountLinkTemplate';
import { setConfirm, setError } from '@/ducks/modal';
import { deleteProject } from '@/ducks/project';
import { updateVersionMerge } from '@/ducks/version';

class AdvancedSettings extends Component {
  constructor(props) {
    super(props);
    const { error_prompt, alexa_events } = props.skill;

    this.state = {
      saving: false,
      error: null,
      show_overwrite_modal: false,
      settings: {
        alexa_events: alexa_events || '',
        error_prompt: error_prompt || { voice: 'Alexa', content: '' },
      },
    };

    this.baseline = JSON.stringify(this.state.settings);
  }

  componentWillUnmount() {
    this.saveSettings();
  }

  saveSettings = async () => {
    const { setError, skill, updateVersionMerge } = this.props;
    const { settings } = this.state;

    // Don't save if nothing has changed - save me some HTTP calls
    const settingsString = JSON.stringify(settings);
    if (this.baseline === settingsString) return;
    this.baseline = settingsString;

    const tempSettings = _.cloneDeep(settings);

    if (!settings.error_prompt.content) {
      settings.error_prompt = null;
    }

    try {
      await axios.patch(`/skill/${skill.skill_id}?settings=1`, tempSettings);
      updateVersionMerge(tempSettings);
    } catch (err) {
      setError('Settings Save Error');
    }
  };

  updateErrorPrompt = (value) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { error_prompt: { $merge: value } }),
    });
  };

  updateAlexaEvents = (value) => {
    const { settings } = this.state;

    try {
      if (value.trim()) {
        JSON.parse(value);
        this.setState({ error: null });
      }
    } catch (error) {
      this.setState({ error: error.toString() });
    }

    this.setState({
      settings: update(settings, { alexa_events: { $set: value } }),
    });
  };

  confirmDelete = () => {
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
  };

  render() {
    const { settings, error } = this.state;

    return (
      <>
        <DefaultModal
          open={this.state.show_overwrite_modal}
          toggle={() => {
            this.setState({ show_overwrite_modal: false });
          }}
          content={this.state.overwrite_status}
          header="Overwrite Status"
        />
        <div className="settings-advanced clearfix mt-4">
          <FormGroup>
            <Label>Error Prompt</Label>
            <div className="helper-text mb-2">What to say if the skill encounters an unexpected error</div>
            <Prompt
              placeholder="Sorry, this skill has encountered an error"
              voice={settings.error_prompt ? settings.error_prompt.voice : null}
              content={settings.error_prompt ? settings.error_prompt.content : null}
              updatePrompt={this.updateErrorPrompt}
            />
          </FormGroup>
        </div>
        <div className="settings-content mt-5 no-bottom clearfix">
          <AccountLinkTemplate {...this.props} />
        </div>
        <div className="settings-content clearfix my-5">
          <h5 className="text-muted mb-0">Skill Events</h5>
          <hr />
          {error && <div className="text-danger mb-3">{error}</div>}
          <AceEditor
            name="datasource_editor"
            className="datasource_editor"
            mode="json"
            theme="github"
            onChange={this.updateAlexaEvents}
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={settings.alexa_events}
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
        <div className="settings-content no-bottom clearfix">
          <FormGroup>
            <Label>Delete Project</Label>
            <Alert color="danger between" className="mb-0">
              <span>This action cannot be undone</span>
              <br />
              <Button isWarning onClick={this.confirmDelete}>
                Delete Project
              </Button>
            </Alert>
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
  deleteProject,
  updateVersionMerge,
  setConfirm,
  setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedSettings);

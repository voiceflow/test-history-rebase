import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import { FormGroup, Label } from 'reactstrap';

import AceEditor from '@/components/AceEditor';
import Button from '@/components/Button';
import DefaultModal from '@/components/Modal/DefaultModal';
import Prompt from '@/components/Uploads/Prompt';
import { FlexApart } from '@/componentsV2/Flex';
import AccountLinkTemplate from '@/containers/Settings/AccountLinkTemplate';
import { setConfirm, setError } from '@/ducks/modal';
import { deleteProject } from '@/ducks/project';
import { goToDashboard } from '@/ducks/router';
import { activeProjectIDSelector, saveMetaSettings, skillMetaSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

class AdvancedSettings extends Component {
  constructor(props) {
    super(props);
    const { errorPrompt, alexaEvents } = props.meta;

    this.state = {
      saving: false,
      error: null,
      show_overwrite_modal: false,
      settings: {
        alexaEvents: alexaEvents || '',
        errorPrompt: errorPrompt || { voice: 'Alexa', content: '' },
      },
    };

    this.baseline = JSON.stringify(this.state.settings);
  }

  componentWillUnmount() {
    this.saveSettings();
  }

  saveSettings = async () => {
    const { setError, saveMetaSettings } = this.props;
    const { settings } = this.state;

    // Don't save if nothing has changed - save me some HTTP calls
    const settingsString = JSON.stringify(settings);
    if (this.baseline === settingsString) return;
    this.baseline = settingsString;

    const tempSettings = _.cloneDeep(settings);

    if (!settings.errorPrompt.content) {
      settings.errorPrompt = null;
    }

    try {
      await saveMetaSettings(tempSettings);
    } catch (err) {
      setError('Settings Save Error');
    }
  };

  updateErrorPrompt = (value) => {
    const { settings } = this.state;
    this.setState({
      settings: update(settings, { errorPrompt: { $merge: value } }),
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
      settings: update(settings, { alexaEvents: { $set: value } }),
    });
  };

  confirmDelete = () => {
    const { setConfirm, projectID, goToDashboard, setError, deleteProject } = this.props;

    setConfirm({
      warning: true,
      text: 'This action can not be undone, This project and all flows can not be recovered',
      confirm: () => {
        deleteProject(projectID)
          .then(() => goToDashboard())
          .catch((err) => setError(err.message));
      },
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
        <div className="settings-advanced mt-4">
          <FormGroup>
            <Label>Error Prompt</Label>
            <div className="helper-text mb-2">What to say if the skill encounters an unexpected error</div>
            <Prompt
              placeholder="Sorry, this skill has encountered an error"
              voice={settings.errorPrompt ? settings.errorPrompt.voice : null}
              content={settings.errorPrompt ? settings.errorPrompt.content : null}
              updatePrompt={this.updateErrorPrompt}
            />
          </FormGroup>
        </div>
        <div className="settings-content mt-5 no-bottom">
          <AccountLinkTemplate />
        </div>
        <div className="my-5">
          <label>Skill Events</label>
          <hr />
          {error && <div className="text-danger mb-3">{error}</div>}
          <AceEditor
            name="datasource_editor"
            mode="json"
            theme="github"
            onChange={this.updateAlexaEvents}
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={settings.alexaEvents}
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
        <div className="settings-content no-bottom">
          <FormGroup>
            <Label>Delete Project</Label>
            <FlexApart>
              <span>This action cannot be undone</span>
              <Button isWarning onClick={this.confirmDelete}>
                Delete Project
              </Button>
            </FlexApart>
          </FormGroup>
        </div>
      </>
    );
  }
}

const mapStateToProps = {
  meta: skillMetaSelector,
  projectID: activeProjectIDSelector,
};

const mapDispatchToProps = {
  deleteProject,
  goToDashboard,
  saveMetaSettings,
  setConfirm,
  setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedSettings);

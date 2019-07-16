// import AceEditor from '@/components/AceEditor';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, FormGroup, Label } from 'reactstrap';

import Button from '@/components/Button';
import DefaultModal from '@/components/Modals/DefaultModal';
import Prompt from '@/components/Uploads/Prompt';
import { setConfirm, setError } from '@/ducks/modal';
import { deleteProject } from '@/ducks/project';
import { updateVersion, updateVersionMerge } from '@/ducks/version';

import AccountLinkTemplate from '../../Business/AccountLinkTemplate';

class AdvancedSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      show_overwrite_modal: false,
    };

    if (!props.skill.error_prompt) {
      const error_prompt = {
        voice: 'Alexa',
        content: '',
      };
      props.skill.error_prompt = error_prompt;
    }
    if (!props.skill.alexa_events) {
      props.skill.alexa_events = '';
    }
  }

  overwriteSuccessModal = (result) => {
    const msg = result ? 'Development version successfully overwritten' : 'Overwrite failed.';

    this.setState({
      show_overwrite_modal: true,
      overwrite_status: msg,
    });
  };

  confirmOverwrite = () => {
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
        <div className="settings-advanced clearfix mt-4">
          <FormGroup>
            <Label>Error Prompt</Label>
            <div className="helper-text mb-2">What to say if the skill encounters an unexpected error</div>
            <Prompt
              placeholder="Sorry, this skill has encountered an error"
              voice={this.props.skill.error_prompt ? this.props.skill.error_prompt.voice : null}
              content={this.props.skill.error_prompt ? this.props.skill.error_prompt.content : null}
              updatePrompt={(prompt) => this.props.updateSkillMerge('error_prompt', prompt)}
            />
          </FormGroup>
        </div>
        {/* <div className="settings-content clearfix">
          <FormGroup>
            <div className="mt-4">
              <Label>Skill Events (events: {'{object}'})</Label>
              <AceEditor
                name="datasource_editor"
                className="datasource_editor"
                mode="json"
                theme="github"
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
        </div> */}
        {this.props.live_mode && (
          <div className="no-bottom clearfix">
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
        <div className="settings-content mt-5 no-bottom clearfix">
          <AccountLinkTemplate {...this.props} />
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
)(AdvancedSettings);

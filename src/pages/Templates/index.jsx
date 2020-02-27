import './Template.css';

import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';

import Button from '@/components/LegacyButton';
import { FullSpinner } from '@/components/Spinner';
import * as Account from '@/ducks/account';
import * as List from '@/ducks/lists';
import * as Router from '@/ducks/router';
import * as Template from '@/ducks/template';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';

import LOCALE_MAP from '../../services/LocaleMap';
import LocalCheckbox from './components/LocalCheckBox';
import LocaleLabelFlex from './components/LocaleLabelFlex';

class Templates extends React.Component {
  state = {
    stage: 0,
    loading: false,
    name: '',
    locales: ['en-US'],
    error: '',
    google: false,
    alexa: false,
  };

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value,
    });

  onLocaleBtnClick(locale) {
    let { locales } = this.state;

    if (locales.includes(locale)) {
      if (locales.length > 1) {
        locales = _.without(locales, locale);
      }
    } else {
      locales.push(locale);
    }

    this.setState({
      saved: false,
      locales,
    });
  }

  saveSettings = async () => {
    const { stage, name, locales } = this.state;
    if (stage === 0) {
      if (name.trim() && Array.isArray(locales) && locales.length !== 0) {
        await this.createProject();
      } else {
        this.setState({ error: 'Please Complete All Fields' });
      }
    }
  };

  componentDidMount() {
    this.loadDefaultTemplates();
  }

  async createProject() {
    const { workspaceID, computedMatch, addProjectToList, goToCanvas, createProject } = this.props;
    const { name, locales, google } = this.state;

    this.setState({ loading: true });

    try {
      const project = await createProject(workspaceID, {
        name,
        locales,
        platform: google ? 'google' : 'alexa',
      });

      const listID = computedMatch?.params?.listID;
      if (listID) {
        await addProjectToList(listID, project.project_id);
      }

      setTimeout(() => goToCanvas(project.skill_id, project.diagram, true), 3000);
    } catch (err) {
      alert('unable to create skill');
    }
  }

  async loadDefaultTemplates() {
    try {
      await this.props.loadTemplates();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Unable to Retrieve Templates');
    }
  }

  render() {
    const { loading, error, name, locales } = this.state;

    if (loading) {
      return <FullSpinner name="Template" backgroundColor="#f9f9f9" />;
    }

    return (
      <div id="template-box-container">
        <div className="card">
          <Link id="exit-template" to="/dashboard" className="btn-icon" />
          <div id="name-box" className="text-center">
            <div className="mb-5">
              <h5 className="uppercase-header">Create Project</h5>
              <Alert color="danger" style={{ visibility: error ? 'visible' : 'hidden' }} className="mt-3 d-inline-block">
                &nbsp;{error}&nbsp;
              </Alert>
              <br />
              <input
                id="skill-name"
                className="input-underline mb-4"
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                placeholder="Enter your project name"
                required
              />
            </div>
            <label className="mt-4 mb-3 form-title">Select Regions</label>
            <div className="grid-col-3 mx--1">
              {LOCALE_MAP.map((locale, index) => (
                <LocalCheckbox checked={locales.includes(locale.value)} key={index} onChange={() => this.onLocaleBtnClick(locale.value)}>
                  <LocaleLabelFlex>
                    <span>{locale.name}</span>
                    <img src={`/images/icons/countries/${locale.value}.svg`} alt={locale.name} />
                  </LocaleLabelFlex>
                </LocalCheckbox>
              ))}
            </div>
            <div className="mt-5">
              <Button isPrimary varient="contained" onClick={this.saveSettings}>
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = {
  user: Account.userSelector,
  workspaceID: Workspace.activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  addProjectToList: List.addProjectToList,
  goToCanvas: Router.goToCanvas,
  loadTemplates: Template.loadTemplates,
  createProject: Workspace.createProject,
};

export default connect(mapStateToProps, mapDispatchToProps)(Templates);

import './Template.css';

import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import { FullSpinner } from '@/components/Spinner';
import { userSelector } from '@/ducks/account';
import { addProjectToList } from '@/ducks/lists';
import { goToCanvas } from '@/ducks/router';
import { activeWorkspaceIDSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';

import LOCALE_MAP from '../../services/LocaleMap';
import LocalCheckbox from './components/LocalCheckBox';
import LocaleLabelFlex from './components/LocaleLabelFlex';

class Templates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,
      loading: false,
      templates: [],
      name: '',
      locales: ['en-US'],
      error: '',
      template: {},
      google: false,
      alexa: false,
    };

    this.createProject = this.createProject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.onLocaleBtnClick = this.onLocaleBtnClick.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

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

  saveSettings() {
    const { stage, name, locales, templates } = this.state;
    if (stage === 0) {
      if (name.trim() && Array.isArray(locales) && locales.length !== 0) {
        this.createProject(templates[0].module_id);
      } else {
        this.setState({ error: 'Please Complete All Fields' });
      }
    }
  }

  componentDidMount() {
    this.loadDefaultTemplates();
  }

  createProject(moduleId) {
    const { workspaceID, computedMatch, addProjectToList, goToCanvas } = this.props;
    const { name, locales, google } = this.state;

    this.setState({ loading: true });

    if (localStorage.getItem('is_first_session') === 'true') {
      axios.post('/analytics/track_first_project').catch((err) => {
        console.error(err);
      });
    }

    axios
      .post(`/team/${workspaceID}/copy/module/${moduleId}`, {
        name,
        locales,
        platform: google ? 'google' : 'alexa',
      })
      .then((res) => {
        if (res.data.skill_id && res.data.diagram) {
          const listID = computedMatch?.params?.listID;
          if (listID) {
            addProjectToList(listID, res.data.project_id);
          }
          setTimeout(() => goToCanvas(res.data.skill_id, res.data.diagram, true), 3000);
        } else {
          throw new Error('Invalid Response Format');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('unable to create skill');
      });
  }

  loadDefaultTemplates() {
    axios
      .get('/template/all')
      .then((res) => {
        if (Array.isArray(res.data)) {
          this.setState({
            templates: res.data,
          });
        } else {
          throw new Error('Malformed Response');
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err.response);
        alert('Unable to Retrieve Templates');
      });
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
              {LOCALE_MAP.map((locale, i) => {
                return (
                  <LocalCheckbox
                    checked={locales.includes(locale.value)}
                    key={i}
                    onChange={() => {
                      this.onLocaleBtnClick(locale.value);
                    }}
                  >
                    <LocaleLabelFlex>
                      <span>{locale.name}</span>
                      <img src={`/images/icons/countries/${locale.value}.svg`} alt={locale.name} />
                    </LocaleLabelFlex>
                  </LocalCheckbox>
                );
              })}
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
  user: userSelector,
  workspaceID: activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  addProjectToList,
  goToCanvas,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Templates);

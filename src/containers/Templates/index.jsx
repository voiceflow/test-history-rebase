import './Template.css';

import axios from 'axios';
import Button from 'components/Button';
import { Spinner } from 'components/Spinner';
import { addProjectToList } from 'ducks/board';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Modal } from 'reactstrap';

import LOCALE_MAP from '../../services/LocaleMap';
import LightCanvas from '../Canvas/LightCanvas';
import TemplateCard from './TemplateCard';

const getBoardFromURL = (computedMatch) => _.get(computedMatch, ['params', 'board_id']);

class Templates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,
      loading: false,
      preview: false,
      templates: [],
      name: '',
      locales: ['en-US'],
      error: '',
      template: {},
      google: false,
      alexa: false,
    };

    this.createProject = this.createProject.bind(this);
    this.previewTemplate = this.previewTemplate.bind(this);
    this.renderBody = this.renderBody.bind(this);
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
    const { stage, name, locales } = this.state;
    if (stage === 0) {
      if (name.trim() && Array.isArray(locales) && locales.length !== 0) {
        this.setState({ stage: 2, error: '' });
      } else {
        this.setState({ error: 'Please Complete All Fields' });
      }
    }
  }

  goBack() {
    const { stage } = this.state;
    if (stage === 2) {
      this.setState({ stage: 0 });
    }
  }

  componentDidMount() {
    this.loadDefaultTemplates();
  }

  createProject(module_id) {
    const { team_id, computedMatch, addProjectToList, history } = this.props;
    const { name, locales, google } = this.state;

    this.setState({ loading: true });

    if (localStorage.getItem('is_first_session') === 'true') {
      axios.post('/analytics/track_first_project').catch((err) => {
        console.error(err);
      });
    }

    axios
      .post(`/team/${team_id}/copy/module/${module_id}`, {
        name,
        locales,
        platform: google ? 'google' : 'alexa',
      })
      .then((res) => {
        if (res.data.skill_id && res.data.diagram) {
          const board_id = getBoardFromURL(computedMatch);
          if (board_id) {
            addProjectToList(board_id, res.data.project_id);
          }
          setTimeout(() => {
            history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`);
          }, 3000);
        } else {
          throw new Error('Invalid Response Format');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('unable to create skill');
      });
  }

  previewTemplate(template) {
    this.setState({
      preview: true,
      template,
      diagram_id: template.diagram,
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
          // preload images for performance
          this.images = [];
          res.data.forEach((template, i) => {
            this.images[i] = new Image();
            this.images[i].src = template.module_icon;
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

  renderContinueButton() {
    return (
      <div className="mt-1">
        <Button isPrimary varient="contained" onClick={this.saveSettings}>
          Continue
        </Button>
      </div>
    );
  }

  renderBody() {
    const { stage, templates, error, name, locales } = this.state;

    if (stage === 2) {
      return (
        <div className="container text-center">
          <h5 className="uppercase-header mb-5">Choose Your Template</h5>
          <div className="mt-4">
            <div className="grid-col-3 mx--4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.module_id}
                  template={template}
                  createProject={this.createProject}
                  previewTemplate={this.previewTemplate}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
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
              <Button
                isActive={locales.includes(locale.value)}
                className="country-checkbox"
                key={i}
                onClick={() => {
                  this.onLocaleBtnClick(locale.value);
                }}
              >
                <span>{locale.name}</span>
                <img src={`/images/icons/countries/${locale.value}.svg`} alt={locale.name} />
              </Button>
            );
          })}
        </div>
        <div className="mt-5">
          <Button isPrimary varient="contained" onClick={this.saveSettings}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { loading, stage, preview, template, diagram_id } = this.state;

    if (loading) {
      return React.createElement(Spinner, { name: 'Template' });
    }

    return (
      <div id="template-box-container">
        <div className="card">
          {[2].includes(stage) && <div className="mr-3 btn-icon back-btn-large" onClick={() => this.goBack()} />}
          <Link id="exit-template" to="/dashboard" className="btn-icon" />
          {this.renderBody()}
        </div>
        <Modal
          isOpen={preview}
          size="xl"
          toggle={() => this.setState({ preview: false })}
          onClosed={() => {
            this.setState({ diagram_id: null });
          }}
          className="light-canvas-modal"
        >
          <div id="light-canvas-wrap">
            <div className="no-select" id="PreviewBar">
              <h3 className="font-weight-light">{template.title} Preview</h3>
            </div>
            <LightCanvas diagram_id={diagram_id} />
          </div>
          <button className="goback-btn position-absolute" onClick={() => this.setState({ preview: false })} style={{ top: 320, left: -90 }} />
          <div className="position-absolute" style={{ bottom: -75, left: '50%', marginLeft: -73 }}>
            <Button isPrimary varient="contained" onClick={() => this.createProject(template.module_id)}>
              Select Template
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addProjectToList: (board_id, project_id) => dispatch(addProjectToList(board_id, project_id)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Templates);

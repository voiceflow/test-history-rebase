import './Integrations.css';

import cn from 'classnames';
import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import { clearModal, setConfirm, setError } from '@/ducks/modal';

import Custom from './components/integrations/custom';
import GoogleSheets from './components/integrations/googleSheets';
import Zapier from './components/integrations/zapier';

const GOOGLE_SHEETS = 'Google Sheets';
const CUSTOM_API = 'Custom API';
const ZAPIER = 'Zapier';

const INTEGRATIONS = {
  [CUSTOM_API]: {
    name: CUSTOM_API,
    image: '/custom.svg',
    component: Custom,
    tooltip: 'Make a Custom API Call',
  },
  [GOOGLE_SHEETS]: {
    name: GOOGLE_SHEETS,
    image: '/google-sheets.svg',
    component: GoogleSheets,
    tooltip: 'Manage data stored on Google Sheets',
  },
  [ZAPIER]: {
    name: ZAPIER,
    image: '/zapier.png',
    component: Zapier,
    tooltip: 'Trigger a Zap',
  },
};

class Integrations extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.integrationSelected = this.integrationSelected.bind(this);
    this.startingView = this.startingView.bind(this);
    this.getIntegrationView = this.getIntegrationView.bind(this);

    this.editorOpen = true;
  }

  trimIntegrationsData = () => {
    try {
      const extras = this.props.extras;
      const integration = extras.selected_integration;

      const integration_data = extras.integrations_data[integration];

      const actions_data = integration_data && integration_data.actions_data;
      const action = integration_data && integration_data.selected_action;

      const action_data = actions_data && actions_data[action];

      const user = integration_data && integration_data.user;

      if (action_data) {
        this.props.extras.integrations_data = {
          selected_integration: integration,
          [integration]: {
            user,
            selected_action: action,
            actions_data: {
              [action]: action_data,
            },
          },
        };
      }
    } catch (e) {
      // No trimming required
    }
  };

  componentDidUpdate() {
    if (this.props.editorOpen !== this.editorOpen) {
      this.editorOpen = this.props.editorOpen;
      if (!this.editorOpen) {
        this.trimIntegrationsData();
      }
    }
  }

  componentWillUnmount() {
    this.trimIntegrationsData();
  }

  integrationSelected(integration) {
    if (integration.component) {
      const extras = this.props.extras;
      const new_selected_integration = integration.name;
      let new_integrations_data;
      if (!extras.integrations_data) {
        new_integrations_data = {
          [integration.name]: {
            actions_data: {},
          },
        };
      } else if (!extras.integrations_data[integration.name]) {
        new_integrations_data = update(extras.integrations_data, {
          [integration.name]: {
            $set: {
              actions_data: {},
            },
          },
        });
      }

      this.updateIntegrationsData(new_integrations_data, new_selected_integration);
    }
  }

  startingView() {
    return (
      <div className="integrations-editor">
        <div className="text-center my-3 text-muted">Choose an integration</div>
        <div className="integrations-container">
          {Object.keys(INTEGRATIONS).map((k) => {
            const integrationsInfo = INTEGRATIONS[k];
            return (
              <div key={k} className="wrapper">
                <div
                  className={cn('item', 'd-flex', 'flex-column', 'align-items-center', {
                    faded: !integrationsInfo.component,
                  })}
                  onClick={() => {
                    this.integrationSelected(integrationsInfo);
                  }}
                >
                  <img className="integrations-img" src={integrationsInfo.image} alt="empty" />
                  <div className="integrations-name">{integrationsInfo.name}</div>
                  {integrationsInfo.component ? (
                    <Tooltip className="menu-tip integrations-tooltip" title={integrationsInfo.tooltip} position="bottom" theme="block">
                      ?
                    </Tooltip>
                  ) : (
                    <div className="soon-badge">Soon</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  getIntegrationView() {
    const extras = this.props.extras;
    const integration = extras.selected_integration;
    const integrationInfo = INTEGRATIONS[integration];

    const Component = integrationInfo.component;

    return (
      <Component
        extras={this.props.extras}
        integration_data={this.props.extras.integrations_data[integration]}
        selected_integration={integration}
        skill_id={this.props.skill_id}
        variables={this.props.variables}
        onUpdate={this.props.onUpdate}
        updateEvents={() => this.props.updateEvents(_.cloneDeep(this.props.node).extras)}
        clearRedo={this.props.clearRedo}
        setConfirm={this.props.setConfirm}
        updateIntegrationData={(data, callback) => {
          const new_integrations = update(extras.integrations_data, {
            [integration]: {
              $set: data,
            },
          });
          this.updateIntegrationsData(new_integrations, undefined, callback);
        }}
      />
    );
  }

  deselectIntegration() {
    this.updateIntegrationsData(undefined, null);
  }

  updateIntegrationsData = (new_integrations_data, new_selected_integration, callback) => {
    const extras = this.props.extras;

    let newExtras;
    if (new_integrations_data === undefined && new_selected_integration !== undefined) {
      newExtras = update(extras, {
        selected_integration: {
          $set: new_selected_integration,
        },
      });
    } else if (new_integrations_data !== undefined && new_selected_integration === undefined) {
      newExtras = update(extras, {
        integrations_data: {
          $set: new_integrations_data,
        },
      });
    } else if (new_integrations_data !== undefined && new_selected_integration !== undefined) {
      newExtras = update(extras, {
        integrations_data: {
          $set: new_integrations_data,
        },
        selected_integration: {
          $set: new_selected_integration,
        },
      });
    }

    if (newExtras) this.props.updateExtras(newExtras, callback);
  };

  render() {
    const extras = this.props.extras;
    let view;

    if (!extras.selected_integration) {
      view = this.startingView();
    } else {
      const integration = this.props.extras.selected_integration;
      const integrationInfo = INTEGRATIONS[integration];

      view = (
        <div className="d-flex align-items-center flex-column integrations-container">
          <div className="actions-back back-btn-large btn-icon" onClick={() => this.deselectIntegration()} />
          <div>
            <img className="title-image" src={integrationInfo.image} alt="empty" />
          </div>
          <hr className="mb-0" />
          {this.getIntegrationView()}
        </div>
      );
    }

    return <div>{view}</div>;
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    clearModal: () => dispatch(clearModal()),
    setError: (error) => dispatch(setError(error)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Integrations);

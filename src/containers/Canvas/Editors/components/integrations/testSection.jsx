import { utils } from '@voiceflow/common';
import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { Alert, Button, Collapse, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import DefaultModal from '@/components/Modals/DefaultModal';
import { Spinner } from '@/components/Spinner';
import { setConfirm, setError } from '@/ducks/modal';
import IntegrationsService from '@/services/Integrations';

import C from './constants';

const { deepDraftToMarkdown, deepVariableSubstitution } = utils.intent;

const SERVICES_MAP = {
  [C.GS.GOOGLE_SHEETS]: {
    [C.GS.RETRIEVE_DATA]: IntegrationsService.googleSheets.retrieveData,
    [C.GS.CREATE_DATA]: IntegrationsService.googleSheets.createData,
    [C.GS.UPDATE_DATA]: IntegrationsService.googleSheets.updateData,
    [C.GS.DELETE_DATA]: IntegrationsService.googleSheets.deleteData,
  },
  [C.CU.CUSTOM_API]: {
    [C.CU.GET_REQUEST]: IntegrationsService.custom.getRequest,
    [C.CU.POST_REQUEST]: IntegrationsService.custom.postRequest,
    [C.CU.PATCH_REQUEST]: IntegrationsService.custom.patchRequest,
    [C.CU.PUT_REQUEST]: IntegrationsService.custom.putRequest,
    [C.CU.DELETE_REQUEST]: IntegrationsService.custom.deleteRequest,
  },
  [C.ZP.ZAPIER]: {
    [C.ZP.CREATE_DATA]: IntegrationsService.zapier.createMessage,
  },
};

function copyJSONPath(copy_event) {
  const total_path = copy_event.namespace.slice(1);

  if (copy_event.name !== '') {
    total_path.push(copy_event.name);
  }

  // Copy to clipboard
  const el = document.createElement('textarea');
  el.value = total_path.join('.');
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

// props
// selected_integration, selected_action, integration_data, setError, open, toggleSection

class TestSection extends Component {
  state = {
    completed: false,
    variableValues: {},
  };

  render() {
    const { toggleSection, open, showConfirm } = this.props;
    const { variables_modal, variables, completed } = this.state;
    return (
      <>
        <DefaultModal
          open={variables_modal}
          header="Set Variables"
          toggle={() =>
            this.setState({
              variables_modal: !variables_modal,
              test_loading: false,
              test_content: null,
            })
          }
          content={
            <div style={{ padding: '0 2em 2em 2em' }}>
              {!_.isEmpty(variables) && (
                <>
                  <Button color="primary" onClick={() => this.resolveModalPromise()} className="mt-2 mb-2">
                    <i className="fas fa-play mr-2" /> Run
                  </Button>
                  <br />
                  <label>Your parameters for this action contain variables. Please provide them with values to proceed.</label>
                  <br />
                  {_.map(variables, (val, key) => (
                    <React.Fragment key={key}>
                      <InputGroup className="mb-2">
                        <InputGroupAddon addonType="prepend">{val}</InputGroupAddon>
                        <Input
                          className="form-control form-control-border right"
                          name={val}
                          placeholder="set variable"
                          onChange={this.handleVariableChange}
                        />
                      </InputGroup>
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
          }
          hideFooter={true}
          noPadding={true}
        />
        <div className="d-flex flex-column section-title-container" onClick={() => toggleSection()}>
          <div className="integrations-section-title text-muted">
            Test Integration
            {completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={open} className="w-100">
          <Button
            className="mb-3 btn btn-lg btn-block"
            color="clear"
            onClick={() => (showConfirm ? this.showConfirmModal() : this.runTest())}
            size="sm"
            block
          >
            <i className="fas fa-power-off mr-2" />
            Test Integration
          </Button>
          {this.renderTestContent()}
        </Collapse>
      </>
    );
  }

  componentDidUpdate(prevProps) {
    const { integration_data } = this.props;
    if (prevProps.integration_data.selected_action !== integration_data.selected_action) {
      this.setState({
        completed: false,
        test_content: null,
      });
    }
  }

  checkVariables = async () => {
    const {
      integration_data: { selected_action, actions_data },
    } = this.props;

    const params = _.cloneDeep(actions_data[selected_action]);
    const { variables } = deepDraftToMarkdown(params);

    if (variables && variables.length > 0) {
      try {
        await new Promise((resolve) => {
          this.resolveModalPromise = resolve;
          this.setState({
            variables_modal: true,
            variables,
            variableValues: {},
          });
        });
        this.setState({
          variables_modal: false,
        });
      } catch (e) {
        this.setState({
          test_loading: false,
          test_content: null,
        });
      }
    }
  };

  makeRequest = async () => {
    const {
      selected_integration,
      integration_data: { user, selected_action, actions_data },
      setError,
    } = this.props;
    const { variableValues } = this.state;

    if (!selected_integration) {
      // this case is not valid since runTest is only available when integration type has been selected | leaving it until confirmed with Ty okay to remove
      setError(new Error('Test failed! Please select an integration'));
    } else if (!user && selected_integration !== 'Custom API') {
      setError(new Error(`Test failed! Please select a ${selected_integration === 'Google Sheets' ? 'user' : 'trigger'}`));
    } else if (!selected_action) {
      setError(new Error('Test failed! Please select an action'));
    } else if (!(actions_data && actions_data[selected_action])) {
      setError(new Error('Test failed! Please complete all required sections'));
    } else {
      try {
        const test = SERVICES_MAP[selected_integration] && SERVICES_MAP[selected_integration][selected_action];

        if (!test) {
          setError(new Error(`No test found for action "${selected_action}" and integration "${selected_integration}"`));
        } else {
          let params = _.cloneDeep(actions_data[selected_action]);
          const { result } = deepDraftToMarkdown(params);

          params = deepVariableSubstitution(result, variableValues);
          params.user = user;

          this.setState({
            test_content: {},
            test_loading: true,
          });

          const resp = await test(params);
          const data = React.isValidElement(resp) ? resp : this.checkResult(resp);

          if (data) {
            this.setState({
              test_content: data,
              test_loading: false,
              completed: true,
            });
          } else {
            this.setState({
              test_loading: false,
              test_content: null,
            });
          }
        }
      } catch (e) {
        setError(e);
        this.setState({
          test_loading: false,
          test_content: null,
        });
      }
    }
  };

  checkResult = (result) => {
    if (result) {
      if (typeof result === 'object' && result.VF_STATUS_CODE >= 400) {
        this.props.setError(`Error: Request failed with status Code: ${result.VF_STATUS_CODE}`);
      }
      if (typeof result === 'string' && result.length > 10000) {
        return { response: `${result.substring(0, Math.min(result.length, 10000))}...` };
      }
      if (typeof result === 'object' && JSON.stringify(result).length > 10000) {
        return { message: 'Response contents are too large to display!' };
      }
      return { response: result };
    }
    this.props.setError('Something went wrong. Please check your request.');
    return { message: 'Something went wrong. Please check your request.' };
  };

  runTest = async () => {
    await this.checkVariables();
    this.makeRequest();
  };

  handleVariableChange = (event) => {
    const { variableValues } = this.state;
    this.setState({
      variableValues: update(variableValues, { [event.target.name]: { $set: event.target.value } }),
    });
  };

  showConfirmModal = () => {
    const { setConfirm, confirmWarningMessage } = this.props;
    this.setState({
      test_content: null,
    });
    setConfirm({
      text: (
        <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x" />
          <br />
          {confirmWarningMessage}
        </Alert>
      ),
      warning: true,
      confirm: () => {
        this.runTest();
      },
    });
  };

  renderTestContent = () => {
    const { test_loading, test_content } = this.state;
    if (test_loading) {
      return <Spinner isEmpty />;
    }
    if (test_content) {
      if (React.isValidElement(test_content)) {
        return test_content;
      }
      return (
        <div className="mb-3">
          <ReactJson src={test_content} displayDataTypes={false} name={false} enableClipboard={copyJSONPath} />
        </div>
      );
    }
    return null;
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (error) => dispatch(setError(error)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(TestSection);

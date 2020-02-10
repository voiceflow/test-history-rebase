import { utils } from '@voiceflow/common';
import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { Alert, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import DefaultModal from '@/components/LegacyModal/DefaultModal';
import { Spinner } from '@/components/Spinner';
import { IntegrationActionType, IntegrationType } from '@/constants';
import { setConfirm, setError } from '@/ducks/modal';
import { connect } from '@/hocs';
import IntegrationsService from '@/services/Integrations';
import { copyJSONPath } from '@/utils/dom';

const { deepDraftToMarkdown, deepVariableSubstitution } = utils.intent;

const SERVICES_MAP = {
  [IntegrationType.GOOGLE_SHEETS]: {
    [IntegrationActionType.GOOGLE_SHEETS.RETRIEVE_DATA]: IntegrationsService.googleSheets.retrieveData,
    [IntegrationActionType.GOOGLE_SHEETS.CREATE_DATA]: IntegrationsService.googleSheets.createData,
    [IntegrationActionType.GOOGLE_SHEETS.UPDATE_DATA]: IntegrationsService.googleSheets.updateData,
    [IntegrationActionType.GOOGLE_SHEETS.DELETE_DATA]: IntegrationsService.googleSheets.deleteData,
  },
  [IntegrationType.ZAPIER]: {
    [IntegrationActionType.ZAPIER.START_A_ZAP]: IntegrationsService.zapier.createMessage,
  },
};

class TestSection extends Component {
  state = {
    completed: false,
    variableValues: {},
  };

  generateLegacyActionsDataStructure = (selected_integration, selected_action, data, actionsData) => {
    if (selected_integration === IntegrationType.GOOGLE_SHEETS) {
      if (selected_action === IntegrationActionType.GOOGLE_SHEETS.RETRIEVE_DATA) {
        actionsData.match_value = textEditorContentAdapter.toDB(data.match_value);

        actionsData.header_column = data.header_column;
      } else if (selected_action === IntegrationActionType.GOOGLE_SHEETS.CREATE_DATA) {
        actionsData.row_values = data.row_values.map((rowVal) => {
          return textEditorContentAdapter.toDB(rowVal);
        });
      } else if (selected_action === IntegrationActionType.GOOGLE_SHEETS.UPDATE_DATA) {
        actionsData.row_values = data.row_values.map((rowVal) => {
          return textEditorContentAdapter.toDB(rowVal);
        });
        actionsData.row_number = textEditorContentAdapter.toDB(data.row_number);
      } else if (selected_action === IntegrationActionType.GOOGLE_SHEETS.DELETE_DATA) {
        actionsData.start_row = textEditorContentAdapter.toDB(data.start_row);
        actionsData.end_row = textEditorContentAdapter.toDB(data.end_row);
      }
    } else if (selected_integration === IntegrationType.ZAPIER) {
      actionsData.value = textEditorContentAdapter.toDB(data.value);
    }
  };

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data.selectedAction !== data.selectedAction) {
      this.setState({
        completed: false,
        test_content: null,
      });
    }
  }

  checkVariables = async () => {
    const { data } = this.props;
    const selectedIntegration = data.selectedIntegration;
    const selectedAction = data.selectedAction;

    const actionsData = {
      user: data.user,
      spreadsheet: data.spreadsheet,
    };

    this.generateLegacyActionsDataStructure(selectedIntegration, selectedAction, data, actionsData);

    const params = _.cloneDeep(actionsData);
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
    const { data, setError } = this.props;

    const selected_integration = data.selectedIntegration;
    const selected_action = data.selectedAction;
    const { variableValues } = this.state;

    if (!selected_action) {
      setError(new Error('Test failed! Please select an action'));
    } else {
      const actionsData = {
        user: data.user,
        spreadsheet: data.spreadsheet,
        sheet: data.sheet,
      };

      this.generateLegacyActionsDataStructure(selected_integration, selected_action, data, actionsData);

      try {
        const test = SERVICES_MAP[selected_integration] && SERVICES_MAP[selected_integration][selected_action];

        if (!test) {
          return setError(new Error(`No test found for action "${selected_action}" and integration "${selected_integration}"`));
        }

        let params = _.cloneDeep(actionsData);
        const { result } = deepDraftToMarkdown(params);
        result.user = {}; // If i dont make user empty, deepVariableSubstitution will throw an error
        if (!_.isEmpty(variableValues)) {
          params = deepVariableSubstitution(result, variableValues);
        } else {
          params = result;
        }
        params.user = this.props.data.user;

        this.setState({
          test_content: {},
          test_loading: true,
        });

        const resp = await test(params);
        const resData = React.isValidElement(resp) ? resp : this.checkResult(resp);

        if (resData) {
          this.setState({
            test_content: resData,
            test_loading: false,
            completed: true,
          });
        } else {
          this.setState({
            test_loading: false,
            test_content: null,
          });
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
        <div className="mb-1">
          <ReactJson src={test_content} displayDataTypes={false} name={false} theme="monokai" enableClipboard={copyJSONPath} />
        </div>
      );
    }
    return null;
  };

  render() {
    const { showConfirm } = this.props;
    const { variables_modal, variables } = this.state;
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

        <Button
          className="mb-2 btn btn-lg btn-block"
          color="clear"
          onClick={() => (showConfirm ? this.showConfirmModal() : this.runTest())}
          size="sm"
          block
        >
          Test Integration
        </Button>
        {this.renderTestContent()}
      </>
    );
  }
}

const mapDispatchToProps = {
  setConfirm: (confirm) => setConfirm(confirm),
  setError: (error) => setError(error),
};

export default connect(null, mapDispatchToProps)(TestSection);

import { BaseNode } from '@voiceflow/base-types';
import { deepVariableSubstitution } from '@voiceflow/common';
import { Box, Button, Input, Modal, Spinner } from '@voiceflow/ui';
import update from 'immutability-helper';
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import ReactJson from 'react-json-view';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import * as ModalsV2 from '@/ModalsV2';
import { PrefixText } from '@/pages/Canvas/components/PrefixedVariableSelect/components/Prefix';
import IntegrationsService from '@/services/Integrations';
import { copyJSONPath } from '@/utils/dom';

import { deepDraftToMarkdown } from '../../utils';

const SERVICES_MAP = {
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: {
    [BaseNode.GoogleSheets.GoogleSheetsActionType.RETRIEVE_DATA]: IntegrationsService.googleSheets.retrieveData,
    [BaseNode.GoogleSheets.GoogleSheetsActionType.CREATE_DATA]: IntegrationsService.googleSheets.createData,
    [BaseNode.GoogleSheets.GoogleSheetsActionType.UPDATE_DATA]: IntegrationsService.googleSheets.updateData,
    [BaseNode.GoogleSheets.GoogleSheetsActionType.DELETE_DATA]: IntegrationsService.googleSheets.deleteData,
  },
  [BaseNode.Utils.IntegrationType.ZAPIER]: {
    [BaseNode.Zapier.ZapierActionType.START_A_ZAP]: IntegrationsService.zapier.createMessage,
  },
};

class TestSection extends Component {
  state = {
    completed: false,
    variableValues: {},
  };

  generateLegacyActionsDataStructure = (selected_integration, selected_action, data, actionsData) => {
    if (selected_integration === BaseNode.Utils.IntegrationType.GOOGLE_SHEETS) {
      if (selected_action === BaseNode.GoogleSheets.GoogleSheetsActionType.RETRIEVE_DATA) {
        actionsData.match_value = textEditorContentAdapter.toDB(data.match_value);

        actionsData.header_column = data.header_column;
      } else if (selected_action === BaseNode.GoogleSheets.GoogleSheetsActionType.CREATE_DATA) {
        actionsData.row_values = data.row_values.map((rowVal) => textEditorContentAdapter.toDB(rowVal));
      } else if (selected_action === BaseNode.GoogleSheets.GoogleSheetsActionType.UPDATE_DATA) {
        actionsData.row_values = data.row_values.map((rowVal) => textEditorContentAdapter.toDB(rowVal));
        actionsData.row_number = textEditorContentAdapter.toDB(data.row_number);
      } else if (selected_action === BaseNode.GoogleSheets.GoogleSheetsActionType.DELETE_DATA) {
        actionsData.start_row = textEditorContentAdapter.toDB(data.start_row);
        actionsData.end_row = textEditorContentAdapter.toDB(data.end_row);
      }
    } else if (selected_integration === BaseNode.Utils.IntegrationType.ZAPIER) {
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
    const { selectedIntegration } = data;
    const { selectedAction } = data;

    const actionsData = {
      user: data.user,
      spreadsheet: data.spreadsheet,
    };

    this.generateLegacyActionsDataStructure(selectedIntegration, selectedAction, data, actionsData);

    const { variables } = deepDraftToMarkdown(actionsData);

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
    const { data } = this.props;

    const selected_integration = data.selectedIntegration;
    const selected_action = data.selectedAction;
    const { variableValues } = this.state;

    if (selected_action) {
      ModalsV2.openError({ error: new Error('Test failed! Please select an action') });
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
          return ModalsV2.openError({
            error: new Error(`No test found for action "${selected_action}" and integration "${selected_integration}"`),
          });
        }

        let params = _cloneDeep(actionsData);
        const { result } = deepDraftToMarkdown(params);
        result.user = {}; // If i dont make user empty, deepVariableSubstitution will throw an error
        if (!_isEmpty(variableValues)) {
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
        ModalsV2.openError({ error: e });
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
        ModalsV2.openError({ error: `Error: Request failed with status Code: ${result.VF_STATUS_CODE}` });
      }
      if (typeof result === 'string' && result.length > 10000) {
        return { response: `${result.substring(0, Math.min(result.length, 10000))}...` };
      }
      if (typeof result === 'object' && JSON.stringify(result).length > 10000) {
        return { message: 'Response contents are too large to display!' };
      }
      return { response: result };
    }
    ModalsV2.openError({ error: 'Something went wrong. Please check your request.' });
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

  toggleModal = () =>
    this.setState({
      variables_modal: !this.state.variables_modal,
      test_loading: false,
      test_content: null,
    });

  render() {
    const { variables_modal, variables } = this.state;
    return (
      <>
        {variables_modal && (
          <>
            <Modal.Backdrop onClick={this.toggleModal} />
            <Modal opened>
              <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={this.toggleModal} />}>Set Variables</Modal.Header>

              <Modal.Body>
                {!_isEmpty(variables) && (
                  <>
                    <Button color="primary" onClick={() => this.resolveModalPromise()} className="mt-2 mb-2">
                      Run Integration
                    </Button>

                    <br />
                    <label>Your parameters for this action contain variables. Please provide them with values to proceed.</label>
                    <br />

                    {variables.map((val, key) => (
                      <React.Fragment key={key}>
                        <Box mb={8}>
                          <Input
                            name={val}
                            onChange={this.handleVariableChange}
                            leftAction={<PrefixText>{val.toUpperCase()}</PrefixText>}
                            placeholder="set value"
                          />
                        </Box>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </Modal.Body>
            </Modal>
          </>
        )}

        <Box.FlexCenter mb={16}>
          <Button onClick={() => this.runTest()}>Test Integration</Button>
        </Box.FlexCenter>

        {this.renderTestContent()}
      </>
    );
  }
}

export default TestSection;

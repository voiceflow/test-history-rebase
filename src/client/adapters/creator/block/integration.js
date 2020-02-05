import { draftJSContentAdapter } from '@/client/adapters/draft';
import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import { INTEGRATION_DATA_MODELS, IntegrationActionType, IntegrationType } from '@/constants';

import { createBlockAdapter } from './utils';

const CUSTOM_API_DEFAULTS = INTEGRATION_DATA_MODELS.CUSTOM_API;
const GOOGLE_SHEET_DEFAULTS = INTEGRATION_DATA_MODELS.GOOGLE_SHEETS;
const ZAPIER_DEFAULTS = INTEGRATION_DATA_MODELS.ZAPIER;

const keyValFromDB = ({ index, key, val }) => ({
  index,
  key: textEditorContentAdapter.fromDB(key),
  val: textEditorContentAdapter.fromDB(val),
});

const keyValToDB = ({ index, key, val }) => ({
  index,
  key: textEditorContentAdapter.toDB(key),
  val: textEditorContentAdapter.toDB(val),
});

// Incoming Integrations Data Mapping Functions
const addCustomAPIData = (dataModel, actionData, selectedAction) => {
  const url = textEditorContentAdapter.fromDB(actionData.url);
  const headers = actionData.headers.map(keyValFromDB);
  const mapping = actionData.mapping.map(({ index, path, var: varVal }) => ({
    index,
    path: textEditorContentAdapter.fromDB(path),
    var: varVal,
  }));
  const parameters = actionData.params.map(keyValFromDB);
  const body = actionData.body.map(keyValFromDB);

  dataModel.headers = (headers.length > 0 && headers) || CUSTOM_API_DEFAULTS.headers;
  dataModel.selectedAction = selectedAction || CUSTOM_API_DEFAULTS.selectedAction;
  dataModel.mapping = (mapping.length > 0 && mapping) || CUSTOM_API_DEFAULTS.mapping;
  dataModel.url = (url.length > 0 && url) || CUSTOM_API_DEFAULTS.url;
  dataModel.parameters = (parameters.length > 0 && parameters) || CUSTOM_API_DEFAULTS.parameters;
  dataModel.bodyInputType = actionData.bodyInputType || CUSTOM_API_DEFAULTS.bodyInputType;
  dataModel.body = (body.length > 0 && body) || CUSTOM_API_DEFAULTS.body;
  dataModel.content = actionData.content || CUSTOM_API_DEFAULTS.content;
};

const addGoogleSheetsData = (dataModel, actionData, integrationsData, selectedIntegration) => {
  dataModel.selectedAction = integrationsData[selectedIntegration].selected_action || GOOGLE_SHEET_DEFAULTS.selectedAction;
  dataModel.mapping = actionData.mapping || GOOGLE_SHEET_DEFAULTS.mapping;
  dataModel.spreadsheet = actionData.spreadsheet || GOOGLE_SHEET_DEFAULTS.spreadsheet;
  dataModel.sheet = actionData.sheet || GOOGLE_SHEET_DEFAULTS.sheet;
  dataModel.header_column = actionData.header_column || GOOGLE_SHEET_DEFAULTS.header_column;
  dataModel.match_value = draftJSContentAdapter.fromDB(actionData.match_value);
  dataModel.row_values = actionData.row_values?.map(draftJSContentAdapter.fromDB) || GOOGLE_SHEET_DEFAULTS.row_values;
  dataModel.row_number = draftJSContentAdapter.fromDB(actionData.row_number);
  dataModel.start_row = draftJSContentAdapter.fromDB(actionData.start_row);
  dataModel.end_row = draftJSContentAdapter.fromDB(actionData.end_row);
  dataModel.user = integrationsData[selectedIntegration].user;
};

const addZapierData = (dataModel, actionData, integrationsData, selectedIntegration) => {
  dataModel.selectedAction = IntegrationActionType.ZAPIER.START_A_ZAP;
  dataModel.value = draftJSContentAdapter.fromDB(actionData.value);
  dataModel.user = integrationsData[selectedIntegration].user || ZAPIER_DEFAULTS.user;
};

export const encodeCustomAPIData = (data) => {
  const { selectedAction, bodyInputType, body, url, headers, mapping, parameters, content } = data;
  return {
    bodyInputType,
    body: body.map(keyValToDB),
    selected_action: selectedAction,
    url: textEditorContentAdapter.toDB(url),
    headers: headers.map(keyValToDB),
    mapping: mapping.map(({ index, path, var: varVal }) => ({
      index,
      path: textEditorContentAdapter.toDB(path),
      var: varVal,
    })),
    method: selectedAction.split(' ')[2],
    params: parameters.map(keyValToDB),
    content,
  };
};

// Outgoing Integrations Data Mapping Functions
const setCustomAPIData = (dataModel, data) => {
  const { selectedIntegration, selectedAction } = data;

  dataModel.integrations_data[selectedIntegration] = {
    selected_action: selectedAction,
    actions_data: {
      [selectedAction]: encodeCustomAPIData(data),
    },
  };
};

const setGoogleSheetsData = (dataModel, data) => {
  const {
    selectedIntegration,
    user,
    selectedAction,
    spreadsheet,
    sheet,
    header_column,
    match_value,
    row_values,
    row_number,
    mapping,
    start_row,
    end_row,
  } = data;

  dataModel.integrations_data[selectedIntegration] = {
    user,
    selected_action: selectedAction,
    actions_data: {
      [selectedAction]: {
        spreadsheet,
        sheet,
        header_column,
        match_value: draftJSContentAdapter.toDB(match_value),
        row_values: row_values.map((value) => {
          return draftJSContentAdapter.toDB(value);
        }),
        row_number: draftJSContentAdapter.toDB(row_number),
        mapping,
        start_row: draftJSContentAdapter.toDB(start_row),
        end_row: draftJSContentAdapter.toDB(end_row),
      },
    },
  };
};

const setZapierData = (dataModel, data) => {
  const { selectedIntegration, selectedAction, user, value } = data;
  dataModel.integrations_data[selectedIntegration] = {
    selected_action: selectedAction,
    user,
    actions_data: {
      [selectedAction]: {
        value: draftJSContentAdapter.toDB(value),
      },
    },
  };
};

const integrationBlockAdapter = createBlockAdapter(
  ({ selected_integration: selectedIntegration, integrations_data: integrationsData }) => {
    if (!selectedIntegration) return {};

    const selectedAction = integrationsData[selectedIntegration].selected_action;
    const actionData = integrationsData[selectedIntegration].actions_data[selectedAction];

    const dataModel = {
      selectedIntegration,
    };

    switch (selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        addCustomAPIData(dataModel, actionData, selectedAction);
        break;
      case IntegrationType.GOOGLE_SHEETS:
        addGoogleSheetsData(dataModel, actionData, integrationsData, selectedIntegration);
        break;
      case IntegrationType.ZAPIER:
        addZapierData(dataModel, actionData, integrationsData, selectedIntegration);
        break;
      default:
        break;
    }

    return dataModel;
  },
  (data) => {
    const { selectedIntegration } = data;

    const dataModel = {
      selected_integration: selectedIntegration,
      integrations_data: {},
    };

    switch (selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        setCustomAPIData(dataModel, data);
        break;
      case IntegrationType.GOOGLE_SHEETS:
        setGoogleSheetsData(dataModel, data);
        break;
      case IntegrationType.ZAPIER:
        setZapierData(dataModel, data);
        break;
      default:
        break;
    }

    return dataModel;
  }
);

export default integrationBlockAdapter;

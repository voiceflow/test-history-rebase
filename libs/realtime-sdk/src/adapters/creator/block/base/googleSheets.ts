import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const googleSheetsAdapter = createBlockAdapter<BaseNode.GoogleSheets.StepData, NodeData.GoogleSheets>(
  ({ user, sheet, endRow, mapping, startRow, rowNumber, rowValues, matchValue, spreadsheet, headerColumn, selectedAction }) => ({
    user,
    sheet,
    mapping,
    end_row: endRow,
    start_row: startRow,
    row_values: rowValues,
    row_number: rowNumber,
    spreadsheet,
    match_value: matchValue,
    header_column: headerColumn,
    selectedAction: selectedAction ?? undefined,
    selectedIntegration: BaseNode.Utils.IntegrationType.GOOGLE_SHEETS,
  }),
  ({
    user,
    sheet = null,
    mapping = [],
    end_row = '',
    start_row = '',
    row_number = '',
    row_values = [],
    spreadsheet,
    match_value = '',
    header_column = null,
    selectedAction = null,
  }) => ({
    user,
    sheet,
    endRow: end_row,
    mapping,
    startRow: start_row,
    rowNumber: row_number,
    rowValues: row_values,
    matchValue: match_value,
    spreadsheet,
    headerColumn: header_column,
    selectedAction: selectedAction as null | BaseNode.GoogleSheets.GoogleSheetsActionType,
    selectedIntegration: BaseNode.Utils.IntegrationType.GOOGLE_SHEETS,
  })
);

export default googleSheetsAdapter;

/* eslint-disable camelcase */
import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const googleSheetsAdapter = createBlockAdapter<Node.GoogleSheets.StepData, NodeData.GoogleSheets>(
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
    selectedIntegration: Node.Utils.IntegrationType.GOOGLE_SHEETS,
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
    selectedAction: selectedAction as null | Node.GoogleSheets.GoogleSheetsActionType,
    selectedIntegration: Node.Utils.IntegrationType.GOOGLE_SHEETS,
  })
);

export default googleSheetsAdapter;

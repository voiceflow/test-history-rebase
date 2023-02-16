import { datadogRum } from '@datadog/browser-rum';
import _isEqual from 'lodash/isEqual';
import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import { logsIcon } from '@/assets';
import { styled } from '@/hocs/styled';
import * as ModalsV2 from '@/ModalsV2';
import IntegrationsService from '@/services/Integrations';
import { openURLInANewTab } from '@/utils/window';

const SpreadSheetIcon = styled.img`
  cursor: pointer;
`;
function SelectGoogleSheet({ selectedAction, data, user, updateHeaders, openNextStep, onChange }) {
  const [sheets_loading, setSheetsLoading] = React.useState(false);
  const [sheets_list, setSheetList] = React.useState([]);

  const promiseOptions = (rawInputValue) => {
    const integrationsUser = data.user;
    let inputValue = rawInputValue;

    if (!integrationsUser) return Promise.resolve([]);

    if (!inputValue) inputValue = '';
    return IntegrationsService.googleSheets.getSpreadsheets(inputValue, integrationsUser);
  };

  const updateSheets = async () => {
    const integrationsUser = data.user;

    setSheetList([]);

    const spreadsheet_id = data.spreadsheet && data.spreadsheet.value;
    if (spreadsheet_id == null) return;
    setSheetsLoading(true);

    try {
      const sheets = await IntegrationsService.googleSheets.getSpreadsheetSheets(spreadsheet_id, integrationsUser);
      setSheetList(sheets);
    } catch (e) {
      datadogRum.addError(e);
      ModalsV2.openError({ error: e });
    }
    setSheetsLoading(false);
  };

  const openSpreadsheetLink = () => {
    const spreadsheet_id = data.spreadsheet && data.spreadsheet.value;
    const sheet_id = data.sheet && data.sheet.value;

    if (spreadsheet_id == null || sheet_id == null) return;

    openURLInANewTab(`https://docs.google.com/spreadsheets/d/${spreadsheet_id}/edit#gid=${sheet_id}`);
  };

  const selected_action = selectedAction;
  const integrationsUser = user;

  return (
    <div>
      <div className="d-flex align-items-center mb-3 mt-1">
        <div className="mr-2 text-muted">Spreadsheet </div>
        <div className="flex-fill">
          <AsyncSelect
            menuPortalTarget={document.body}
            key={JSON.stringify(integrationsUser) + JSON.stringify(integrationsUser && integrationsUser.user_id) + selected_action}
            cacheOptions
            defaultOptions
            placeholder="Select..."
            classNamePrefix="google-sheets-dropdown select-box"
            loadOptions={promiseOptions}
            className="auth-dropdown"
            value={data.spreadsheet || null}
            onChange={(v) => {
              if (!_isEqual(v, data.spreadsheet)) {
                onChange({
                  sheet: [],
                  row_values: '',
                  row_number: '',
                  match_value: '',
                  spreadsheet: v,
                  header_column: null,
                });
                updateHeaders();
              }
            }}
            noOptionsMessage={({ inputValue }) => (inputValue ? 'No Options' : 'Type to search')}
          />
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="mr-2 text-muted">Sheet </div>
        <div className="flex-fill">
          <Select
            classNamePrefix="google-sheets-dropdown select-box"
            options={sheets_list}
            menuPortalTarget={document.body}
            className="auth-dropdown"
            value={data.sheet || null}
            placeholder="Select..."
            onChange={(v) => {
              if (!_isEqual(v, data.sheet)) {
                onChange({
                  sheet: v,
                  header_column: null,
                  match_value: '',
                  row_values: [],
                  row_number: '',
                });
                updateHeaders();
                openNextStep();
              }
            }}
            isLoading={sheets_loading}
            onFocus={updateSheets}
            isDisabled={!data.spreadsheet}
          />
        </div>
        <SpreadSheetIcon
          src={logsIcon}
          className={`ml-3 text-muted spreadsheet-link ${data.spreadsheet && data.sheet ? '' : 'disabled'}`}
          onClick={openSpreadsheetLink}
        />
      </div>
    </div>
  );
}

export default SelectGoogleSheet;

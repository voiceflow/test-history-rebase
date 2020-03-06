import _ from 'lodash';
import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import { setError } from '@/ducks/modal';
import { styled } from '@/hocs';
import { connect } from '@/hocs/connect';
import IntegrationsService from '@/services/Integrations';

const SpreadSheetIcon = styled.img`
  cursor: pointer;
`;
function SelectGoogleSheet({ selectedAction, data, setError, user, updateHeaders, openNextStep, onChange }) {
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
    if (_.isNil(spreadsheet_id)) return;
    setSheetsLoading(true);

    try {
      const sheets = await IntegrationsService.googleSheets.getSpreadsheetSheets(spreadsheet_id, integrationsUser);
      setSheetList(sheets);
    } catch (e) {
      console.error(e);
      setError(e);
    }
    setSheetsLoading(false);
  };

  const openSpreadsheetLink = () => {
    const spreadsheet_id = data.spreadsheet && data.spreadsheet.value;
    const sheet_id = data.sheet && data.sheet.value;
    if (_.isNil(spreadsheet_id) || _.isNil(sheet_id)) return;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheet_id}/edit#gid=${sheet_id}`;
    const win = window.open(url, '_blank');
    win.focus();
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
              if (!_.isEqual(v, data.spreadsheet)) {
                onChange({
                  spreadsheet: v,
                  sheet: [],
                  header_column: null,
                  match_value: [],
                  row_values: [],
                  row_number: [],
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
              if (!_.isEqual(v, data.sheet)) {
                onChange({
                  sheet: v,
                  header_column: null,
                  match_value: [],
                  row_values: [],
                  row_number: [],
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
          src="/logs.svg"
          className={`ml-3 text-muted spreadsheet-link ${data.spreadsheet && data.sheet ? '' : 'disabled'}`}
          onClick={openSpreadsheetLink}
        />
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setError,
};
export default connect(null, mapDispatchToProps)(SelectGoogleSheet);

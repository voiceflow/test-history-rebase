import _ from 'lodash';
import memoize from 'memoize-one';
import React, { Component } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { Collapse } from 'reactstrap';

import { selectStyles } from '@/components/VariableSelect/VariableSelect';
import IntegrationsService from '@/services/Integrations';

// props
// action_data, integrationsUser, skill_id, onError, updateActionData, updateHeaders

class SpreadsheetSection extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.promiseOptions = this.promiseOptions.bind(this);
    this.updateSheets = this.updateSheets.bind(this);
  }

  componentDidMount() {
    this.checkCompletion(true);
  }

  componentDidUpdate() {
    this.checkCompletion();
  }

  memoizedCompletion = memoize((initial_load, action_data, spreadsheet, sheet) => {
    const { completed: stateCompleted } = this.state;
    const { open, showNextSection } = this.props;
    let completed = false;
    if (action_data && spreadsheet && sheet) {
      completed = true;
    }

    if (completed !== stateCompleted) {
      this.setState({
        completed,
      });
    }
    if (completed && !initial_load && open) showNextSection();
  });

  checkCompletion(initial_load = false) {
    const { action_data } = this.props;
    if (!action_data) return;
    this.memoizedCompletion(initial_load, action_data, action_data.spreadsheet, action_data.sheet);
  }

  promiseOptions(rawInputValue) {
    const { integrationsUser } = this.props;
    let inputValue = rawInputValue;

    if (!integrationsUser) return Promise.resolve([]);

    if (!inputValue) inputValue = '';
    return IntegrationsService.googleSheets.getSpreadsheets(inputValue, integrationsUser);
  }

  async updateSheets() {
    const { action_data, integrationsUser, onError } = this.props;
    this.setState({
      sheets_list: [],
    });

    const spreadsheet_id = action_data.spreadsheet && action_data.spreadsheet.value;
    if (_.isNil(spreadsheet_id)) return;

    this.setState({
      sheets_loading: true,
    });

    try {
      const sheets = await IntegrationsService.googleSheets.getSpreadsheetSheets(spreadsheet_id, integrationsUser);
      this.setState({
        sheets_list: sheets,
      });
    } catch (e) {
      console.error(e);
      onError(e);
    }
    this.setState({
      sheets_loading: false,
    });
  }

  openSpreadsheetLink = () => {
    const { action_data } = this.props;
    const spreadsheet_id = action_data.spreadsheet && action_data.spreadsheet.value;
    const sheet_id = action_data.sheet && action_data.sheet.value;
    if (_.isNil(spreadsheet_id) || _.isNil(sheet_id)) return;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheet_id}/edit#gid=${sheet_id}`;
    const win = window.open(url, '_blank');
    win.focus();
  };

  render() {
    const { completed, sheets_list, sheets_loading } = this.state;
    const { toggleSection, action_data, open, integrationsUser, selected_action, updateActionData, updateHeaders, showNextSection } = this.props;
    return (
      <div>
        <div className="d-flex flex-column section-title-container" onClick={() => toggleSection()}>
          <div className="integrations-section-title text-muted">
            Using sheet
            <span onClick={() => toggleSection()} className={`action-selected ${action_data.sheet ? 'action-visible' : ''}`}>
              {action_data.sheet && action_data.sheet.label}
            </span>
            {completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={open} className="w-100">
          <div className="d-flex align-items-center mb-4">
            <div className="mr-2 text-muted">Spreadsheet </div>
            <div className="flex-fill">
              <AsyncSelect
                key={JSON.stringify(integrationsUser) + JSON.stringify(integrationsUser && integrationsUser.user_id) + selected_action}
                cacheOptions
                defaultOptions
                styles={selectStyles}
                classNamePrefix="google-sheets-dropdown select-box"
                loadOptions={this.promiseOptions}
                className="auth-dropdown"
                value={action_data.spreadsheet || null}
                onChange={(v) => {
                  if (!_.isEqual(v, action_data.spreadsheet)) {
                    updateActionData(
                      {
                        spreadsheet: v,
                        sheet: null,
                        header_column: null,
                        match_value: null,
                        row_values: null,
                        row_number: null,
                      },
                      updateHeaders
                    );
                  } else if (completed) {
                    showNextSection();
                  }
                }}
                noOptionsMessage={({ inputValue }) => (inputValue ? 'No Options' : 'Type to search')}
              />
            </div>
          </div>
          <div className="d-flex align-items-center my-4">
            <div className="mr-2 text-muted">Sheet </div>
            <div className="flex-fill">
              <Select
                styles={selectStyles}
                classNamePrefix="google-sheets-dropdown select-box"
                options={sheets_list}
                className="auth-dropdown"
                value={action_data.sheet || null}
                onChange={(v) => {
                  if (!_.isEqual(v, action_data.sheet)) {
                    updateActionData(
                      {
                        sheet: v,
                        header_column: null,
                        match_value: null,
                        row_values: [],
                        row_number: null,
                      },
                      updateHeaders
                    );
                  } else if (completed) {
                    showNextSection();
                  }
                }}
                isLoading={sheets_loading}
                onFocus={this.updateSheets}
                isDisabled={!action_data.spreadsheet}
              />
            </div>
            <div
              className={`ml-3 text-muted spreadsheet-link ${action_data.spreadsheet && action_data.sheet ? '' : 'disabled'}`}
              onClick={this.openSpreadsheetLink}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default SpreadsheetSection;

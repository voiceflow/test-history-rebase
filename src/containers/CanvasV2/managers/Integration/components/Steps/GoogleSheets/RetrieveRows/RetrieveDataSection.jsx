import React from 'react';
import Select from 'react-select';
import { Tooltip } from 'react-tippy';

import VariableInput from '@/components/VariableInput';

import NextStepButton from '../../components/NextStepButton';

function RetrieveData({ headers_list, onChange, headers_loading, data, openNextStep }) {
  return (
    <div>
      <div className="d-flex align-items-center">
        <div className="flex-1">
          <Select
            classNamePrefix="google-sheets-dropdown select-box"
            options={
              headers_list
                ? [
                    {
                      value: 'row_number',
                      label: 'Row Number',
                    },
                    ...headers_list,
                  ]
                : headers_list
            }
            className="auth-dropdown"
            value={data.header_column}
            onChange={(val) => {
              onChange({ header_column: val });
            }}
            isLoading={headers_loading}
            placeholder="Column"
          />
        </div>
        <img src="/equals.svg" alt="comment" className="mr-2 ml-2" width="10px" />
        <div className="column-input" style={{ overflow: 'auto', flex: '1 1' }}>
          <VariableInput
            key={JSON.stringify(!!data.match_value)}
            className="form-control google-sheets-input"
            value={data.match_value}
            onChange={(val) => {
              onChange({ match_value: val });
            }}
            placeholder="Value to Match"
          />
        </div>
        <div>
          <Tooltip
            className="menu-tip ml-2"
            title="The value to match in the selected column. Leaving this blank will select a random row in the spreadsheet"
            position="bottom"
            theme="block"
          >
            ?
          </Tooltip>
        </div>
      </div>
      <NextStepButton openNextStep={openNextStep} />
    </div>
  );
}

export default RetrieveData;

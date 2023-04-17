import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';
import Select from 'react-select';

import { equalsIcon } from '@/assets';
import VariablesInput from '@/components/VariablesInput';

import NextStepButton from '../../components/NextStepButton';

const RetrieveData = ({ headers_list, onChange, headers_loading, data, openNextStep }) => (
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
      <TippyTooltip
        content="The value to match in the selected column. Leaving this blank will select a random row in the spreadsheet"
        position="bottom"
      >
        <img src={equalsIcon} alt="comment" className="mr-2 ml-2" width="10px" />
      </TippyTooltip>
      <div className="column-input" style={{ width: '45%' }}>
        <VariablesInput
          key={JSON.stringify(!!data.match_value)}
          value={data.match_value}
          onBlur={({ text }) => onChange({ match_value: text })}
          placeholder="Value to Match"
        />
      </div>
    </div>
    <NextStepButton openNextStep={openNextStep} />
  </div>
);

export default RetrieveData;

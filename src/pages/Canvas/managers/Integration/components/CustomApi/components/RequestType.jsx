import React from 'react';

import Section from '@/componentsV2/Section';
import SelectInputGroup from '@/componentsV2/SelectInputGroup';
import { IntegrationActionType } from '@/constants';
import { FormControl } from '@/pages/Canvas/components/Editor';

const { CUSTOM_API } = IntegrationActionType;

const OPTIONS = [CUSTOM_API.GET, CUSTOM_API.POST, CUSTOM_API.PUT, CUSTOM_API.DELETE, CUSTOM_API.PATCH];

const OPTIONS_MAP = {
  [CUSTOM_API.GET]: 'GET',
  [CUSTOM_API.POST]: 'POST',
  [CUSTOM_API.PUT]: 'PUT',
  [CUSTOM_API.DELETE]: 'DELETE',
  [CUSTOM_API.PATCH]: 'PATCH',
};

function RequestTypeStep({ url, selectedAction, onChange }) {
  const onChangeAction = React.useCallback(
    (value) => {
      onChange({ selectedAction: value });
    },
    [onChange]
  );

  const setEndpoint = React.useCallback(
    (textObject) => {
      onChange({ url: textObject });
    },
    [onChange]
  );

  React.useEffect(() => {
    if (!selectedAction) {
      onChangeAction(CUSTOM_API.GET);
    }
  }, [onChangeAction, selectedAction]);

  return (
    <Section>
      <FormControl label="Request URL" contentBottomUnits={0}>
        <SelectInputGroup
          value={selectedAction || CUSTOM_API.GET}
          options={OPTIONS}
          onSelect={onChangeAction}
          inputValue={url}
          placeholder="Endpoint URL"
          onInputBlur={setEndpoint}
          getOptionLabel={(value) => OPTIONS_MAP[value]}
        />
      </FormControl>
    </Section>
  );
}

export default RequestTypeStep;

import { APIActionType } from '@voiceflow/alexa-types/build/nodes/api';
import React from 'react';

import Section from '@/components/Section';
import SelectInputGroup from '@/components/SelectInputGroup';
import { FormControl } from '@/pages/Canvas/components/Editor';

const OPTIONS = [APIActionType.GET, APIActionType.POST, APIActionType.PUT, APIActionType.DELETE, APIActionType.PATCH];

const OPTIONS_MAP = {
  [APIActionType.GET]: 'GET',
  [APIActionType.POST]: 'POST',
  [APIActionType.PUT]: 'PUT',
  [APIActionType.DELETE]: 'DELETE',
  [APIActionType.PATCH]: 'PATCH',
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
      onChangeAction(APIActionType.GET);
    }
  }, [onChangeAction, selectedAction]);

  return (
    <Section>
      <FormControl label="Request URL" contentBottomUnits={0}>
        <SelectInputGroup
          value={selectedAction || APIActionType.GET}
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

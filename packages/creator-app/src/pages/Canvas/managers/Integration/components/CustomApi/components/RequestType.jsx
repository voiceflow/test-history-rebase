import { Node } from '@voiceflow/base-types';
import React from 'react';

import Section from '@/components/Section';
import SelectInputGroup from '@/components/SelectInputGroup';
import { FormControl } from '@/pages/Canvas/components/Editor';

const OPTIONS = [
  Node.Api.APIActionType.GET,
  Node.Api.APIActionType.POST,
  Node.Api.APIActionType.PUT,
  Node.Api.APIActionType.DELETE,
  Node.Api.APIActionType.PATCH,
];

const OPTIONS_MAP = {
  [Node.Api.APIActionType.GET]: 'GET',
  [Node.Api.APIActionType.POST]: 'POST',
  [Node.Api.APIActionType.PUT]: 'PUT',
  [Node.Api.APIActionType.DELETE]: 'DELETE',
  [Node.Api.APIActionType.PATCH]: 'PATCH',
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
      onChangeAction(Node.Api.APIActionType.GET);
    }
  }, [onChangeAction, selectedAction]);

  return (
    <Section>
      <FormControl label="Request URL" contentBottomUnits={0}>
        <SelectInputGroup
          value={selectedAction || Node.Api.APIActionType.GET}
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

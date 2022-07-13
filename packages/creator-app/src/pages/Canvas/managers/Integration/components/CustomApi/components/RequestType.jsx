import { BaseNode } from '@voiceflow/base-types';
import { Select } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import SelectInputGroup from '@/components/SelectInputGroup';
import { FormControl } from '@/pages/Canvas/components/Editor';

const OPTIONS = [
  BaseNode.Api.APIActionType.GET,
  BaseNode.Api.APIActionType.POST,
  BaseNode.Api.APIActionType.PUT,
  BaseNode.Api.APIActionType.DELETE,
  BaseNode.Api.APIActionType.PATCH,
];

const OPTIONS_MAP = {
  [BaseNode.Api.APIActionType.GET]: 'GET',
  [BaseNode.Api.APIActionType.POST]: 'POST',
  [BaseNode.Api.APIActionType.PUT]: 'PUT',
  [BaseNode.Api.APIActionType.DELETE]: 'DELETE',
  [BaseNode.Api.APIActionType.PATCH]: 'PATCH',
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
      onChangeAction(BaseNode.Api.APIActionType.GET);
    }
  }, [onChangeAction, selectedAction]);

  return (
    <Section>
      <FormControl label="Request URL" contentBottomUnits={0}>
        <SelectInputGroup onBlur={setEndpoint} value={url} placeholder="Endpoint URL">
          {(baseProps) => (
            <Select
              {...baseProps}
              value={selectedAction || BaseNode.Api.APIActionType.GET}
              label={OPTIONS_MAP[selectedAction || BaseNode.Api.APIActionType.GET]}
              options={OPTIONS}
              onSelect={onChangeAction}
              isDropdown
              getOptionLabel={(value) => OPTIONS_MAP[value]}
            />
          )}
        </SelectInputGroup>
      </FormControl>
    </Section>
  );
}

export default RequestTypeStep;

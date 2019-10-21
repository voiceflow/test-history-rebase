import React from 'react';

import ButtonDropdownInput from '@/components/ButtonDropdownInput';
import { IntegrationActionType } from '@/constants';

import StepContainer from '../components/StepContainer';
import StepContentContainer from '../components/StepContentContainer';
import StepHeader from '../components/StepHeader';

export const OPTIONS_ARRAY = [
  { value: IntegrationActionType.CUSTOM_API.GET, label: 'GET' },
  { value: IntegrationActionType.CUSTOM_API.POST, label: 'POST' },
  { value: IntegrationActionType.CUSTOM_API.PUT, label: 'PUT' },
  { value: IntegrationActionType.CUSTOM_API.DELETE, label: 'DELETE' },
  { value: IntegrationActionType.CUSTOM_API.PATCH, label: 'PATCH' },
];

export const OPTIONS = {
  GET: OPTIONS_ARRAY[0],
  POST: OPTIONS_ARRAY[1],
  PUT: OPTIONS_ARRAY[2],
  DELETE: OPTIONS_ARRAY[3],
  PATCH: OPTIONS_ARRAY[4],
};

function RequestTypeStep({ data, onChange }) {
  const { url, selectedAction } = data;

  const [, , actionVerb = 'GET'] = selectedAction.split(' ');

  if (!selectedAction.split(' ')[2]) {
    onChange({ selectedAction: OPTIONS.GET.value });
  }

  const setRequestType = (value) => {
    onChange({ selectedAction: value });
  };

  const setEndpoint = (textObject) => {
    onChange({ url: textObject });
  };

  if (!selectedAction) {
    setRequestType(OPTIONS.GET);
  }

  return (
    <StepContainer>
      <StepHeader>Request URL</StepHeader>
      <StepContentContainer>
        <ButtonDropdownInput
          className="mb-3"
          textValue={url}
          dropdownValue={OPTIONS[actionVerb]}
          onDropdownChange={setRequestType}
          options={OPTIONS_ARRAY}
          placeholder="Endpoint URL"
          onTextChange={setEndpoint}
        />
      </StepContentContainer>
    </StepContainer>
  );
}

export default RequestTypeStep;

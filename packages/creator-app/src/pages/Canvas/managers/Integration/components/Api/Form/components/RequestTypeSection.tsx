import { Node as BaseNode } from '@voiceflow/base-types';
import { SectionV2, Select } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import VariablesInput from '@/components/VariablesInput';
import { getCustomAPIActionLabel } from '@/utils/customApi';

import { BaseFormProps } from '../types';

const API_REQUEST_OPTIONS = [
  BaseNode.Api.APIActionType.GET,
  BaseNode.Api.APIActionType.POST,
  BaseNode.Api.APIActionType.PUT,
  BaseNode.Api.APIActionType.DELETE,
  BaseNode.Api.APIActionType.PATCH,
];

const RequestTypeSection: React.FC<BaseFormProps> = ({ editor }) => {
  const selectedAction = (editor.data.selectedAction ?? BaseNode.Api.APIActionType.GET) as BaseNode.Api.APIActionType;

  return (
    <>
      <SectionV2.SimpleSection isAccent>
        <SelectInputGroup
          multiline
          orientation={SelectInputGroup.OrientationType.LEFT}
          renderInput={(props) => (
            <VariablesInput
              {...props}
              value={editor.data.url}
              onBlur={({ text }) => editor.onChange({ url: text })}
              fullWidth
              multiline
              placeholder="Request URL or {variable}"
            />
          )}
        >
          {(props) => (
            <Select
              {...props}
              value={selectedAction}
              options={API_REQUEST_OPTIONS}
              onSelect={(value) => editor.onChange({ selectedAction: value ?? undefined })}
              getOptionLabel={(value) => value && getCustomAPIActionLabel(value)}
            />
          )}
        </SelectInputGroup>
      </SectionV2.SimpleSection>
    </>
  );
};

export default RequestTypeSection;

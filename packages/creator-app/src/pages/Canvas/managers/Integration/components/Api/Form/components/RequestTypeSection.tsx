import { Node as BaseNode } from '@voiceflow/base-types';
import { SectionV2, Select } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
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
    <SectionV2.SimpleSection isAccent>
      <SelectInputGroup onBlur={(url) => editor.onChange({ url })} value={editor.data.url} multiline placeholder="Request URL or {variable}">
        {(baseProps) => (
          <Select
            {...baseProps}
            value={selectedAction}
            label={getCustomAPIActionLabel(selectedAction)}
            options={API_REQUEST_OPTIONS}
            onSelect={(value) => editor.onChange({ selectedAction: value ?? undefined })}
            isDropdown
            getOptionLabel={(value) => value && getCustomAPIActionLabel(value)}
            showDropdownColorOnActive
          />
        )}
      </SelectInputGroup>
    </SectionV2.SimpleSection>
  );
};

export default RequestTypeSection;

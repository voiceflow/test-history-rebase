import { Node as BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, Select } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { API_REQUEST_OPTIONS, API_REQUEST_OPTIONS_MAP } from '../../../constants';

const RequestTypeSection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();

  const selectedAction = (editor.data.selectedAction ?? BaseNode.Api.APIActionType.GET) as BaseNode.Api.APIActionType;

  return (
    <SectionV2.SimpleSection isAccent>
      <SelectInputGroup onBlur={(url) => editor.onChange({ url })} value={editor.data.url} multiline placeholder="Request URL or {variable}">
        {(baseProps) => (
          <Select
            {...baseProps}
            value={selectedAction}
            label={API_REQUEST_OPTIONS_MAP[selectedAction]}
            options={API_REQUEST_OPTIONS}
            onSelect={(value) => editor.onChange({ selectedAction: value ?? undefined })}
            isDropdown
            getOptionLabel={(value) => value && API_REQUEST_OPTIONS_MAP[value]}
            showDropdownColorOnActive
          />
        )}
      </SelectInputGroup>
    </SectionV2.SimpleSection>
  );
};

export default RequestTypeSection;

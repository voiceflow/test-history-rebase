import { Node as BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { API_REQUEST_OPTIONS, API_REQUEST_OPTIONS_MAP } from '../../../constants';

const RequestTypeSection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();
  const [selectedAction, setSelectedAction] = React.useState(editor.data.selectedAction);

  const onChangeAction = React.useCallback(
    (value) => {
      editor.onChange({ selectedAction: value });
      setSelectedAction(value);
    },
    [editor.onChange]
  );

  const setEndpoint = React.useCallback(
    (textObject) => {
      editor.onChange({ url: textObject });
    },
    [editor.onChange]
  );

  React.useEffect(() => {
    if (!selectedAction) {
      onChangeAction(BaseNode.Api.APIActionType.GET);
    }
  }, [onChangeAction, selectedAction]);

  return (
    <SectionV2.SimpleSection style={{ backgroundColor: '#fdfdfd' }} headerProps={{ py: 24 }}>
      <SelectInputGroup
        value={selectedAction}
        options={API_REQUEST_OPTIONS}
        onSelect={onChangeAction}
        inputValue={editor.data.url}
        regularInput={false}
        placeholder="Request URL or {variable}"
        onInputBlur={setEndpoint}
        getOptionLabel={(value: BaseNode.Api.APIActionType) => API_REQUEST_OPTIONS_MAP[value]}
        multiline
        showDropdownColorOnActive
      />
    </SectionV2.SimpleSection>
  );
};

export default RequestTypeSection;

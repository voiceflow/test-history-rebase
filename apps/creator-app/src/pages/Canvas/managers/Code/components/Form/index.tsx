import type * as Realtime from '@voiceflow/realtime-sdk';
import { useLinkedState } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_COLORS, ACE_EDITOR_OPTIONS_V2, InputMode } from '@/components/AceEditor';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { Header } from './components';
import { useAceEditor } from './hooks';

const Form: React.FC<NodeEditorV2Props<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>> = ({
  data,
  onChange,
  isFullscreen,
}) => {
  const [editorState, onUpdateEditorState] = useLinkedState(data.code);

  const aceEditorRef = useAceEditor(isFullscreen);

  const onUpdateCode = React.useCallback(() => onChange({ code: editorState }), [editorState, onChange]);

  return (
    <AceEditor
      ref={aceEditorRef}
      name="code"
      mode="javascript"
      focus={!data.code}
      value={editorState}
      onBlur={onUpdateCode}
      onChange={(value) => onUpdateEditorState(value)}
      inputMode={InputMode.INPUT}
      fullHeight
      setOptions={ACE_EDITOR_OPTIONS_V2}
      placeholder="Enter javascript"
      editorColors={ACE_EDITOR_COLORS}
      scrollMargin={[12, 12, 0, 0]}
      editorSpacing
    />
  );
};

export default Object.assign(Form, { Header });

import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_COLORS, ACE_EDITOR_OPTIONS_V2, InputMode } from '@/components/AceEditor';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { Header } from './components';
import { useAceEditor } from './hooks';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ editor, header, footer }) => {
  const [editorState, onUpdateEditorState] = useLinkedState(editor.data.code);

  const aceEditorRef = useAceEditor(editor.platform);

  const onUpdateCode = React.useCallback(() => editor.onChange({ code: editorState }), [editorState, editor.onChange]);

  return (
    <EditorV2 header={header ?? <Header editor={editor} />} footer={footer} fillHeight withoutContentContainer>
      <Box height="100vh">
        <AceEditor
          ref={aceEditorRef}
          name="code"
          mode="javascript"
          focus={!editor.data.code}
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
      </Box>
    </EditorV2>
  );
};

export default Object.assign(Form, { Header });

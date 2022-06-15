import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_COLORS, ACE_EDITOR_OPTIONS_V2 } from '@/components/AceEditor';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import HelpTooltip from '@/pages/Canvas/managers/Code/components/HelpTooltip';
import { useAceEditor, useVariableList } from '@/pages/Canvas/managers/Code/hooks';

const CodeRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>();
  const wordList = useVariableList(editor.platform);
  const editorRef = useAceEditor(wordList);
  const [editorState, onUpdateEditorState] = React.useState(editor.data.code);
  const onUpdateCode = React.useCallback(() => editor.onChange({ code: editorState }), [editorState, editor.onChange]);

  React.useEffect(() => {
    if (editor.data.code !== editorState) {
      onUpdateEditorState(editor.data.code);
    }
  }, [editor.data.code]);

  return (
    <EditorV2
      header={
        <EditorV2.Header title="Javascript">
          <SvgIcon icon={editor.isFullscreen ? 'systemMinimize' : 'systemExpand'} color="#6E849A" onClick={editor.onToggleFullscreen} clickable />
        </EditorV2.Header>
      }
      footer={
        !editor.isFullscreen && (
          <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
            <EditorV2.FooterActionsButton />
          </EditorV2.DefaultFooter>
        )
      }
      fillHeight
      withoutContentContainer
    >
      <AceEditor
        placeholder="Enter custom code"
        ref={editorRef}
        value={editorState}
        onChange={(value) => onUpdateEditorState(value)}
        onBlur={onUpdateCode}
        name="code"
        mode="javascript"
        editorColors={ACE_EDITOR_COLORS}
        setOptions={ACE_EDITOR_OPTIONS_V2}
      />
    </EditorV2>
  );
};

export default CodeRootEditor;

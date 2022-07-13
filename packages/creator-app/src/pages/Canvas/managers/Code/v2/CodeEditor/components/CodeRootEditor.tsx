import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_COLORS, ACE_EDITOR_OPTIONS_V2, InputMode } from '@/components/AceEditor';
import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useAceEditor, useVariableList } from '@/pages/Canvas/managers/Code/hooks';

const CodeRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>();
  const wordList = useVariableList(editor.platform);
  const editorRef = useAceEditor(wordList);
  const [editorState, onUpdateEditorState] = React.useState(editor.data.code);
  const onUpdateCode = React.useCallback(() => editor.onChange({ code: editorState }), [editorState, editor.onChange]);
  const editorActions = EditorV2.useEditorDefaultActions();

  React.useEffect(() => {
    if (editor.data.code !== editorState) {
      onUpdateEditorState(editor.data.code);
    }
  }, [editor.data.code]);

  return (
    <EditorV2
      header={
        <EditorV2.Header>
          <EditorV2.HeaderTitle>Javascript</EditorV2.HeaderTitle>

          <IconButton
            icon={editor.isFullscreen ? 'systemMinimize' : 'systemExpand'}
            onClick={editor.onToggleFullscreen}
            variant={IconButtonVariant.BASIC}
          />
        </EditorV2.Header>
      }
      footer={
        !editor.isFullscreen && (
          <EditorV2.DefaultFooter tutorial={Documentation.CUSTOM_CODE_STEP}>
            <EditorV2.FooterActionsButton actions={editorActions} />
          </EditorV2.DefaultFooter>
        )
      }
      fillHeight
      withoutContentContainer
    >
      <Box height="100vh">
        <AceEditor
          ref={editorRef}
          name="code"
          mode="javascript"
          focus={!editor.data.code}
          value={editorState}
          onBlur={onUpdateCode}
          onChange={(value) => onUpdateEditorState(value)}
          inputMode={InputMode.INPUT}
          fullHeight
          setOptions={ACE_EDITOR_OPTIONS_V2}
          placeholder="Enter custom code"
          editorColors={ACE_EDITOR_COLORS}
          scrollMargin={[12, 12, 0, 0]}
          editorSpacing
        />
      </Box>
    </EditorV2>
  );
};

export default CodeRootEditor;

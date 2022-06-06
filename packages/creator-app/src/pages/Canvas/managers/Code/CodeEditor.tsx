import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link } from '@voiceflow/ui';
import React from 'react';

import AceEditor from '@/components/AceEditor';
import OverflowMenu from '@/components/OverflowMenu';
import * as Documentation from '@/config/documentation';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';
import { useAceEditor, useVariableList } from './hooks';

const CodeEditor: NodeEditor<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({ data, onChange, onExpand, expanded, platform }) => {
  const wordList = useVariableList(platform);
  const editorRef = useAceEditor(wordList);
  const [editorState, onUpdateEditorState] = React.useState(data.code);
  const onUpdateCode = React.useCallback(() => onChange({ code: editorState }), [editorState, onChange]);

  React.useEffect(() => {
    if (data.code !== editorState) {
      onUpdateEditorState(data.code);
    }
  }, [data.code]);

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
            helpTitle: 'Having trouble?',
            helpMessage: (
              <>
                Check out our <Link href={Documentation.CODE_STEP}>documentation</Link>.
              </>
            ),
          }}
          menu={<OverflowMenu options={[{ label: 'Expand Fullscreen', onClick: onExpand }]} placement="top-end" />}
        />
      )}
      hideFooter={expanded}
      fillHeight
    >
      <Box width="100%" height="100%" position="relative">
        <AceEditor
          fullHeight={!expanded}
          placeholder="Enter Javascript code here"
          ref={editorRef}
          value={editorState}
          onChange={(value) => onUpdateEditorState(value)}
          onBlur={onUpdateCode}
          name="code"
          mode="javascript"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false,
          }}
        />
      </Box>
    </Content>
  );
};

export default CodeEditor;

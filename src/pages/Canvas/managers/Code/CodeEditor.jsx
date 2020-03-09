import React from 'react';

import AceEditor from '@/components/AceEditor';
import ChatWithUsLink from '@/components/ChatLink';
import OverflowMenu from '@/components/OverflowMenu';
import { GLOBAL_VARIABLES } from '@/constants';
import { connect } from '@/hocs';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { allVariablesSelector } from '@/store/selectors';

import { EditorContainer, HelpTooltip } from './components';

function CodeEditor({ data, onChange, onExpand, expanded, variables }) {
  const editorRef = React.useRef();
  const [editorState, onUpdateEditorState] = React.useState(data.code);
  const onUpdateCode = React.useCallback(() => onChange({ code: editorState }), [editorState, onChange]);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.completers.push({
        getCompletions: (editor, session, pos, prefix, callback) => {
          const wordList = [...GLOBAL_VARIABLES, ...variables, 'voiceflow', '_system'];

          callback(
            null,
            wordList.map((word) => ({
              caption: word,
              value: word,
              meta: 'variable',
            }))
          );
        },
      });
    }
  }, [variables]);

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
                <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
              </>
            ),
          }}
          menu={<OverflowMenu options={[{ label: 'Expand Fullscreen', onClick: onExpand }]} placement="top-end" />}
        />
      )}
      hideFooter={expanded}
      fillHeight
    >
      <EditorContainer>
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
      </EditorContainer>
    </Content>
  );
}

const mapStateToProps = {
  variables: allVariablesSelector,
};

export default connect(mapStateToProps)(CodeEditor);

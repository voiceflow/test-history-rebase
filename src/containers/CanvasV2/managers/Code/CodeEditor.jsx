import React from 'react';

import AceEditor from '@/components/AceEditor';
import { GLOBAL_VARIABLES } from '@/constants';
import { Section } from '@/containers/CanvasV2/components/BlockEditor';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';

function CodeEditor({ data, onChange, variables }) {
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
  }, [editorRef.current, variables]);

  return (
    <Section>
      <AceEditor
        ref={editorRef}
        value={editorState}
        onChange={onUpdateEditorState}
        onBlur={onUpdateCode}
        name="code"
        mode="javascript"
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
        }}
      />
    </Section>
  );
}

const mapStateToProps = {
  variables: allVariablesSelector,
};

export default connect(mapStateToProps)(CodeEditor);

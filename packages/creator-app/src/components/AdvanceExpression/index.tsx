import { Ace } from 'ace-builds';
import React from 'react';

import AceEditor, { InputMode } from '@/components/AceEditor';
import Box from '@/components/Box';
import { BUILT_IN_VARIABLES } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { ConnectedProps } from '@/types';

import Container from './Container';

// ace typings have WorkerClient type under TODO list reference https://github.com/ajaxorg/ace/blob/master/ace.d.ts#L345
interface AceEditorRef {
  editor: Ace.Editor & {
    session: Ace.EditSession & {
      $worker: {
        send: Function;
      };
    };
  };
}

interface AdvanceExpressionProps extends ConnectedProps<typeof mapStateToProps> {
  value: string;
  onChange: (val: string) => void;
}

const AdvanceExpression: React.FC<AdvanceExpressionProps> = ({ value, onChange, variables }) => {
  const editorRef = React.useRef<AceEditorRef>(null);
  const [error, setError, resetError] = useEnableDisable(false);

  const [editorState, onUpdateEditorState] = React.useState<string>(value);
  const onUpdateCode = React.useCallback(() => {
    const annotations = editorRef.current?.editor.getSession().getAnnotations();

    if (annotations && annotations.length > 0) {
      setError();
      return;
    }

    resetError();
    onChange(editorState);
  }, [editorState, onChange]);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current?.editor?.completers.push({
        getCompletions: (_editor, _session, _pos, _prefix, callback) => {
          const wordList = [...BUILT_IN_VARIABLES, ...variables, 'voiceflow', '_system'];

          callback(
            null,
            wordList.map((word) => ({ meta: 'variable', score: 1, value: word, caption: word }))
          );
        },
      });
      // to disable semi-color annotation
      // ace-builds types does not have type def for WorkerClient yet
      editorRef.current?.editor.session.$worker.send('changeOptions', [{ asi: true }]);
    }
  }, [variables]);

  React.useEffect(() => {
    if (value !== editorState) {
      onUpdateEditorState(value);
    }
  }, [value]);

  return (
    <>
      <Container error={error}>
        <AceEditor
          ref={editorRef}
          placeholder="Enter Expression"
          value={editorState}
          onChange={(value) => onUpdateEditorState(value)}
          onBlur={onUpdateCode}
          onFocus={resetError}
          name="advance expression"
          mode="javascript"
          inputMode={InputMode.INPUT}
          editorProps={{ $blockScrolling: false }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: false,
            tabSize: 2,
            useWorker: true,
            fontSize: 15,
            showGutter: false,
            highlightActiveLine: false,
            maxLines: 1,
          }}
        />
      </Container>

      {error && (
        <Box fontSize={13} color="#e91e63" mt={16}>
          Expression is invalid.
        </Box>
      )}
    </>
  );
};

const mapStateToProps = {
  variables: Diagram.activeDiagramAllVariablesSelector,
};

export default connect(mapStateToProps)(AdvanceExpression);

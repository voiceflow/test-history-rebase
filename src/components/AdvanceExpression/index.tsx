import { Ace } from 'ace-builds';
import React from 'react';

import AceEditor, { InputMode } from '@/components/AceEditor';
import Box from '@/components/Box';
import { BUILT_IN_VARIABLES } from '@/constants';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { allVariablesSelector } from '@/store/selectors';

import Container from './Container';

export interface AceEditorInput {
  value: string;
  onChange: (val: string) => void;
  variables: string[];
}

// ace typings have WorkerClient type under TODO list reference https://github.com/ajaxorg/ace/blob/master/ace.d.ts#L345
export interface AceEditorRef {
  editor: Ace.Editor & {
    session: Ace.EditSession & {
      $worker: {
        send: Function;
      };
    };
  };
}

function AceEditorInput({ value, onChange, variables }: AceEditorInput) {
  const editorRef = React.useRef<AceEditorRef>(null);
  const [error, setError, resetError] = useEnableDisable(false);

  const [editorState, onUpdateEditorState] = React.useState(value);
  const onUpdateCode = React.useCallback(() => {
    const annotations = editorRef.current?.editor.getSession().getAnnotations();

    if (annotations && annotations.length > 0) {
      return setError();
    }

    resetError();
    onChange(editorState);
  }, [editorState, onChange]);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current?.editor?.completers.push({
        getCompletions: (_editor: any, _session: any, _pos: any, _prefix: any, callback: any) => {
          const wordList = [...BUILT_IN_VARIABLES, ...variables, 'voiceflow', '_system'];

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
          placeholder="Enter Expression"
          ref={editorRef as any}
          value={editorState}
          onChange={(value) => onUpdateEditorState(value)}
          onBlur={onUpdateCode}
          onFocus={resetError}
          name="advance expression"
          mode="javascript"
          inputMode={InputMode.INPUT}
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
}

const mapStateToProps = {
  variables: allVariablesSelector,
};

export default connect(mapStateToProps)(AceEditorInput);

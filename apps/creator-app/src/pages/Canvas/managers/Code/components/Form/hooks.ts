import React from 'react';
import type AceEditorType from 'react-ace';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';

export const useAceEditor = (isFullscreen: boolean) => {
  const variables = useSelector(DiagramV2.active.allEntitiesAndVariablesSelector);

  const wordList = React.useMemo(() => variables.map((variable) => variable.name), [variables]);

  const editorRef = React.useRef<AceEditorType | null>(null);

  const completer = React.useMemo<AceEditorType['editor']['completers'][number]>(
    () => ({
      getCompletions: (_editor, _session, _pos, _prefix, callback) => {
        callback(
          null,
          wordList.map((word) => ({
            caption: word,
            value: word,
            meta: 'variable',
            score: 1,
          }))
        );
      },
      // internal flag
      _vf_ref: true,
    }),
    [wordList]
  );

  const applyCompleter = () => {
    if (editorRef.current) {
      editorRef.current.editor.completers = [
        ...editorRef.current.editor.completers.filter((c: any) => !c._vf_ref),
        completer,
      ];
    }
  };

  const getEditorRef = (instance: AceEditorType | null) => {
    editorRef.current = instance;
    applyCompleter();
  };

  // add & remove completer from ace editor
  React.useEffect(() => {
    applyCompleter();
  }, [completer]);

  // dynamic resizing of container
  React.useEffect(() => {
    if (!editorRef.current) return undefined;

    const observer = new ResizeObserver(() => editorRef.current?.editor.resize());
    observer.observe(editorRef.current.refEditor);

    return () => observer.disconnect();
  }, [isFullscreen]);

  return getEditorRef;
};

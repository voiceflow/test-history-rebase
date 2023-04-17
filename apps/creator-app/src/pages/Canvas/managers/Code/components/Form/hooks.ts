import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import React from 'react';
import type AceEditorType from 'react-ace';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';

export const useAceEditor = (platform: Platform.Constants.PlatformType) => {
  const variables = useSelector(DiagramV2.active.allSlotNamesAndVariablesSelector);
  const builtInVariables = useActiveProjectTypeConfig().project.globalVariables;

  const wordList = React.useMemo(() => [...builtInVariables, ...variables, 'voiceflow', '_system'], [platform, variables]);

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
    }),
    [wordList]
  );

  const getEditorRef = (instance: AceEditorType | null) => {
    editorRef.current = instance;
    instance?.editor.completers.push(completer);
  };

  // add & remove completer from ace editor
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.completers = Utils.array.append(editorRef.current.editor.completers, completer);

      return () => {
        if (editorRef.current) {
          editorRef.current.editor.completers = Utils.array.withoutValue(editorRef.current.editor.completers, completer);
        }
      };
    }

    return undefined;
  }, [completer]);

  return getEditorRef;
};

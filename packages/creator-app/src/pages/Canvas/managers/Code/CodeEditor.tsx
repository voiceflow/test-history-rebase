import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link } from '@voiceflow/ui';
import React from 'react';
import type AceEditorType from 'react-ace';
import { useSelector } from 'react-redux';

import AceEditor from '@/components/AceEditor';
import OverflowMenu from '@/components/OverflowMenu';
import * as Documentation from '@/config/documentation';
import * as DiagramV2 from '@/ducks/diagramV2';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

import { HelpTooltip } from './components';

const CodeEditor: NodeEditor<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({ data, onChange, onExpand, expanded, platform }) => {
  const editorRef = React.useRef<AceEditorType | null>(null);
  const [editorState, onUpdateEditorState] = React.useState(data.code);
  const onUpdateCode = React.useCallback(() => onChange({ code: editorState }), [editorState, onChange]);
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);

  const completer = React.useMemo<AceEditorType['editor']['completers'][number]>(
    () => ({
      getCompletions: (_editor, _session, _pos, _prefix, callback) => {
        const wordList = [...getPlatformGlobalVariables(platform), ...variables, 'voiceflow', '_system'];

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
    [platform, variables]
  );

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
          ref={(instance: AceEditorType | null) => {
            editorRef.current = instance;
            instance?.editor.completers.push(completer);
          }}
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

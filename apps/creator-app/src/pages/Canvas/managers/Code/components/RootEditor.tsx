import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import CodePath from './CodePath';
import Form from './Form';

const MAX_PATHS = 8;

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>();

  const {
    data: { paths = [] },
  } = editor;

  const editorActions = EditorV2.useEditorDefaultActions();

  const mapManager = useMapManager<Realtime.ArrayItem<typeof paths>>(paths, (paths) => editor.onChange({ paths }), {
    factory: () => ({ label: `path${paths.length + 1}`, key: Utils.id.cuid.slug() }),
    onAdd: (path) => editor.engine.port.addByKey(editor.nodeID, path.key),
    onRemove: (path) =>
      editor.engine.port.removeManyByKey([{ key: path.key, portID: editor.node.ports.out.byKey[path.key] }]),
    maxItems: MAX_PATHS,
  });

  return (
    <EditorV2
      header={<Form.Header editor={editor} />}
      footer={
        !editor.isFullscreen && (
          <EditorV2.DefaultFooter tutorial={Documentation.CODE_STEP}>
            <EditorV2.FooterActionsButton actions={editorActions} />
          </EditorV2.DefaultFooter>
        )
      }
      fillHeight
      withoutContentContainer
    >
      <Box flexGrow={1}>
        <Form {...editor} />
      </Box>
      <SectionV2.Divider />
      <Box maxHeight="50%" overflowY="scroll">
        <SectionV2.Sticky>
          {({ sticked }) => (
            <SectionV2.Header sticky sticked={sticked}>
              <SectionV2.Title bold>Paths</SectionV2.Title>
              <SectionV2.AddButton onClick={mapManager.onAdd} disabled={paths.length >= MAX_PATHS} />
            </SectionV2.Header>
          )}
        </SectionV2.Sticky>
        <SectionV2.Content paddingBottom={4}>
          {mapManager.map((path, { key, onUpdate, onRemove, isLast }) => (
            <Box key={key} pb={isLast ? 20 : 12}>
              <CodePath data={path} onUpdate={onUpdate} onRemove={onRemove} />
            </Box>
          ))}
        </SectionV2.Content>
      </Box>
    </EditorV2>
  );
};

export default RootEditor;

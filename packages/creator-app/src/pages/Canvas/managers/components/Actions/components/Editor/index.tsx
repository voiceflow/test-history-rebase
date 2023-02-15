import * as Realtime from '@voiceflow/realtime-sdk';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import { EditorSidebarProvider } from '@/pages/Canvas/components/EditorSidebarV2/context';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ManagerContext } from '@/pages/Canvas/contexts';

import { useEditor } from './hooks';

const ActionsEditor: React.FC = () => {
  const editor = EditorV2.useEditor();
  const getManager = React.useContext(ManagerContext)!;
  const parentMatch = EditorV2.useParentMatch()!;

  const { actionNodeID } = useParams<{ actionNodeID: string }>();

  const node = useSelector(CreatorV2.nodeByIDSelector, { id: actionNodeID });
  const data = useSelector(CreatorV2.nodeDataByIDSelector, { id: actionNodeID });

  const onChange = React.useCallback(
    (value: Partial<Realtime.NodeData<{}>>) => (node?.id ? editor.engine.node.updateData(node.id, value) : Promise.resolve()),
    [editor.engine.node, node?.id]
  );

  const parentEditor = useContextApi({
    data: editor.data,
    node: editor.node,
    nodeID: editor.nodeID,
    onChange: editor.onChange,
  });

  if (!node || !data) return null;

  const manager = getManager(node.type);

  const ActionEditor = manager.actionEditor;

  if (!ActionEditor) return null;

  const actionEditor = {
    ...editor,
    data: data as any,
    node: node as any,
    nodeID: node?.id ?? '',
    onChange,
    parentMatch,
    parentEditor,
  };

  return (
    <EditorSidebarProvider value={actionEditor}>
      <ActionEditor {...actionEditor} />
    </EditorSidebarProvider>
  );
};

export default Object.assign(ActionsEditor, {
  useEditor,
});

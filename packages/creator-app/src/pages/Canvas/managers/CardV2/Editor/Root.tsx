import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { NoMatchV2, NoReplyV2 } from '../../components';
import Card from './Card';

const CardV2EditorRoot: NodeEditorV2<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts>();
  const parentNode = useSelector(CreatorV2.nodeByIDSelector, { id: editor.node.parentNode });
  const { card } = editor.data;

  const isLast = React.useMemo(() => {
    if (!parentNode) return false;
    return [...parentNode.combinedNodes].pop() === editor.nodeID;
  }, [parentNode]);

  const noMatchConfig = NoMatchV2.useConfig();
  const noReplyConfig = NoReplyV2.useConfig();

  const actions = isLast ? [noMatchConfig.option, noReplyConfig.option] : [];

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.CAROUSEL_STEP}>
          {isLast && <EditorV2.FooterActionsButton actions={actions} />}
        </EditorV2.DefaultFooter>
      }
    >
      <Card
        item={card}
        editor={editor}
        onUpdate={async (partial) =>
          editor.onChange({
            card: {
              ...card,
              ...partial,
            },
          })
        }
      />

      {noMatchConfig.section}
      {noReplyConfig.section}
    </EditorV2>
  );
};

export default CardV2EditorRoot;

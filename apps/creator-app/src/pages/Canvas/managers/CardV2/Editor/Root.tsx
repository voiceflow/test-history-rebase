import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { NoMatchV2, NoReplyV2 } from '../../components';
import Card from './Card';

const CardV2EditorRoot: NodeEditorV2<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts>();
  const isVoiceProject = editor.projectType === Platform.Constants.ProjectType.VOICE;

  const parentNode = useSelector(CreatorV2.nodeByIDSelector, { id: editor.node.parentNode });
  const card = editor.data;

  const isLast = !!parentNode && parentNode.combinedNodes[parentNode.combinedNodes.length - 1] === editor.nodeID;

  const noMatchConfig = NoMatchV2.useConfig({ step: editor.data });
  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.CARD_STEP}>
          {isLast && !isVoiceProject && (
            <EditorV2.FooterActionsButton actions={[noMatchConfig.option, noReplyConfig.option]} />
          )}
        </EditorV2.DefaultFooter>
      }
    >
      <Card item={card} editor={editor} onUpdate={(partial) => editor.onChange({ ...card, ...partial })} />

      {noMatchConfig.section}
      {noReplyConfig.section}
    </EditorV2>
  );
};

export default CardV2EditorRoot;

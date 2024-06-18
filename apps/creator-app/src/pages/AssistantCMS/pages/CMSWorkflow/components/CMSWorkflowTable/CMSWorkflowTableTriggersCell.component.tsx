import { BlockType } from '@voiceflow/realtime-sdk';
import { Menu } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { nonEmptyTriggersMapByDiagramIDAtom } from '@/atoms/reference.atom';
import { Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { CMSTableLinkMenuCell } from '@/pages/AssistantCMS/components/CMSTableLinkMenuCell/CMSTableLinkMenuCell.component';

interface ICMSWorkflowTableTriggersCell {
  diagramID: string;
}

export const CMSWorkflowTableTriggersCell: React.FC<ICMSWorkflowTableTriggersCell> = ({ diagramID }) => {
  const triggers = useAtomValue(nonEmptyTriggersMapByDiagramIDAtom)[diagramID] ?? [];

  const goToDiagram = useDispatch(Router.goToDiagram, diagramID);

  return (
    <CMSTableLinkMenuCell
      label={triggers[0]?.label}
      items={triggers}
      updates={triggers.length > 1 ? triggers.length : 0}
      onClick={() => goToDiagram(triggers[0]?.nodeID)}
      iconName={triggers[0]?.type === BlockType.START ? 'Start' : 'IntentS'}
    >
      {({ items }) =>
        items.map(({ label, nodeID }, index) => (
          <Menu.Item key={index} label={label} onClick={() => goToDiagram(nodeID)} />
        ))
      }
    </CMSTableLinkMenuCell>
  );
};

import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { ACTIONS } from '@/config/documentation';
import { ManagerContext } from '@/pages/Canvas/contexts';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import { DraggableItem } from './components';
import { useActions } from './hooks';

const DRAG_TYPE = 'actions-section';

interface ActionsSectionProps {
  editor: NodeEditorV2Props<unknown>;
  portID: string;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ portID, editor }) => {
  const getManager = React.useContext(ManagerContext)!;

  const {
    options,
    onRemove,
    onRename,
    onReorder,
    hasURLStep,
    targetNodeSteps,
    hasNavigationStep,
    lastCreatedStepID,
    targetNodeIsActions,
  } = useActions({ editor, portID });

  const withActions = targetNodeIsActions && !!targetNodeSteps.length;

  return (
    <TippyTooltip
      tag="div"
      width={232}
      content={
        <TippyTooltip.FooterButton buttonText="More" onClick={onOpenInternalURLInANewTabFactory(ACTIONS)}>
          Use actions to nest navigation and backend logic in a single step.
        </TippyTooltip.FooterButton>
      }
      delay={[1600, 0]}
      position="bottom"
      disabled={withActions}
      interactive
    >
      <SectionV2.ActionListSection
        title={<SectionV2.Title bold={withActions}>Actions</SectionV2.Title>}
        action={<SectionV2.AddButtonDropdown actions={options} maxHeight="100%" />}
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: 2 }}
      >
        {withActions && (
          <DraggableList
            type={DRAG_TYPE}
            items={targetNodeSteps}
            canDrag={({ item }) =>
              !Realtime.Utils.typeGuards.isNavigationBlockType(item.type) &&
              !Realtime.Utils.typeGuards.isURLBlockType(item.type)
            }
            onDelete={onRemove}
            onReorder={onReorder}
            itemProps={{ portID, editor, onRename, getManager, lastCreatedStepID }}
            canReorder={(_, toIndex) =>
              (!hasNavigationStep || toIndex !== targetNodeSteps.length - 1) && (!hasURLStep || toIndex !== 0)
            }
            getItemKey={(item) => item.nodeID}
            itemComponent={DraggableItem}
            partialDragItem
            previewComponent={DraggableItem}
          />
        )}
      </SectionV2.ActionListSection>
    </TippyTooltip>
  );
};

export default Object.assign(ActionsSection, {
  DRAG_TYPE,
});

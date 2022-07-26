import * as Realtime from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption, SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { ACTIONS } from '@/config/documentation';
import { BlockType } from '@/constants';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { DraggableItem } from './components';
import { useActions } from './hooks';

const DRAG_TYPE = 'actions-section';

interface ActionsSectionProps {
  editor: NodeEditorV2Props<unknown>;
  portID: string;
  parentPath?: string;
  withoutURL?: boolean;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ portID, editor, parentPath, withoutURL }) => {
  const {
    onAdd,
    onRemove,
    onRename,
    onReorder,
    actionPath,
    hasURLStep,
    isButtonsNode,
    targetNodeSteps,
    hasNavigationStep,
    lastCreatedStepID,
    targetNodeIsActions,
  } = useActions({ editor, portID, parentPath });

  const withActions = targetNodeIsActions && !!targetNodeSteps.length;
  const withURLAction = isButtonsNode && !hasURLStep && !withoutURL;

  return (
    <TippyTooltip
      tag="div"
      html={
        <TippyTooltip.FooterButton buttonText="More" width={200} onClick={() => window.open(ACTIONS, '_blank')?.focus()}>
          Use actions to nest navigation and backend logic in a single step.
        </TippyTooltip.FooterButton>
      }
      delay={[1600, 0]}
      position="bottom"
      disabled={withActions}
      interactive
      bodyOverflow
    >
      <SectionV2.ActionListSection
        title={<SectionV2.Title bold={withActions}>Actions</SectionV2.Title>}
        action={
          <SectionV2.AddButtonDropdown
            actions={[
              !withURLAction ? null : { icon: 'editorURL', label: 'Open URL', onClick: () => onAdd(BlockType.URL) },
              hasNavigationStep || !withURLAction ? null : createUIOnlyMenuItemOption('divider', { divider: true }),
              hasNavigationStep ? null : { icon: 'goToBlock', label: 'Go to Block', onClick: () => onAdd(BlockType.GO_TO_NODE) },
              hasNavigationStep ? null : { icon: 'intentSmall', label: 'Go to Intent', onClick: () => onAdd(BlockType.GO_TO_INTENT) },
              hasNavigationStep ? null : { icon: 'editorExit', label: 'End', onClick: () => onAdd(BlockType.EXIT) },
            ]}
          />
        }
        sticky
        contentProps={{ bottomOffset: 2.5 }}
      >
        {withActions && (
          <DraggableList
            type={DRAG_TYPE}
            items={targetNodeSteps}
            canDrag={({ item }) =>
              !Realtime.Utils.typeGuards.isNavigationBlockType(item.type) && !Realtime.Utils.typeGuards.isURLBlockType(item.type)
            }
            onDelete={onRemove}
            onReorder={onReorder}
            itemProps={{ portID, editor, onRename, actionPath, lastCreatedStepID }}
            canReorder={(_, toIndex) => (!hasNavigationStep || toIndex !== targetNodeSteps.length - 1) && (!hasURLStep || toIndex !== 0)}
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

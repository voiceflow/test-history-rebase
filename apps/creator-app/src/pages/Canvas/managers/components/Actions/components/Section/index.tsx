import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createDividerMenuItemOption, SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { ACTIONS } from '@/config/documentation';
import { BlockType } from '@/constants';
import { ManagerContext } from '@/pages/Canvas/contexts';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import { DraggableItem } from './components';
import { useActions } from './hooks';

const DRAG_TYPE = 'actions-section';

interface ActionsSectionProps {
  editor: NodeEditorV2Props<unknown>;
  portID: string;
  withoutURL?: boolean;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ portID, editor, withoutURL }) => {
  const getManager = React.useContext(ManagerContext)!;

  const {
    onAdd,
    onRemove,
    onRename,
    onReorder,
    hasURLStep,
    canHaveURLStep,
    withGoToDomain,
    targetNodeSteps,
    hasNavigationStep,
    lastCreatedStepID,
    targetNodeIsActions,
  } = useActions({ editor, portID });

  const withActions = targetNodeIsActions && !!targetNodeSteps.length;
  const withURLAction = canHaveURLStep && !hasURLStep && !withoutURL;

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
        action={
          <SectionV2.AddButtonDropdown
            maxHeight="100%"
            actions={[
              hasNavigationStep ? null : { icon: 'goToBlock', label: 'Go to Block', onClick: () => onAdd(BlockType.GO_TO_NODE) },
              hasNavigationStep ? null : { icon: 'intentSmall', label: 'Go to Intent', onClick: () => onAdd(BlockType.GO_TO_INTENT) },
              hasNavigationStep || !withGoToDomain
                ? null
                : { icon: 'goToDomain', label: 'Go to Domain', onClick: () => onAdd(BlockType.GO_TO_DOMAIN) },
              hasNavigationStep ? null : { icon: 'editorExit', label: 'End', onClick: () => onAdd(BlockType.EXIT) },
              hasNavigationStep ? null : createDividerMenuItemOption(),
              { icon: 'setV2', label: 'Set variable', onClick: () => onAdd(BlockType.SETV2) },
              !withURLAction ? null : { icon: 'editorURL', label: 'Open URL', onClick: () => onAdd(BlockType.URL) },
              {
                icon: 'integrations',
                label: 'API',
                onClick: () => onAdd(BlockType.INTEGRATION, { selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API }),
              },
              { icon: 'systemCode', label: 'Code', onClick: () => onAdd(BlockType.CODE) },
              { icon: 'componentOutline', label: 'Component', onClick: () => onAdd(BlockType.COMPONENT) },
            ]}
          />
        }
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: 2 }}
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
            itemProps={{ portID, editor, onRename, getManager, lastCreatedStepID }}
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

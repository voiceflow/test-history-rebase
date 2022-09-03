import { EmptyObject } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, ContextMenu, Input, OverflowText, OverflowTippyTooltip, SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import { DragPreviewComponentProps, ItemComponentHandlers, ItemComponentProps } from '@/components/DraggableList';
import { BlockType } from '@/constants';
import { useAutoScrollNodeIntoView, useEnableDisable, useLinkedState } from '@/hooks';
import type { ManagerGetter } from '@/pages/Canvas/contexts';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { withInputBlur } from '@/utils/dom';

import { useItemConfig } from './hooks';

interface DraggableItemProps
  extends ItemComponentProps<Realtime.NodeData<EmptyObject>>,
    DragPreviewComponentProps,
    ItemComponentHandlers<Realtime.NodeData<EmptyObject>> {
  portID: string;
  editor: NodeEditorV2Props<unknown>;
  onRename: (step: Realtime.NodeData<EmptyObject>, name: string) => void;
  getManager: ManagerGetter;
  actionPath: string;
  lastCreatedStepID: string | null;
}

const DraggableItem = React.forwardRef<HTMLElement, DraggableItemProps>((props, ref) => {
  const params = useParams();
  const { item, portID, editor, getManager, actionPath, onDuplicate, isDragging, lastCreatedStepID, isDraggingPreview, connectedDragRef } = props;

  const { icon, isEmpty, defaultName, placeholder } = useItemConfig(getManager, item);

  const [localName, setLocalName] = useLinkedState(item.name || defaultName);
  const [isRenaming, enableRenaming, disableRenaming] = useEnableDisable(false);

  const [autoScrollRef] = useAutoScrollNodeIntoView<HTMLDivElement>({
    options: { block: 'end' },
    condition: !isDraggingPreview && item.nodeID === lastCreatedStepID,
  });

  const onClick = () => {
    if (isRenaming || item.type === BlockType.EXIT) return;

    editor.goToNested({ path: actionPath, params: { ...params, sourcePortID: portID, actionNodeID: item.nodeID } });
  };

  const onRemove = () => {
    props.onRemove(props);
  };

  const onRename = () => {
    if (localName && (item.name || defaultName) !== localName) {
      props.onRename(item, localName);
    }

    disableRenaming();
  };

  const isNavigation = Realtime.Utils.typeGuards.isNavigationBlockType(item.type);

  const contextMenuOptions = [
    { label: 'Rename', onClick: enableRenaming },
    // only 1 navigation action is allowed, so hiding the duplicate option
    isNavigation ? null : { label: 'Duplicate', onClick: () => onDuplicate?.(props) },
    { label: 'divider', divider: true },
    { label: 'Remove', onClick: onRemove },
  ];

  return (
    <ContextMenu<undefined> options={!isRenaming ? contextMenuOptions : []} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <Box ref={ref as React.Ref<HTMLDivElement>}>
          <SectionV2.ListItem
            ref={autoScrollRef}
            icon={icon}
            action={<SectionV2.RemoveButton onClick={onRemove} />}
            onClick={onClick}
            isActive={isOpen || isRenaming}
            contentRef={connectedDragRef as React.Ref<HTMLDivElement>}
            isDragging={isDragging}
            actionCentred
            onContextMenu={onContextMenu}
            overflowHidden
            isDraggingPreview={isDraggingPreview}
          >
            {isRenaming ? (
              <Input
                style={{ width: '100%', maxWidth: '100%' }}
                value={localName}
                onBlur={onRename}
                variant={Input.Variant.INLINE}
                onFocus={({ target }) => target.select()}
                autoFocus
                onChangeText={setLocalName}
                onEnterPress={withInputBlur()}
              />
            ) : (
              <OverflowTippyTooltip overflow title={isEmpty ? placeholder : localName}>
                {(ref) => (
                  <OverflowText ref={ref} color={isEmpty ? '#8da2b5' : 'currentColor'}>
                    <span>{isEmpty ? placeholder : localName}</span>
                  </OverflowText>
                )}
              </OverflowTippyTooltip>
            )}
          </SectionV2.ListItem>
        </Box>
      )}
    </ContextMenu>
  );
});

export default DraggableItem;

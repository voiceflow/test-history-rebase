import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, BlockText, Select, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import Section, { SectionToggleVariant } from '@/components/Section';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useSelector } from '@/hooks';
import EditorSection from '@/pages/Canvas/components/EditorSection';

import { UtteranceSection } from './components';

export type ConditionsSectionProps = ItemComponentProps<Realtime.IntentSlot> &
  MappedItemComponentHandlers<Realtime.IntentSlot> &
  DragPreviewComponentProps & {
    selectedSlotIDs: string[];
    latestCreatedKey: string | undefined;
    isOnlyItem: boolean;
  };

const CaptureSection: React.ForwardRefRenderFunction<HTMLDivElement, ConditionsSectionProps> = (
  {
    item,
    index,
    itemKey,
    onUpdate,
    isOnlyItem,
    isDragging,
    onContextMenu,
    selectedSlotIDs,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const isNew = itemKey === latestCreatedKey;
  const search = React.useRef('');
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  const [usedSlots, filteredSlots] = React.useMemo(() => {
    const selectedSet = new Set(selectedSlotIDs);
    selectedSet.add(item.id);
    return allSlots.reduce<[Realtime.Slot[], Realtime.Slot[]]>(
      (acc, slot) => {
        acc[selectedSet.has(slot.id) ? 0 : 1].push(slot);
        return acc;
      },
      [[], []]
    );
  }, [allSlots, item?.id, selectedSlotIDs]);

  const selectedSlot = React.useMemo<Realtime.Slot | null>(() => (item.id && getSlotByID(item.id)) || null, [item.id]);

  const getOptionLabel = React.useCallback((slotID?: string | null) => (slotID && getSlotByID(slotID)?.name) || null, [getSlotByID]);
  const getOptionValue = React.useCallback((slot?: Realtime.Slot | null) => slot?.id, []);

  const onSelectSlot = React.useCallback(
    (slotID: string | null | undefined) => {
      if (!slotID) return;
      onUpdate({ id: slotID });
    },
    [getSlotByID]
  );

  const { onAddSlot } = useAddSlot();
  const addSlot = React.useCallback(async () => {
    const slot = await onAddSlot(search.current);
    onSelectSlot(slot?.id);
  }, [onAddSlot]);

  const updateUtterances = React.useCallback(
    (utterances: Realtime.IntentSlotDialog['utterances']) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onUpdate({ dialog: { ...item.dialog, utterances } });
    },
    [item]
  );

  return (
    <EditorSection
      ref={ref}
      namespace={['CaptureSection', itemKey]}
      initialOpen={isNew || isOnlyItem}
      header={`Capture ${selectedSlot?.name || ''}`}
      prefix={<Badge>{index + 1}</Badge>}
      headerRef={connectedDragRef}
      collapseVariant={SectionToggleVariant.ARROW}
      headerToggle
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      onContextMenu={onContextMenu}
      isContextMenuOpen={isContextMenuOpen}
      customContentStyling={{ padding: '0px' }}
    >
      {isDragging || isDraggingPreview ? null : (
        <>
          <Section customContentStyling={{ paddingTop: 0 }}>
            <Select
              value={item.id}
              options={filteredSlots}
              onSelect={onSelectSlot}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              onSearch={(value) => {
                search.current = value;
              }}
              searchable
              placeholder="Select entity to capture"
              footerAction
              footerActionLabel="Create New Entity"
              onClickFooterAction={addSlot}
            />
            {selectedSlot && (
              <BlockText color={ThemeColor.SECONDARY} mt={12} fontSize={13}>
                Entity Value being saved to <Text color={ThemeColor.PRIMARY}>{`{${selectedSlot.name}}`}</Text> Variable
              </BlockText>
            )}
          </Section>
          {selectedSlot && (
            <UtteranceSection slot={selectedSlot} usedSlots={usedSlots} utterances={item.dialog.utterances} updateUtterances={updateUtterances} />
          )}
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef<HTMLElement, ConditionsSectionProps>(CaptureSection as any);

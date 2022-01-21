import { Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, BlockText, NestedMenuComponents, Select, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import Section, { SectionToggleVariant } from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { InteractionModelTabType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useDispatch, useSelector } from '@/hooks';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ENTITY_PROMPT_PATH_TYPE } from '@/pages/Canvas/managers/CaptureV2/components/EntityPromptForm';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { EntityPromptTooltip, UtteranceSection } from './components';

export type ConditionsSectionProps = ItemComponentProps<Realtime.IntentSlot> &
  MappedItemComponentHandlers<Realtime.IntentSlot> &
  DragPreviewComponentProps & {
    selectedSlotIDs: string[];
    latestCreatedKey: string | undefined;
    queryCapture: () => void;
    isOnlyItem: boolean;
    pushToPath: PushToPath;
  };

const ENTIRE_USER_REPLY = '_ENTIRE_USER_REPLY_';

const CaptureSection: React.ForwardRefRenderFunction<HTMLDivElement, ConditionsSectionProps> = (
  {
    item,
    index,
    itemKey,
    onUpdate,
    pushToPath,
    isOnlyItem,
    isDragging,
    queryCapture,
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
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const canAddUtterances = !(isGooglePlatform(platform) || isDialogflowPlatform(platform));
  const goToCurrentCanvasInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

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

  const options = React.useMemo(() => {
    if (!filteredSlots.length) {
      return [{ id: ENTIRE_USER_REPLY }];
    }
    return [{ id: ENTIRE_USER_REPLY }, { menuItemProps: { divider: true } } as any, ...filteredSlots.map((slot) => ({ id: slot.id }))];
  }, [filteredSlots]);

  const selectedSlot = React.useMemo<Realtime.Slot | null>(() => (item.id && getSlotByID(item.id)) || null, [item.id, getSlotByID]);

  const getOptionLabel = React.useCallback(
    (slotID?: string | null) => {
      if (!slotID) {
        return null;
      }

      if (slotID === ENTIRE_USER_REPLY) {
        return 'Entire user reply';
      }

      const slot = getSlotByID(slotID);

      if (slot) {
        return `{${slot.name}}`;
      }

      return null;
    },
    [getSlotByID]
  );
  const getOptionValue = React.useCallback((option: Nullish<{ id: string }>) => option?.id, []);

  const onSelectSlot = React.useCallback(
    (slotID?: string | null) => {
      if (!slotID) return;
      if (slotID === ENTIRE_USER_REPLY) {
        queryCapture();
      } else {
        onUpdate({ id: slotID });
      }
    },
    [getSlotByID]
  );

  const { onAddSlot } = useAddSlot();
  const addSlot = React.useCallback(
    async (value = '') => {
      const slot = await onAddSlot(value);
      onSelectSlot(slot?.id);
    },
    [onAddSlot]
  );

  const updateUtterances = React.useCallback(
    (utterances: Realtime.IntentSlotDialog['utterances']) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onUpdate({ dialog: { ...item.dialog, utterances } });
    },
    [item]
  );

  const goToEntityPrompt = React.useCallback(() => {
    if (!selectedSlot?.id) return;
    pushToPath({ id: selectedSlot.id, type: ENTITY_PROMPT_PATH_TYPE, label: 'Entity Reprompt' });
  }, [selectedSlot?.id, pushToPath]);

  const goToSelectedSlot = React.useCallback(() => {
    if (selectedSlot) {
      goToCurrentCanvasInteractionModelEntity(InteractionModelTabType.SLOTS, selectedSlot.id);
    }
  }, [goToCurrentCanvasInteractionModelEntity, selectedSlot?.id]);

  const hasPrompt = React.useMemo(
    () => (item.dialog.prompt as any[]).filter((prompt) => prompt.text || prompt.content).length > 0,
    [item.dialog.prompt]
  );

  const [search, setSearch] = React.useState('');

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
              options={options}
              onSelect={onSelectSlot}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              searchable
              creatable
              onCreate={addSlot}
              placeholder="Name new entity or select existing entity"
              onSearch={setSearch}
              footerAction={
                !search
                  ? (hideMenu) => (
                      <NestedMenuComponents.FooterActionContainer
                        onClick={() => {
                          hideMenu();
                          addSlot();
                        }}
                      >
                        Create New Entity
                      </NestedMenuComponents.FooterActionContainer>
                    )
                  : undefined
              }
            />
            {selectedSlot && (
              <BlockText color={ThemeColor.SECONDARY} mt={12} fontSize={13}>
                Entity value being saved to{' '}
                <Text color={ThemeColor.PRIMARY} style={{ cursor: 'pointer' }} onClick={goToSelectedSlot}>{`{${selectedSlot.name}}`}</Text> variable
              </BlockText>
            )}
          </Section>
          {selectedSlot && (
            <>
              <Section
                isDividerNested
                infix={<>{hasPrompt ? 'Added' : 'Empty'}</>}
                header="Entity Reprompt"
                isLink
                tooltip={<EntityPromptTooltip />}
                onClick={goToEntityPrompt}
                headerVariant={HeaderVariant.LINK}
              />
              {canAddUtterances && (
                <UtteranceSection slot={selectedSlot} usedSlots={usedSlots} utterances={item.dialog.utterances} updateUtterances={updateUtterances} />
              )}
            </>
          )}
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef<HTMLElement, ConditionsSectionProps>(CaptureSection as any);

import composeRef from '@seznam/compose-react-refs';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useAddSlot, useAutoScrollNodeIntoView, useModals, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { EntityPromptSection } from '@/pages/Canvas/managers/components';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { ENTIRE_USER_REPLY_ID } from '../../constants';
import EntitySelector from '../../EntitySelector';
import { useEntitiesOptions } from '../../hooks';
import UtteranceSection from './UtteranceSection';

export interface DraggableItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<Platform.Base.Models.Intent.Slot>,
    MappedItemComponentHandlers<Platform.Base.Models.Intent.Slot> {
  editor: NodeEditorV2Props<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts>;
  selectedSlotIDs: string[];
  latestCreatedKey: string | undefined;
  onSelectQueryType: VoidFunction;
}

const DraggableItem: React.ForwardRefRenderFunction<HTMLElement, DraggableItemProps> = (
  {
    item,
    index,
    editor,
    itemKey,
    onUpdate,
    isDragging,
    onContextMenu,
    selectedSlotIDs,
    latestCreatedKey,
    connectedDragRef,
    onSelectQueryType,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const projectConfig = useActiveProjectTypeConfig();

  const slot = useSelector(SlotV2.slotByIDSelector, { id: item.id });
  const usedSlots = useSelector(SlotV2.slotsByIDsSelector, { ids: selectedSlotIDs });
  const unusedSlots = useSelector(SlotV2.slotsWithoutIDsSelector, { ids: selectedSlotIDs });
  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);

  const entityEditModal = useModals(ModalType.ENTITY_EDIT);

  const options = useEntitiesOptions(unusedSlots, slot);

  const { onAddSlot } = useAddSlot();

  const onSelect = (slotID?: string | null) => {
    if (!slotID) return;

    if (slotID === ENTIRE_USER_REPLY_ID) {
      onSelectQueryType();
    } else {
      onUpdate({ id: slotID });
    }
  };

  const onCreate = async (value = '') => {
    const slot = await onAddSlot(value);

    onSelect(slot?.id);
  };

  const onChangeDialog = (dialog: Partial<Platform.Base.Models.Intent.Slot['dialog']>) => {
    onUpdate({ dialog: { ...item.dialog, ...dialog } } as Partial<Platform.Base.Models.Intent.Slot>);
  };

  const autofocus = latestCreatedKey === itemKey || editor.data.intent?.slots.length === 1;

  const [sectionRef, scrollIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  return (
    <EditorV2.PersistCollapse namespace={['CaptureSection', item.id || itemKey]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && !isDraggingPreview && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed || isDragging || isDraggingPreview}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header ref={connectedDragRef} sticky sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}>
                    <SectionV2.Title bold={!collapsed}>{`Capture ${slot?.name ?? index + 1}`}</SectionV2.Title>

                    <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                  </SectionV2.Header>
                }
                onToggle={onToggle}
                onEntered={() => scrollIntoView({ block: 'nearest' })}
                collapsed={collapsed}
                isDragging={isDragging}
                onContextMenu={onContextMenu}
                containerToggle
                isDraggingPreview={isDraggingPreview}
                isContextMenuOpen={isContextMenuOpen}
              >
                {isDragging || isDraggingPreview ? null : (
                  <>
                    <SectionV2.Content bottomOffset={2.5}>
                      <EntitySelector
                        value={item.id}
                        onEdit={slot ? () => entityEditModal.open({ id: slot.id }) : undefined}
                        options={options}
                        onCreate={onCreate}
                        onSelect={onSelect}
                      />
                    </SectionV2.Content>

                    {!!slot && (
                      <>
                        <SectionV2.Divider inset />

                        <EntityPromptSection
                          title="Entity reprompt"
                          onAdd={() => onChangeDialog({ prompt: [projectConfig.utils.intent.promptFactory({ defaultVoice })] })}
                          prompt={item.dialog.prompt}
                          onChange={(prompt) => onChangeDialog({ prompt })}
                          onRemove={() => onChangeDialog({ prompt: [] })}
                          collapsed={!item?.dialog.prompt.length}
                          placeholder="Enter question to prompt user to fill entity"
                          intentEntities={usedSlots}
                        />

                        {!isGooglePlatform(editor.platform) && !isDialogflowPlatform(editor.platform) && (
                          <>
                            {editor.data.utterancesShown && (
                              <>
                                <SectionV2.Divider inset />

                                <UtteranceSection
                                  slot={slot}
                                  onChange={(utterances) => onChangeDialog({ utterances })}
                                  usedSlots={usedSlots}
                                  utterances={item.dialog.utterances}
                                  preventAccent
                                />
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </SectionV2.CollapseSection>
            )}
          </SectionV2.Sticky>
        </>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem);

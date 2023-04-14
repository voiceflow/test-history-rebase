import composeRef from '@seznam/compose-react-refs';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import EntityPromptSection from '@/components/EntityPromptSection';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useAddSlot, useAutoScrollNodeIntoView, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
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

  const entity = useSelector(SlotV2.slotByIDSelector, { id: item.id });
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);
  const usedEntities = useSelector(SlotV2.slotsByIDsSelector, { ids: selectedSlotIDs });
  const unusedEntities = useSelector(SlotV2.slotsWithoutIDsSelector, { ids: selectedSlotIDs });

  const entityEditModal = ModalsV2.useModal(ModalsV2.NLU.Entity.Edit);

  const options = useEntitiesOptions(unusedEntities, entity);

  const { onAddSlot } = useAddSlot();

  const onSelect = (slotID?: string | null) => {
    if (!slotID) return;

    if (slotID === ENTIRE_USER_REPLY_ID) {
      onSelectQueryType();
    } else {
      onUpdate({
        id: slotID,
        dialog: projectConfig.utils.intent.slotDialogSanitizer({ prompt: [projectConfig.utils.intent.promptFactory({ defaultVoice })] }),
      });
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
                    <SectionV2.Title bold={!collapsed}>{`Capture ${entity?.name ?? index + 1}`}</SectionV2.Title>

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
                        onEdit={entity ? () => entityEditModal.open({ slotID: entity.id }) : undefined}
                        options={options}
                        onCreate={onCreate}
                        onSelect={onSelect}
                      />
                    </SectionV2.Content>

                    {!!entity && (
                      <>
                        <SectionV2.Divider inset />

                        <EntityPromptSection
                          entity={entity}
                          prompts={item.dialog.prompt}
                          entities={usedEntities}
                          onChange={(prompt) => onChangeDialog({ prompt })}
                          intentName=""
                          intentInputs={item.dialog.utterances}
                        />

                        {!isGooglePlatform(editor.platform) && !isDialogflowPlatform(editor.platform) && (
                          <>
                            {editor.data.utterancesShown && (
                              <>
                                <SectionV2.Divider inset />

                                <UtteranceSection
                                  slot={entity}
                                  onChange={(utterances) => onChangeDialog({ utterances })}
                                  utterances={item.dialog.utterances}
                                  usedEntities={usedEntities}
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

import composeRef from '@seznam/compose-react-refs';
import type * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import type {
  DragPreviewComponentProps,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from '@/components/DraggableList';
import EntityPromptSection from '@/components/EntityPromptSection';
import * as Designer from '@/ducks/designer';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useAutoScrollNodeIntoView, useSelector } from '@/hooks';
import { useEntityCreateModal, useEntityEditModal } from '@/hooks/modal.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
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

  const entity = useSelector(Designer.Entity.selectors.oneWithVariantByID, { id: item.id });
  const usedEntities = useSelector(Designer.Entity.selectors.allByIDs, { ids: selectedSlotIDs });
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);
  const unusedEntities = useSelector(Designer.Entity.selectors.allWithoutIDs, { ids: selectedSlotIDs });

  const options = useEntitiesOptions(unusedEntities, entity);
  const entityEditModal = useEntityEditModal();
  const entityCreateModal = useEntityCreateModal();

  const onSelect = (slotID?: string | null) => {
    if (!slotID) return;

    if (slotID === ENTIRE_USER_REPLY_ID) {
      onSelectQueryType();
    } else {
      onUpdate({
        id: slotID,
        dialog: projectConfig.utils.intent.slotDialogSanitizer({
          prompt: [projectConfig.utils.intent.promptFactory({ defaultVoice })],
        }),
      });
    }
  };

  const onCreate = async (name = '') => {
    try {
      const entity = await entityCreateModal.open({
        name,
        folderID: null,
      });

      onSelect(entity.id);
    } catch {
      // model is closed
    }
  };

  const onChangeDialog = (dialog: Partial<Platform.Base.Models.Intent.Slot['dialog']>) => {
    onUpdate({ dialog: { ...item.dialog, ...dialog } } as Partial<Platform.Base.Models.Intent.Slot>);
  };

  const autofocus = latestCreatedKey === itemKey || editor.data.intent?.slots.length === 1;

  const [sectionRef, scrollIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({
    condition: autofocus,
    options: { block: 'end' },
  });

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
                  <SectionV2.Header
                    ref={connectedDragRef}
                    sticky
                    sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}
                  >
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
                        onEdit={entity ? () => entityEditModal.openVoid({ entityID: entity.id }) : undefined}
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

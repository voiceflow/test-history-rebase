import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, StrengthGauge } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import LegacyMappings from '@/components/IntentLegacyMappings';
import IntentSelect from '@/components/IntentSelect';
import * as IntentV2 from '@/ducks/intentV2';
import { useAutoScrollNodeIntoView, useDispatch, useIntent, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';
import { getIntentStrengthLevel } from '@/utils/intent';

import { Actions, Entity } from '../../components';
import { NodeEditorV2Props } from '../../types';

export interface DraggableItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<Realtime.NodeData.InteractionChoice>,
    MappedItemComponentHandlers<Realtime.NodeData.InteractionChoice> {
  editor: NodeEditorV2Props<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const DraggableItem: React.ForwardRefRenderFunction<HTMLElement, DraggableItemProps> = (
  { item, index, editor, itemKey, onUpdate, isDragging, onContextMenu, connectedDragRef, latestCreatedKey, isDraggingPreview, isContextMenuOpen },
  ref
) => {
  const intents = useSelector(IntentV2.allPlatformIntentsSelector);

  const onAddRequiredEntity = useDispatch(IntentV2.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(IntentV2.removeRequiredSlot);

  const { intent, editIntentModal, intentIsBuiltIn, intentHasRequiredEntity } = useIntent(item.intent);

  const autofocus = latestCreatedKey === itemKey || editor.data.choices.length === 1;

  // filter out intents already used in interaction block
  const availableIntents = React.useMemo(
    () => intents.filter(({ id }) => id === intent?.id || !editor.data.choices.some((choice) => choice?.intent === id)),
    [intent, intents, editor.data.choices]
  );

  const [sectionRef, scrollIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  return (
    <EditorV2.PersistCollapse namespace={['interactionItem', item.id]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && !isDraggingPreview && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed || isDragging || isDraggingPreview}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header ref={connectedDragRef} sticky sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}>
                    <Box.Flex gap={16}>
                      <SectionV2.Title bold={!collapsed}>{intent?.name || `Path ${index + 1}`}</SectionV2.Title>

                      <Box.Flex pt={2}>
                        <StrengthGauge
                          width={36}
                          level={intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent?.inputs.length ?? 0)}
                          tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }}
                        />
                      </Box.Flex>
                    </Box.Flex>

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
                {!isDragging && !isDraggingPreview && (
                  <>
                    <SectionV2.Content bottomOffset={2.5}>
                      <IntentSelect
                        intent={intent}
                        options={availableIntents}
                        onChange={onUpdate}
                        fullWidth
                        clearable
                        leftAction={intent ? { icon: 'edit', onClick: () => editIntentModal.openVoid({ intentID: intent.id }) } : undefined}
                        placeholder="Select intent"
                        renderEmpty={!availableIntents.length ? () => <div /> : null}
                        inDropdownSearch
                        alwaysShowCreate
                        clearOnSelectActive
                      />
                    </SectionV2.Content>

                    {intent && !intentIsBuiltIn && intentHasRequiredEntity && (
                      <>
                        <SectionV2.Divider inset />

                        <IntentRequiredEntitiesSection
                          onEntityClick={(entityID) => editor.goToNested({ path: Entity.PATH, params: { intentID: intent.id, entityID } })}
                          onAddRequired={(entityID) => onAddRequiredEntity(intent.id, entityID)}
                          intentEntities={intent.slots}
                          onRemoveRequired={(entityID) => onRemoveRequiredEntity(intent.id, entityID)}
                          onGeneratePrompt={(entityID) =>
                            editor.goToNested({ path: Entity.PATH, params: { intentID: intent.id, entityID }, state: { autogenerate: true } })
                          }
                          addDropdownPlacement="bottom-end"
                        />
                      </>
                    )}

                    <SectionV2.Divider inset />

                    <Actions.Section portID={editor.node.ports.out.dynamic[index]} editor={editor} />

                    <LegacyMappings intent={intent} mappings={item.mappings} onDelete={() => onUpdate({ mappings: [] })} />
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

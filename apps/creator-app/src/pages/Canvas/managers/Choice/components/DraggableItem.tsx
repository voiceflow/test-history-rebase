import composeRef from '@seznam/compose-react-refs';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, StrengthGauge } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import LegacyMappings from '@/components/IntentLegacyMappings';
import IntentSelect from '@/components/IntentSelect';
import { Designer } from '@/ducks';
import { useAutoScrollNodeIntoView } from '@/hooks';
import { useIntent } from '@/hooks/intent.hook';
import { useSelector } from '@/hooks/store.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
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
  const intents = useSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);

  const { intent, strengthLevel, onOpenIntentEditModal } = useIntent(item.intent);

  const autofocus = latestCreatedKey === itemKey || editor.data.choices.length === 1;

  // filter out intents already used in interaction block
  const availableIntents = React.useMemo(
    () => Utils.array.inferUnion(intents).filter(({ id }) => id === intent?.id || !editor.data.choices.some((choice) => choice?.intent === id)),
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
                        <StrengthGauge width={36} level={strengthLevel} tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }} />
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
                        leftAction={
                          intent
                            ? {
                                icon: 'edit',
                                onClick: () => onOpenIntentEditModal({ intentID: intent.id }),
                                disabled: intent.id === VoiceflowConstants.IntentName.NONE,
                              }
                            : undefined
                        }
                        placeholder="Select intent"
                        renderEmpty={!availableIntents.length ? () => <div /> : null}
                        inDropdownSearch
                        alwaysShowCreate
                        clearOnSelectActive
                      />
                    </SectionV2.Content>
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

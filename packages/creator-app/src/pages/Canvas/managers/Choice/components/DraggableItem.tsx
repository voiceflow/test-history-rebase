import composeRef from '@seznam/compose-react-refs';
import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, SectionV2, StrengthGauge, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import GoToIntentSelect from '@/components/GoToIntentSelect';
import { LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import RadioGroup from '@/components/RadioGroup';
import { FeatureFlag } from '@/config/features';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useAutoScrollNodeIntoView, useDispatch, useFeature, useIntent, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';
import { getIntentStrengthLevel } from '@/utils/intent';

import { Entity } from '../../components';
import { NodeEditorV2Props } from '../../types';
import { INTENT_ACTION_OPTIONS } from './constants';
import HelpTooltip from './HelpTooltip';

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
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);

  const intents = useSelector(IntentV2.allPlatformIntentsSelector);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const onAddRequiredEntity = useDispatch(Intent.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(Intent.removeRequiredSlot);

  const { intent, intentEditModal, intentIsBuiltIn, intentHasRequiredEntity } = useIntent(item.intent);

  const autofocus = latestCreatedKey === itemKey || editor.data.choices.length === 1;

  // filter out intents already used in interaction block
  const availableIntents = React.useMemo(
    () => intents.filter(({ id }) => id === intent?.id || !editor.data.choices.some((choice) => choice?.intent === id)),
    [intent, intents, editor.data.choices]
  );

  const [sectionRef, scrollIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  const onChangeGoToIntent = (data: Realtime.NodeData.InteractionChoice['goTo']) =>
    onUpdate({ goTo: { ...item.goTo, intentID: data?.intentID ?? null, diagramID: data?.diagramID ?? null } });

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
                    <BoxFlex>
                      <SectionV2.Title bold={!collapsed}>{intent?.name || `Path ${index + 1}`}</SectionV2.Title>

                      <BoxFlex pl={4} pt={2}>
                        <StrengthGauge
                          width={36}
                          level={intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent?.inputs.length ?? 0)}
                          tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }}
                        />
                      </BoxFlex>
                    </BoxFlex>

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
                        leftAction={intent ? { icon: 'edit', onClick: () => intentEditModal.open({ id: intent.id }) } : undefined}
                        placeholder="Select intent"
                        renderEmpty={!availableIntents.length ? () => <div /> : null}
                        inDropdownSearch
                        alwaysShowCreate
                        clearOnSelectActive
                      />
                    </SectionV2.Content>

                    {!!intent && topicsAndComponents.isEnabled && isTopicsAndComponentsVersion && (
                      <>
                        <SectionV2.Divider inset />

                        <SectionV2
                          header={
                            <SectionV2.Header>
                              <BoxFlex>
                                <SectionV2.Title bold>Intent Action</SectionV2.Title>

                                <TutorialInfoIcon>
                                  <HelpTooltip />
                                </TutorialInfoIcon>
                              </BoxFlex>
                            </SectionV2.Header>
                          }
                        >
                          <SectionV2.Content bottomOffset={2.5}>
                            <RadioGroup checked={item.action} options={INTENT_ACTION_OPTIONS} onChange={(action) => onUpdate({ action })} />

                            {item.action === BaseNode.Interaction.ChoiceAction.GO_TO && (
                              <Box pt={12}>
                                <GoToIntentSelect
                                  onChange={onChangeGoToIntent}
                                  intentID={item.goTo?.intentID}
                                  diagramID={item.goTo?.diagramID}
                                  placeholder="Behave as user triggered intent"
                                />
                              </Box>
                            )}
                          </SectionV2.Content>
                        </SectionV2>
                      </>
                    )}

                    {intent && !intentIsBuiltIn && intentHasRequiredEntity && (
                      <>
                        <SectionV2.Divider inset />

                        <IntentRequiredEntitiesSection
                          onEntityClick={(entityID) => editor.goToNested({ path: Entity.PATH, params: { intentID: intent.id, entityID } })}
                          onAddRequired={(entityID) => onAddRequiredEntity(intent.id, entityID)}
                          intentEntities={intent.slots}
                          onRemoveRequired={(entityID) => onRemoveRequiredEntity(intent.id, entityID)}
                          addDropdownPlacement="bottom-end"
                        />
                      </>
                    )}

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

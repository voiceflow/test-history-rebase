import composeRef from '@seznam/compose-react-refs';
import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, Link, SectionV2, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import GoToIntentSelect from '@/components/GoToIntentSelect';
import IntentSelect from '@/components/IntentSelect';
import RadioGroup from '@/components/RadioGroup';
import VariablesInput from '@/components/VariablesInput';
import * as Documentation from '@/config/documentation';
import { FeatureFlag } from '@/config/features';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import { useAutoScrollNodeIntoView, useDispatch, useFeature, useIntent, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';
import { transformVariablesToReadable } from '@/utils/slot';

import { Entity } from '../../components';
import { NodeEditorV2Props } from '../../types';
import { BUTTON_ACTION_OPTIONS, ButtonAction } from './constants';
import HelpTooltip from './HelpTooltip';
import URLSection from './URLSection';

export interface DraggableItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<BaseNode.Buttons.Button>,
    MappedItemComponentHandlers<BaseNode.Buttons.Button> {
  editor: NodeEditorV2Props<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const DraggableItem: React.ForwardRefRenderFunction<HTMLElement, DraggableItemProps> = (
  { item, index, editor, itemKey, onUpdate, isDragging, onContextMenu, latestCreatedKey, connectedDragRef, isDraggingPreview, isContextMenuOpen },
  ref
) => {
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const onAddRequiredEntity = useDispatch(Intent.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(Intent.removeRequiredSlot);

  const { intent, intentEditModal, intentIsBuiltIn, intentHasRequiredEntity } = useIntent(item.intent);

  const isPath = item.actions.includes(BaseNode.Buttons.ButtonAction.PATH);
  const withURL = item.actions.includes(BaseNode.Buttons.ButtonAction.URL);
  const isGoToIntent = !isPath && item.actions.includes(BaseNode.Buttons.ButtonAction.INTENT);

  const autofocus = latestCreatedKey === itemKey || editor.data.buttons.length === 1;
  const activeAction = isGoToIntent ? ButtonAction.GO_TO_INTENT : ButtonAction.FOLLOW_PATH;

  const [sectionRef, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  const onUpdateButtonAction = (action: ButtonAction) => {
    let nextActions = item.actions;

    if (action === ButtonAction.GO_TO_INTENT) {
      nextActions = Utils.array.withoutValue(nextActions, BaseNode.Buttons.ButtonAction.PATH);
    } else {
      nextActions = [...nextActions, BaseNode.Buttons.ButtonAction.PATH];
    }

    onUpdate({ intent: null, actions: Utils.array.unique([...nextActions, BaseNode.Buttons.ButtonAction.INTENT]) });
  };

  return (
    <EditorV2.PersistCollapse namespace={['buttonsListItem', item.id]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && !isDraggingPreview && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed || isDragging || isDraggingPreview}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header ref={connectedDragRef} sticky sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}>
                    <SectionV2.Title bold={!collapsed}>
                      {transformVariablesToReadable(item.name) || intent?.name || `Button ${index + 1}`}
                    </SectionV2.Title>

                    <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                  </SectionV2.Header>
                }
                onToggle={onToggle}
                onEntered={() => scrollSectionIntoView({ block: 'nearest' })}
                collapsed={collapsed}
                isDragging={isDragging}
                onContextMenu={onContextMenu}
                containerToggle
                isDraggingPreview={isDraggingPreview}
                isContextMenuOpen={isContextMenuOpen}
              >
                {isDragging || isDraggingPreview ? null : (
                  <>
                    <SectionV2.Content>
                      <VariablesInput
                        value={item.name}
                        onBlur={({ text }) => onUpdate({ name: text.trim() })}
                        fullWidth
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus={autofocus}
                        placeholder="Enter button label"
                      />
                    </SectionV2.Content>

                    <SectionV2.Divider inset offset={[12, 0]} />

                    <SectionV2
                      header={
                        <SectionV2.Header>
                          <BoxFlex>
                            <SectionV2.Title bold>Button Action</SectionV2.Title>

                            <TutorialInfoIcon>
                              <HelpTooltip />
                            </TutorialInfoIcon>
                          </BoxFlex>
                        </SectionV2.Header>
                      }
                    >
                      <SectionV2.Content bottomOffset={1.5}>
                        <RadioGroup options={BUTTON_ACTION_OPTIONS} checked={activeAction} onChange={onUpdateButtonAction} />
                      </SectionV2.Content>

                      <SectionV2.Content bottomOffset={2.5}>
                        {isGoToIntent && topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? (
                          <GoToIntentSelect
                            onChange={(data) => onUpdate({ intent: data?.intentID ?? null, diagramID: data?.diagramID ?? null })}
                            intentID={item.intent}
                            diagramID={item.diagramID}
                            placeholder="Behave as user triggered intent"
                          />
                        ) : (
                          <>
                            {isGoToIntent ? (
                              <IntentSelect
                                intent={intent}
                                onChange={({ intent }) => onUpdate({ intent, diagramID: null })}
                                clearable
                                creatable={false}
                                placeholder="Behave as user triggered intent"
                                renderEmpty={({ close, search }) => (
                                  <Box flex={1} textAlign="center">
                                    {!search ? 'No open intents exists in your project. ' : 'No open intents found. '}
                                    <Link href={Documentation.OPEN_INTENT} onClick={close}>
                                      Learn more
                                    </Link>
                                  </Box>
                                )}
                              />
                            ) : (
                              <IntentSelect
                                intent={intent}
                                onChange={({ intent }) => onUpdate({ intent, diagramID: null })}
                                fullWidth
                                clearable
                                leftAction={intent ? { icon: 'edit', onClick: () => intentEditModal.open({ id: intent.id }) } : undefined}
                                placeholder="Select trigger intent"
                                inDropdownSearch
                                alwaysShowCreate
                                clearOnSelectActive
                              />
                            )}
                          </>
                        )}
                      </SectionV2.Content>
                    </SectionV2>

                    {!isGoToIntent && !!intent && !intentIsBuiltIn && intentHasRequiredEntity && (
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

                    <SectionV2.Divider inset />

                    <URLSection
                      url={item.url ?? ''}
                      onAdd={() => onUpdate({ actions: Utils.array.unique([...item.actions, BaseNode.Buttons.ButtonAction.URL]) })}
                      onRemove={() => onUpdate({ url: '', actions: Utils.array.withoutValue(item.actions, BaseNode.Buttons.ButtonAction.URL) })}
                      isActive={withURL}
                      onChange={(url) => onUpdate({ url })}
                    />
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

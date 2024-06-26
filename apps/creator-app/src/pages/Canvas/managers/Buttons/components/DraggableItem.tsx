import composeRef from '@seznam/compose-react-refs';
import type { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import type {
  DragPreviewComponentProps,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from '@/components/DraggableList';
import IntentSelect from '@/components/IntentSelect';
import VariablesInput from '@/components/VariablesInput';
import { Diagram } from '@/ducks';
import { useAutoScrollNodeIntoView } from '@/hooks';
import { useIntent } from '@/hooks/intent.hook';
import { useSelector } from '@/hooks/store.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { transformVariablesToReadable } from '@/utils/slot';

import { Actions } from '../../components';
import type { NodeEditorV2Props } from '../../types';

export interface DraggableItemProps
  extends DragPreviewComponentProps,
    ItemComponentProps<BaseNode.Buttons.Button>,
    MappedItemComponentHandlers<BaseNode.Buttons.Button> {
  editor: NodeEditorV2Props<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts>;
  latestCreatedKey: string | undefined;
  itemCount: number;
  canAddIntent: boolean;
}

const DraggableItem: React.ForwardRefRenderFunction<HTMLElement, DraggableItemProps> = (
  {
    item,
    index,
    itemCount,
    editor,
    itemKey,
    onUpdate,
    isDragging,
    onContextMenu,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
    canAddIntent,
  },
  ref
) => {
  const entitiesAndVariables = useSelector(Diagram.active.allSlotsAndVariablesNormalizedSelector);
  const { intent, onOpenIntentEditModal } = useIntent(item.intent);

  const [attachIntentCollapsed, setAttachIntentCollapsed] = React.useState(!intent);

  const autofocus = latestCreatedKey === itemKey && itemCount !== 1;

  const [sectionRef, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({
    condition: autofocus,
    options: { block: 'end' },
  });

  const onRemoveIntent = () => {
    onUpdate({ intent: null });
    setAttachIntentCollapsed(true);
  };

  // show the intent option if already set
  const showIntent = canAddIntent || !!intent;
  return (
    <EditorV2.PersistCollapse namespace={['buttonsListItem', item.id]}>
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
                    <SectionV2.Title bold={!collapsed}>
                      {transformVariablesToReadable(item.name, entitiesAndVariables.byKey) ||
                        intent?.name ||
                        `Button ${index + 1}`}
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
                        autoFocus={autofocus}
                        placeholder="Enter button label"
                      />
                    </SectionV2.Content>

                    <SectionV2.Divider inset offset={[12, 0]} />

                    {showIntent && (
                      <SectionV2.ActionCollapseSection
                        title={<SectionV2.Title bold={!attachIntentCollapsed}>Attach intent</SectionV2.Title>}
                        action={
                          attachIntentCollapsed ? (
                            <SectionV2.AddButton onClick={() => setAttachIntentCollapsed(false)} />
                          ) : (
                            <SectionV2.RemoveButton onClick={onRemoveIntent} />
                          )
                        }
                        collapsed={attachIntentCollapsed}
                        contentProps={{ bottomOffset: 2.5 }}
                      >
                        <IntentSelect
                          intent={intent}
                          onChange={({ intent }) => onUpdate({ intent })}
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
                          placeholder="Select trigger intent"
                          inDropdownSearch
                          alwaysShowCreate
                          clearOnSelectActive
                        />
                      </SectionV2.ActionCollapseSection>
                    )}

                    {showIntent && <SectionV2.Divider inset />}

                    <Actions.Section portID={editor.node.ports.out.dynamic[index]} editor={editor} />
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

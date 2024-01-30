import composeRef from '@seznam/compose-react-refs';
import { BaseButton } from '@voiceflow/base-types';
import { Intent } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import { Box, SectionV2, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import IntentSelect from '@/components/IntentSelect';
import VariablesInput from '@/components/VariablesInput';
import { Designer, Diagram } from '@/ducks';
import { useAutoScrollNodeIntoView } from '@/hooks';
import { useSelector } from '@/hooks/store.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { getPlatformValue } from '@/utils/platform';
import { transformVariablesToReadable } from '@/utils/slot';
import { isGooglePlatform } from '@/utils/typeGuards';

import { NodeEditorV2Props } from '../../../types';

export interface DraggableItemProps
  extends ItemComponentProps<BaseButton.IntentButton>,
    DragPreviewComponentProps,
    MappedItemComponentHandlers<BaseButton.IntentButton> {
  editor: NodeEditorV2Props<{ buttons: BaseButton.AnyButton[] }>;
  intentOptions: Array<Platform.Base.Models.Intent.Model | UIOnlyMenuItemOption | Intent>;
  latestCreatedKey?: string;
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
    intentOptions,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const autofocus = latestCreatedKey === itemKey || editor.data.buttons.length === 1;

  const intent = useSelector(Designer.Intent.selectors.oneWithFormattedBuiltNameByID, { id: item.payload.intentID });
  const entitiesAndVariables = useSelector(Diagram.active.allSlotsAndVariablesNormalizedSelector);

  const [sectionRef, scrollIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: autofocus, options: { block: 'end' } });

  const label = getPlatformValue(editor.platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chip' }, 'Button');

  return (
    <EditorV2.PersistCollapse namespace={['buttonItem', itemKey]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && !isDraggingPreview && <SectionV2.Divider />}

          <SectionV2.CollapseSection
            ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
            header={
              <SectionV2.Header ref={connectedDragRef}>
                <SectionV2.Title bold={!collapsed}>
                  {transformVariablesToReadable(item.name, entitiesAndVariables.byKey) || `${label} ${index + 1}`}
                </SectionV2.Title>

                <SectionV2.CollapseArrowIcon collapsed={collapsed} />
              </SectionV2.Header>
            }
            onToggle={onToggle}
            collapsed={collapsed}
            onEntered={() => scrollIntoView({ block: 'nearest' })}
            isDragging={isDragging}
            onContextMenu={onContextMenu}
            containerToggle
            isDraggingPreview={isDraggingPreview}
            isContextMenuOpen={isContextMenuOpen}
          >
            {isDragging || isDraggingPreview ? null : (
              <SectionV2.Content bottomOffset={2.5}>
                <VariablesInput
                  value={item.name}
                  onBlur={({ text }) => onUpdate({ name: text })}
                  autoFocus={autofocus}
                  placeholder={`Enter ${label.toLowerCase()} name`}
                />

                {!isGooglePlatform(editor.platform) && (
                  <Box mt={16}>
                    <IntentSelect
                      icon="user"
                      intent={intent}
                      options={intentOptions}
                      onChange={({ intent }) => onUpdate({ payload: { intentID: intent } })}
                      clearable
                      iconProps={{ color: '#5589eb' }}
                      creatable={false}
                      placeholder="Behave as user triggered intent"
                    />
                  </Box>
                )}
              </SectionV2.Content>
            )}
          </SectionV2.CollapseSection>
        </>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem);

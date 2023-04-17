import { BaseNode } from '@voiceflow/base-types';
import { Divider, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { SlateTextInput } from '@/components/SlateInputs';
import { useActiveProjectTypeConfig } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import MessageDelayButton from '@/pages/Canvas/components/MessageDelayButton';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Text/constants';
import THEME from '@/styles/theme';

export type TextListItemProps = ListItemComponentProps<BaseNode.Text.TextData, { header?: React.ReactNode }>;

const TextListItem = React.forwardRef<HTMLElement, TextListItemProps>(
  (
    {
      item,
      index,
      header,
      itemKey,
      onUpdate,
      isOnlyItem,
      isDragging,
      onContextMenu,
      latestCreatedKey,
      connectedDragRef,
      isDraggingPreview,
      isContextMenuOpen,
      isRandomized,
    },
    ref
  ) => {
    const isNew = latestCreatedKey === itemKey;

    const config = useActiveProjectTypeConfig();

    return (
      <EditorSection
        ref={ref as React.Ref<HTMLDivElement>}
        namespace={['textListItem', item.id]}
        header={header || `Text Variant ${index + 1}`}
        prefix={<SvgIcon icon={NODE_CONFIG.icon!} color={THEME.buttonIconColors.default} />}
        headerRef={connectedDragRef}
        isDragging={isDragging}
        suffix={isRandomized && 'randomLoop'}
        initialOpen={isNew || isOnlyItem}
        headerToggle
        onContextMenu={onContextMenu}
        collapseVariant={!isDragging && !isDraggingPreview ? SectionToggleVariant.ARROW : null}
        isDraggingPreview={isDraggingPreview}
        isContextMenuOpen={isContextMenuOpen}
      >
        {isDragging || isDraggingPreview ? null : (
          <FormControl contentBottomUnits={2.5}>
            <SlateTextInput
              value={item.content}
              onBlur={(value) => onUpdate({ content: value })}
              options={config.project.chat.toolbarOptions}
              autofocus={isNew}
              extraToolbarButtons={
                config.project.chat.messageDelay && (
                  <>
                    <Divider isVertical height="15px" style={{ margin: 0 }} />
                    <MessageDelayButton
                      delay={item.messageDelayMilliseconds}
                      onChange={(messageDelayMilliseconds) => onUpdate({ messageDelayMilliseconds })}
                    />
                  </>
                )
              }
            />
          </FormControl>
        )}
      </EditorSection>
    );
  }
);

export default React.memo(TextListItem);

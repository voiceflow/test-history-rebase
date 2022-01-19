import { Node } from '@voiceflow/base-types';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import { SectionToggleVariant } from '@/components/Section';
import SlateEditableWithVariables from '@/components/SlateEditableWithVariables';
import { FeatureFlag } from '@/config/features';
import { compose } from '@/hocs';
import { useFeature } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Text/constants';
import THEME from '@/styles/theme';

import MessageDelayButton from './components/MessageDelayButton';

export type TextListItemProps = ListItemComponentProps<Node.Text.TextData, { header?: React.ReactNode }>;

const TextListItem: React.ForwardRefRenderFunction<HTMLDivElement, TextListItemProps> = (
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
  const messageDelays = useFeature(FeatureFlag.PROTOTYPE_MESSAGE_DELAYS);

  return (
    <EditorSection
      ref={ref}
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
          <SlateEditableWithVariables
            value={item.content}
            onBlur={(value) => onUpdate({ content: value })}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isNew}
            extraToolbarButtons={
              messageDelays.isEnabled ? (
                <>
                  <Divider isVertical height="15px" style={{ margin: 0 }} />
                  <MessageDelayButton data={item} onUpdate={(value: Partial<Node.Text.TextData>) => onUpdate(value)} />
                </>
              ) : undefined
            }
          />
        </FormControl>
      )}
    </EditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(TextListItem);

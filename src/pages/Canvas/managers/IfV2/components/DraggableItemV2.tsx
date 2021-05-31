import React from 'react';

import Badge from '@/components/Badge';
import ConditionsBuilder from '@/components/ConditionsBuilder';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import Input from '@/components/Input';
import Section, { SectionToggleVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import { useSetup } from '@/hooks';
import { ExpressionData } from '@/models';
import EditorSection from '@/pages/Canvas/components/EditorSection';

export type IfItemProps = ItemComponentProps<ExpressionData> &
  MappedItemComponentHandlers<ExpressionData> &
  DragPreviewComponentProps & {
    latestCreatedKey: string | undefined;
    isOnlyItem: boolean;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, IfItemProps> = (
  { itemKey, index, item, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef, onContextMenu, isContextMenuOpen },
  ref
) => {
  const [title, setTitle] = React.useState<string | undefined>('');

  const isNew = itemKey === latestCreatedKey;

  const onBlur = React.useCallback(() => {
    onUpdate({ ...item, name: title } as ExpressionData);
  }, [onUpdate, title]);

  useSetup(() => {
    if ((item as ExpressionData).name) {
      setTitle((item as ExpressionData).name);
    }
  }, [item]);

  return (
    <EditorSection
      ref={ref}
      namespace={['ifItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header={(item as ExpressionData).name || 'Condition'}
      prefix={<Badge>{index + 1}</Badge>}
      headerRef={connectedDragRef}
      collapseVariant={(!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW) || null}
      isDragging={isDragging}
      headerToggle
      isDraggingPreview={isDraggingPreview}
      onContextMenu={onContextMenu}
      isContextMenuOpen={isContextMenuOpen}
      customContentStyling={{ padding: '0px' }}
    >
      {isDragging || isDraggingPreview ? null : (
        <>
          <Section customContentStyling={{ paddingTop: '0px' }}>
            <Input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={!title}
              value={title}
              onChange={({ currentTarget }) => setTitle(currentTarget.value)}
              onBlur={onBlur}
              leftAction={<SvgIcon icon="if" size={16} color="#f86683" />}
              placeholder="Name condition"
            />
          </Section>
          <Section isDividerNested customContentStyling={{ paddingTop: '0px', paddingBottom: '0px' }}>
            <ConditionsBuilder expression={item as ExpressionData} onChange={onUpdate} />
          </Section>
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef<HTMLElement, IfItemProps>(DraggableItem as any);

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
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = React.useState<string>((item as ExpressionData).name ?? '');

  const isNew = itemKey === latestCreatedKey;

  const onBlur = React.useCallback(() => {
    onUpdate({ ...item, name: title } as ExpressionData);
  }, [onUpdate, title]);

  useSetup(() => {
    if (!(item as ExpressionData).name) inputRef.current?.focus?.();
  });

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
              ref={inputRef}
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

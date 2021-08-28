import { Badge, Input } from '@voiceflow/ui';
import React from 'react';

import ConditionsBuilder from '@/components/ConditionsBuilder';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import Section, { SectionToggleVariant } from '@/components/Section';
import { useSetup } from '@/hooks';
import { ExpressionData } from '@/models';
import EditorSection from '@/pages/Canvas/components/EditorSection';

export type ConditionsSectionProps = ItemComponentProps<ExpressionData> &
  MappedItemComponentHandlers<ExpressionData> &
  DragPreviewComponentProps & {
    latestCreatedKey: string | undefined;
    isOnlyItem: boolean;
  };

const ConditionsSection: React.ForwardRefRenderFunction<HTMLDivElement, ConditionsSectionProps> = (
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
      namespace={['ConditionsSection', item.id]}
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
              placeholder="Condition Label"
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

export default React.forwardRef<HTMLElement, ConditionsSectionProps>(ConditionsSection as any);

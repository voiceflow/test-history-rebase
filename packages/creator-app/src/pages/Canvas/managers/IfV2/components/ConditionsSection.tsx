import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Input } from '@voiceflow/ui';
import React from 'react';

import ConditionsBuilder from '@/components/ConditionsBuilder';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import Section, { SectionToggleVariant } from '@/components/Section';
import { useSetup } from '@/hooks';
import EditorSection from '@/pages/Canvas/components/EditorSection';

export type ConditionsSectionProps = ItemComponentProps<Realtime.ExpressionData> &
  MappedItemComponentHandlers<Realtime.ExpressionData> &
  DragPreviewComponentProps & {
    latestCreatedKey: string | undefined;
    isOnlyItem: boolean;
  };

const ConditionsSection: React.ForwardRefRenderFunction<HTMLDivElement, ConditionsSectionProps> = (
  { itemKey, index, item, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef, onContextMenu, isContextMenuOpen },
  ref
) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = React.useState<string>((item as Realtime.ExpressionData).name ?? '');

  const isNew = itemKey === latestCreatedKey;

  const onBlur = React.useCallback(() => {
    onUpdate({ ...item, name: title } as Realtime.ExpressionData);
  }, [onUpdate, title]);

  useSetup(() => {
    if (!(item as Realtime.ExpressionData).name) inputRef.current?.focus?.();
  });

  return (
    <EditorSection
      ref={ref}
      namespace={['ConditionsSection', item.id]}
      initialOpen={isNew || isOnlyItem}
      header={(item as Realtime.ExpressionData).name || 'Condition'}
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
            <ConditionsBuilder expression={item as Realtime.ExpressionData} onChange={onUpdate} />
          </Section>
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef<HTMLElement, ConditionsSectionProps>(ConditionsSection as any);

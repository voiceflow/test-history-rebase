import React from 'react';

import ExpressionEditor from '@/components/ExpressionEditor';
import { SectionToggleVariant } from '@/components/Section';
import VariableSelect from '@/components/VariableSelect';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';

import DropdownWrapper from './DropdownWrapper';

const DraggableItem = ({ itemKey, item, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef }, ref) => {
  const updateExpression = React.useCallback((expression) => onUpdate({ expression: { ...item.expression, ...expression } }), [
    item.expression,
    onUpdate,
  ]);
  const updateVariable = React.useCallback((variable) => onUpdate({ variable }), [onUpdate]);
  const isNew = latestCreatedKey === itemKey;

  return (
    <EditorSection
      ref={ref}
      namespace={['setItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header="Set"
      dropdown={
        <DropdownWrapper>
          <VariableSelect value={item.variable} autoWidth={false} onChange={updateVariable} />
          <span>to</span>
        </DropdownWrapper>
      }
      headerRef={connectedDragRef}
      collapseVariant={!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW}
      isDragging={isDragging}
      headerToggle
      isDraggingPreview={isDraggingPreview}
    >
      {isDragging || isDraggingPreview ? null : (
        <FormControl>
          <ExpressionEditor expression={item.expression} onChange={updateExpression} />
        </FormControl>
      )}
    </EditorSection>
  );
};

export default React.forwardRef(DraggableItem);

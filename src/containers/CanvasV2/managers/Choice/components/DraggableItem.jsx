import React from 'react';

import IntentForm, { LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Badge from '@/componentsV2/Badge';
import Section, { SectionToggleVariant } from '@/componentsV2/Section';
import EditorSection from '@/containers/CanvasV2/components/EditorSection';
import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';

const DraggableItem = (
  {
    itemKey,
    index,
    item,
    items,
    isOnlyItem,
    isDragging,
    isDraggingPreview,
    onUpdate,
    latestCreatedKey,
    intent,
    intents,
    pushToPath,
    connectedDragRef,
  },
  ref
) => {
  const isNew = itemKey === latestCreatedKey;
  // filter out intents already used in interaction block
  const filteredIntents = React.useMemo(() => intents.filter(({ id }) => id === intent?.id || !items.some((choice) => choice.intent === id)), [
    intent,
    intents,
    items,
  ]);

  return (
    <EditorSection
      ref={ref}
      namespace={['interactionItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header={intent?.name || 'Path'}
      prefix={<Badge>{index + 1}</Badge>}
      collapseVariant={!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW}
      isDragging={isDragging}
      headerToggle
      headerRef={connectedDragRef}
      isDraggingPreview={isDraggingPreview}
    >
      {isDragging || isDraggingPreview ? null : (
        <>
          <Section isNested dividers={false} customContentStyling={{ paddingTop: 0 }}>
            <IntentSelect intent={intent} onChange={onUpdate} intents={filteredIntents} />
          </Section>
          <IntentForm isNested intent={intent} isOpened={item.open} onChange={onUpdate} pushToPath={pushToPath} />
          <LegacyMappings intent={intent} mappings={item.mappings} onDelete={() => onUpdate({ mappings: [] })} isNested />
        </>
      )}
    </EditorSection>
  );
};

const mapStateToProps = {
  intents: Intent.allPlatformIntentsSelector,
  intent: Intent.platformIntentByIDSelector,
};

const mergeProps = ({ intent: getIntentByID }, _, { item }) => ({
  intent: item.intent ? getIntentByID(item.intent) : { inputs: [] },
});

export default connect(
  mapStateToProps,
  null,
  mergeProps,
  { forwardRef: true }
)(React.forwardRef(DraggableItem));

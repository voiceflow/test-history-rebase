import { Constants } from '@voiceflow/general-types';
import { Badge } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentHandlers, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import IntentForm, { LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Section, { SectionToggleVariant } from '@/components/Section';
import { DistinctPlatform } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { connect } from '@/hocs';
import { Intent, NodeData } from '@/models';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ConnectedProps, MergeArguments } from '@/types';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

const LegacyMappingsComponent = LegacyMappings as React.FC<any>;
const IntentSelectComponent = IntentSelect as React.FC<any>;

export type DraggableItemProps = ItemComponentProps<Record<DistinctPlatform, NodeData.InteractionChoice>> &
  DragPreviewComponentProps &
  (
    | ItemComponentHandlers<Record<DistinctPlatform, NodeData.InteractionChoice>>
    | MappedItemComponentHandlers<Record<DistinctPlatform, NodeData.InteractionChoice>>
  ) & {
    items: NodeData.InteractionChoice[];
    platform: Constants.PlatformType;
    isOnlyItem: boolean;
    latestCreatedKey: string | undefined;
    pushToPath: (subPath: string) => void;
  };

const DraggableItem = React.forwardRef(
  (
    {
      itemKey,
      index,
      item,
      items,
      isOnlyItem,
      isDragging,
      isDraggingPreview,
      patchPlatformData,
      latestCreatedKey,
      intent,
      intents,
      pushToPath,
      connectedDragRef,
      onContextMenu,
      isContextMenuOpen,
    }: DraggableItemProps & ConnectedDraggableItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const isNew = itemKey === latestCreatedKey;
    // filter out intents already used in interaction block
    const filteredIntents = React.useMemo(
      () => intents.filter(({ id }) => id === intent?.id || !items.some((choice) => choice.intent === id)),
      [intent, intents, items]
    );

    return (
      <EditorSection
        ref={ref}
        namespace={['interactionItem', item.id]}
        initialOpen={isNew || isOnlyItem}
        header={intent?.name || 'Path'}
        prefix={<Badge>{index + 1}</Badge>}
        collapseVariant={!isDragging && !isDraggingPreview ? SectionToggleVariant.ARROW : undefined}
        isDragging={isDragging}
        headerToggle
        headerRef={connectedDragRef}
        isDraggingPreview={isDraggingPreview}
        onContextMenu={onContextMenu}
        isContextMenuOpen={isContextMenuOpen}
      >
        {isDragging || isDraggingPreview ? null : (
          <>
            <Section isNested dividers={false} customContentStyling={{ paddingTop: 0 }}>
              <IntentSelectComponent intent={intent} onChange={patchPlatformData} intents={filteredIntents} />
            </Section>
            <IntentForm isNested intent={intent} onChange={patchPlatformData} pushToPath={pushToPath} />
            <LegacyMappingsComponent intent={intent} mappings={item.mappings} onDelete={() => patchPlatformData({ mappings: [] })} isNested />
          </>
        )}
      </EditorSection>
    );
  }
);

const mapStateToProps = {
  intents: IntentV2.allPlatformIntentsSelector,
  intent: IntentV2.getPlatformIntentByIDSelector,
};

const mergeProps = (
  ...[{ intent: getIntentByID }, , { item, platform, onUpdate }]: MergeArguments<typeof mapStateToProps, {}, DraggableItemProps>
) => {
  const platformItem = getDistinctPlatformValue(platform, item);

  return {
    item: platformItem,
    intent: platformItem.intent ? getIntentByID(platformItem.intent) : ({ inputs: [] } as Partial<Intent> & { inputs: string[] }),
    patchPlatformData: (patch: Partial<NodeData.InteractionChoice>) => onUpdate?.(setDistinctPlatformValue(platform, { ...platformItem, ...patch })),
  };
};

type ConnectedDraggableItemProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps, { forwardRef: true })(DraggableItem as any) as React.FC<DraggableItemProps>;

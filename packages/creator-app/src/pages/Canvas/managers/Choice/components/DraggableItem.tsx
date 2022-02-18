import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentHandlers, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import GoToIntentSelect from '@/components/GoToIntentSelect';
import IntentForm, { LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant } from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { DistinctPlatform } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { INTENT_ACTION_OPTIONS } from './constants';
import HelpTooltip from './HelpTooltip';

export type DraggableItemProps = ItemComponentProps<Record<DistinctPlatform, Realtime.NodeData.InteractionChoice>> &
  DragPreviewComponentProps &
  (
    | ItemComponentHandlers<Record<DistinctPlatform, Realtime.NodeData.InteractionChoice>>
    | MappedItemComponentHandlers<Record<DistinctPlatform, Realtime.NodeData.InteractionChoice>>
  ) & {
    choices: Record<DistinctPlatform, Realtime.NodeData.InteractionChoice>[];
    platform: VoiceflowConstants.PlatformType;
    isOnlyItem: boolean;
    pushToPath?: PushToPath;
    latestCreatedKey: string | undefined;
  };

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, DraggableItemProps> = (
  {
    item,
    index,
    choices,
    itemKey,
    platform,
    onUpdate,
    pushToPath,
    isOnlyItem,
    isDragging,
    onContextMenu,
    connectedDragRef,
    latestCreatedKey,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const platformItem = getDistinctPlatformValue(platform, item);
  const intents = useSelector(IntentV2.allPlatformIntentsSelector);
  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: platformItem.intent });

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const patchPlatformData = React.useCallback(
    (patch: Partial<Realtime.NodeData.InteractionChoice>) => onUpdate?.(setDistinctPlatformValue(platform, { ...platformItem, ...patch })),
    [onUpdate, platform, platformItem]
  );

  const onChangeGoToIntent = React.useCallback(
    (data: { intentID: string; diagramID: string | null } | null) =>
      patchPlatformData({ goTo: { ...platformItem.goTo, intentID: data?.intentID ?? null, diagramID: data?.diagramID ?? null } }),
    [patchPlatformData, platformItem]
  );

  // filter out intents already used in interaction block
  const availableIntents = React.useMemo(
    () => intents.filter(({ id }) => id === intent?.id || !choices.some((choice) => getDistinctPlatformValue(platform, choice)?.intent === id)),
    [platform, intent, intents, choices]
  );

  const isNew = itemKey === latestCreatedKey;

  return (
    <EditorSection
      ref={ref}
      header={intent?.name || 'Path'}
      prefix={<Badge>{index + 1}</Badge>}
      namespace={['interactionItem', platformItem.id]}
      headerRef={connectedDragRef}
      isDragging={isDragging}
      initialOpen={isNew || isOnlyItem}
      headerToggle
      onContextMenu={onContextMenu}
      collapseVariant={!isDragging && !isDraggingPreview ? SectionToggleVariant.ARROW : undefined}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      {isDragging || isDraggingPreview ? null : (
        <>
          <Section
            isNested
            dividers={false}
            customContentStyling={{
              paddingTop: 0,
              paddingBottom: topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? '16px' : undefined,
            }}
          >
            <IntentSelect
              intent={intent}
              options={availableIntents}
              onChange={patchPlatformData}
              clearable={!intent}
              renderEmpty={!availableIntents.length ? () => <div /> : null}
            />
          </Section>

          <IntentForm isNested intent={intent} onChange={patchPlatformData} pushToPath={pushToPath}>
            {topicsAndComponents.isEnabled && isTopicsAndComponentsVersion && (
              <>
                <FormControl label="Intent Action" tooltip={<HelpTooltip />}>
                  <RadioGroup checked={platformItem.action} options={INTENT_ACTION_OPTIONS} onChange={(action) => patchPlatformData({ action })} />
                </FormControl>

                {platformItem.action === BaseNode.Interaction.ChoiceAction.GO_TO && (
                  <Section isNested dividers={false} customContentStyling={{ paddingTop: 0 }}>
                    <GoToIntentSelect
                      onChange={onChangeGoToIntent}
                      intentID={platformItem.goTo?.intentID}
                      diagramID={platformItem.goTo?.diagramID}
                      placeholder="Behave as user triggered intent"
                    />
                  </Section>
                )}
              </>
            )}
          </IntentForm>

          <LegacyMappings intent={intent} mappings={platformItem.mappings} onDelete={() => patchPlatformData({ mappings: [] })} isNested />
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef<HTMLElement, DraggableItemProps>(DraggableItem as any);

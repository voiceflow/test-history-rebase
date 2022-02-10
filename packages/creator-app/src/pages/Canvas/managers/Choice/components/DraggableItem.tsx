import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, Link } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentHandlers, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import IntentForm, { LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant } from '@/components/Section';
import * as Documentation from '@/config/documentation';
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

const IntentSelectComponent = IntentSelect as React.FC<any>;

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
    openIntents: Realtime.Intent[];
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
    openIntents,
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
  const goToIntent = useSelector(IntentV2.platformIntentByIDSelector, { id: platformItem.goTo?.intentID });

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const patchPlatformData = React.useCallback(
    (patch: Partial<Realtime.NodeData.InteractionChoice>) => onUpdate?.(setDistinctPlatformValue(platform, { ...platformItem, ...patch })),
    [onUpdate, platform, platformItem]
  );

  const onChangeGoToIntent = React.useCallback(
    ({ intent: intentID }: { intent: string | null }) => patchPlatformData({ goTo: { ...platformItem.goTo, intentID } }),
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
            <IntentSelectComponent
              intent={intent}
              intents={availableIntents}
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
                    <IntentSelectComponent
                      intent={goToIntent}
                      intents={openIntents}
                      onChange={onChangeGoToIntent}
                      creatable={false}
                      clearable={!goToIntent}
                      renderEmpty={({ close, search }: { search: string; close: VoidFunction }) => (
                        <Box flex={1} textAlign="center">
                          {!search ? 'No open intents exists in your project. ' : 'No open intents found. '}
                          <Link href={Documentation.OPEN_INTENT} onClick={close}>
                            Learn more
                          </Link>
                        </Box>
                      )}
                      placeholder="Behave as user triggered intent"
                      withMissingAlert={false}
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

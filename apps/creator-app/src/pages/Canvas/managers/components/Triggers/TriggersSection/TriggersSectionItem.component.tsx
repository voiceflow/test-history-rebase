import { TriggerNodeItem, TriggerNodeItemSettings } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Divider, EditorButton, Popper, Scroll, Section, Surface, Toggle, Tooltip, usePopperModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { IntentConfidenceGauge } from '@/components/Intent/IntentConfidenceGauge/IntentConfidenceGauge.component';
import { IntentEditRequiredEntitiesSection } from '@/components/Intent/IntentEditRequiredEntitiesSection/IntentEditRequiredEntitiesSection.component';
import { IntentSelect } from '@/components/Intent/IntentSelect/IntentSelect.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { TRIGGER_AVAILABILITY_LEARN_MORE } from '@/constants/link.constant';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

interface ITriggersSectionItem {
  trigger: TriggerNodeItem;
  onRemove: (triggerID: string) => void;
  excludeIntentIDs: string[];
  onResourceChange: (triggerID: string, resourceID: string) => void;
  onSettingsChange: (triggerID: string, settings: Partial<TriggerNodeItemSettings>) => void;
}

export const TriggersSectionItem: React.FC<ITriggersSectionItem> = ({ trigger, onRemove, excludeIntentIDs, onResourceChange, onSettingsChange }) => {
  const TEST_ID = 'triggers-section-item';

  const popperModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, 13] } }]);

  const intent = useSelector(Designer.Intent.selectors.oneByID, { id: trigger.resourceID });
  const nonEmptyUtterancesCount = useSelector(Designer.Intent.Utterance.selectors.nonEmptyCountByIntentID, { intentID: trigger.resourceID });

  return (
    <Popper
      testID={tid(TEST_ID, 'popper')}
      placement="left-start"
      modifiers={popperModifiers}
      referenceElement={({ ref, onOpen, isOpen }) => (
        <CMSFormListItem width="100%" testID={TEST_ID} onRemove={() => onRemove(trigger.id)}>
          <EditorButton
            ref={ref}
            label={intent?.name || 'Select trigger'}
            testID={tid(TEST_ID, 'button')}
            onClick={onOpen}
            isActive={isOpen}
            fullWidth
            prefixIconName="Intent"
          />
        </CMSFormListItem>
      )}
    >
      {() => (
        <Surface pt={11} width={300} overflow="hidden">
          <Scroll>
            <Section.Header.Container
              title="Intent"
              variant="active"
              primaryContent={nonEmptyUtterancesCount ? <IntentConfidenceGauge nonEmptyUtterancesCount={nonEmptyUtterancesCount} /> : undefined}
            />

            <Box px={24} pb={20}>
              <IntentSelect
                intentID={trigger.resourceID}
                onSelect={(intent) => onResourceChange(trigger.id, intent.id)}
                excludeIDs={excludeIntentIDs}
              />
            </Box>

            <Divider noPadding />

            {!!intent && (
              <>
                <IntentEditRequiredEntitiesSection intent={intent} />

                <Divider noPadding />
              </>
            )}

            <Tooltip
              width={200}
              placement="left-start"
              referenceElement={({ ref, onOpen, onClose }) => (
                <Section.Header.Container
                  ref={ref}
                  pt={12}
                  pb={10}
                  title="Available from other stories?"
                  variant={trigger.settings.local ? 'basic' : 'active'}
                  onMouseEnter={onOpen}
                  onMouseLeave={onClose}
                  onHeaderClick={() => onSettingsChange(trigger.id, { local: !trigger.settings.local })}
                >
                  <Toggle value={!trigger.settings.local} />
                </Section.Header.Container>
              )}
            >
              {() => (
                <TooltipContentLearn
                  label="Determine whether this intent will be trigger-able from other workflows (global). Or only from within this workflow (local)."
                  onLearnClick={onOpenInternalURLInANewTabFactory(TRIGGER_AVAILABILITY_LEARN_MORE)}
                />
              )}
            </Tooltip>
          </Scroll>
        </Surface>
      )}
    </Popper>
  );
};

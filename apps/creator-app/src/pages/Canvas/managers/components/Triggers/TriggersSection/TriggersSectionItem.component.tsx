import composeRefs from '@seznam/compose-react-refs';
import { TriggerNodeItem, TriggerNodeItemSettings } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import {
  Box,
  ContextMenu,
  Divider,
  EditorButton,
  Menu,
  Popper,
  Scroll,
  Section,
  Surface,
  Toggle,
  Tooltip,
  usePopperModifiers,
} from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { IntentConfidenceGauge } from '@/components/Intent/IntentConfidenceGauge/IntentConfidenceGauge.component';
import { IntentEditRequiredEntitiesSection } from '@/components/Intent/IntentEditRequiredEntitiesSection/IntentEditRequiredEntitiesSection.component';
import { IntentSelect } from '@/components/Intent/IntentSelect/IntentSelect.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { TRIGGERS_LEARN_MORE } from '@/constants/link.constant';
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

export const TriggersSectionItem: React.FC<ITriggersSectionItem> = ({
  trigger,
  onRemove,
  excludeIntentIDs,
  onResourceChange,
  onSettingsChange,
}) => {
  const TEST_ID = 'triggers-section-item';

  const popperModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, 13] } }]);

  const intent = useSelector(Designer.Intent.selectors.oneByID, { id: trigger.resourceID });
  const nonEmptyUtterancesCount = useSelector(Designer.Intent.Utterance.selectors.nonEmptyCountByIntentID, {
    intentID: trigger.resourceID,
  });
  const isEmpty = !!trigger.resourceID && !intent;

  return (
    <Popper
      testID={tid(TEST_ID, 'popper')}
      placement="left-start"
      modifiers={popperModifiers}
      referenceElement={(popper) => (
        <ContextMenu
          referenceElement={(contextMenu) => (
            <CMSFormListItem
              gap={4}
              align="center"
              width="100%"
              testID={TEST_ID}
              onRemove={() => onRemove(trigger.id)}
              onContextMenu={contextMenu.onContextMenu}
            >
              <EditorButton
                ref={composeRefs(popper.ref, contextMenu.ref)}
                label={isEmpty ? 'Empty intent' : intent?.name || 'Select a trigger'}
                testID={tid(TEST_ID, 'button')}
                onClick={popper.onOpen}
                isEmpty={isEmpty}
                isActive={popper.isOpen || contextMenu.isOpen}
                isWarning={isEmpty}
                fullWidth
                prefixIconName="IntentS"
                warningTooltipContent={isEmpty ? 'Intent is missing' : undefined}
              />
            </CMSFormListItem>
          )}
        >
          {() => <Menu.Item label="Remove" prefixIconName="Trash" onClick={() => onRemove(trigger.id)} />}
        </ContextMenu>
      )}
    >
      {() => (
        <Surface pt={11} width={300} overflow="hidden" className="vfui">
          <Scroll>
            <Section.Header.Container
              title="Intent"
              variant="active"
              primaryContent={
                nonEmptyUtterancesCount ? (
                  <IntentConfidenceGauge nonEmptyUtterancesCount={nonEmptyUtterancesCount} />
                ) : undefined
              }
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
              width={207}
              inline
              placement="left-start"
              referenceElement={({ ref, popper, onOpen, onClose }) => (
                <Section.Header.Container
                  ref={ref}
                  pt={12}
                  pb={10}
                  title="Available from workflows?"
                  variant={trigger.settings.local ? 'basic' : 'active'}
                  onMouseEnter={onOpen}
                  onMouseLeave={onClose}
                  contentProps={{ pr: 20 }}
                  onHeaderClick={() => onSettingsChange(trigger.id, { local: !trigger.settings.local })}
                >
                  {popper}
                  <Toggle value={!trigger.settings.local} />
                </Section.Header.Container>
              )}
            >
              {() => (
                <TooltipContentLearn
                  label="Determine whether this intent will be trigger-able from other workflows (global). Or only from within this workflow (local)."
                  onLearnClick={onOpenInternalURLInANewTabFactory(TRIGGERS_LEARN_MORE)}
                />
              )}
            </Tooltip>
          </Scroll>
        </Surface>
      )}
    </Popper>
  );
};

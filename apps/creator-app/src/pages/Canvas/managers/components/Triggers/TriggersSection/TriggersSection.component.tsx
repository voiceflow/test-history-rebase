import { Utils } from '@voiceflow/common';
import { type Intent, type TriggerNodeItem, type TriggerNodeItemSettings, TriggerNodeItemType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Box, Divider, Popper, Section, Tooltip } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { IntentMenu } from '@/components/Intent/IntentMenu/IntentMenu.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { TRIGGERS_LEARN_MORE } from '@/constants/link.constant';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { stopPropagation } from '@/utils/handler.util';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { TriggersSectionItem } from './TriggersSectionItem.component';
import { TriggersSectionStartItem } from './TriggersSectionStartItem.component';

export const TriggersSection: React.FC = () => {
  const TEST_ID = 'triggers-section';

  const editor = useEditor<Realtime.NodeData.Start | Realtime.NodeData.Trigger>();

  const triggers = Realtime.Utils.typeGuards.isStartNodeData(editor.data)
    ? editor.data.triggers ?? []
    : editor.data.items;
  const isStartNode = Realtime.Utils.typeGuards.isStartNodeData(editor.data);

  const triggerIntentIDs = useMemo(
    () =>
      triggers
        .filter((trigger) => trigger.type === TriggerNodeItemType.INTENT && trigger.resourceID !== null)
        .map((trigger) => trigger.resourceID!),
    [triggers]
  );

  const onTriggersChange = (triggers: TriggerNodeItem[]) => {
    if (isStartNode) {
      editor.onChange({ triggers });
    } else {
      editor.onChange({ items: triggers });
    }
  };

  const onTriggerAdd = (intent: Intent) => {
    const trigger: TriggerNodeItem = {
      id: Utils.id.cuid(),
      type: TriggerNodeItemType.INTENT,
      resourceID: intent.id,
      settings: { local: false },
    };

    onTriggersChange([...triggers, trigger]);
  };

  const onTriggerRemove = (triggerID: string) => {
    onTriggersChange(triggers.filter((t) => t.id !== triggerID));
  };

  const onResourceChange = (triggerID: string, resourceID: string) => {
    onTriggersChange(triggers.map((t) => (t.id === triggerID ? { ...t, resourceID } : t)));
  };

  const onSettingsChange = (triggerID: string, settings: Partial<TriggerNodeItemSettings>) => {
    onTriggersChange(
      triggers.map((t) => (t.id === triggerID ? { ...t, settings: { ...t.settings, ...settings } } : t))
    );
  };

  const triggersSize = triggers.length + (isStartNode ? 1 : 0);

  return (
    <>
      <Popper
        placement="bottom-start"
        referenceElement={(popper) => (
          <Tooltip
            width={175}
            inline
            placement="left-start"
            referenceElement={(tooltip) => (
              <Section.Header.Container
                pt={11}
                pb={triggersSize ? 0 : 11}
                ref={tooltip.ref}
                title={
                  triggersSize
                    ? (className) => (
                        <SectionHeaderTitleWithLearnTooltip
                          title="Triggers"
                          width={175}
                          className={className}
                          onLearnClick={onOpenURLInANewTabFactory(TRIGGERS_LEARN_MORE)}
                        >
                          Select the trigger(s) that will initiate this workflow.
                        </SectionHeaderTitleWithLearnTooltip>
                      )
                    : 'Triggers'
                }
                testID={tid(TEST_ID, 'header')}
                variant={triggersSize ? 'active' : 'basic'}
                onMouseEnter={triggersSize ? undefined : tooltip.onOpen}
                onMouseLeave={triggersSize ? undefined : tooltip.onClose}
                onHeaderClick={triggersSize ? undefined : popper.onOpen}
              >
                <Section.Header.Button
                  ref={popper.ref}
                  testID={tid(TEST_ID, 'add')}
                  onClick={stopPropagation(popper.onOpen)}
                  isActive={popper.isOpen}
                  iconName="Plus"
                />
                {tooltip.popper}
              </Section.Header.Container>
            )}
          >
            {() => (
              <TooltipContentLearn
                label="Select the trigger(s) that will initiate this workflow."
                onLearnClick={onOpenURLInANewTabFactory(TRIGGERS_LEARN_MORE)}
              />
            )}
          </Tooltip>
        )}
      >
        {({ onClose }) => (
          <IntentMenu onClose={onClose} onSelect={onTriggerAdd} excludeIDs={triggerIntentIDs} excludeNone={false} />
        )}
      </Popper>

      <Box pl={12} pb={triggersSize ? 11 : 0} direction="column">
        {isStartNode && <TriggersSectionStartItem />}

        {triggers.map((trigger) => (
          <TriggersSectionItem
            key={trigger.id}
            trigger={trigger}
            onRemove={onTriggerRemove}
            excludeIntentIDs={triggerIntentIDs}
            onResourceChange={onResourceChange}
            onSettingsChange={onSettingsChange}
          />
        ))}
      </Box>

      <Divider noPadding />
    </>
  );
};

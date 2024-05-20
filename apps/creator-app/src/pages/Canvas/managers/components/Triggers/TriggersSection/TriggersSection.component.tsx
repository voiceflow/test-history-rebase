import { Utils } from '@voiceflow/common';
import { type Intent, type TriggerNodeItem, type TriggerNodeItemSettings, TriggerNodeItemType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Box, Divider, Popper, Section } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { IntentMenu } from '@/components/Intent/IntentMenu/IntentMenu.component';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { stopPropagation } from '@/utils/handler.util';

import { TriggersSectionItem } from './TriggersSectionItem.component';
import { TriggersSectionStartItem } from './TriggersSectionStartItem.component';

export const TriggersSection: React.FC = () => {
  const TEST_ID = 'triggers-section';

  const editor = useEditor<Realtime.NodeData.Start | Realtime.NodeData.Trigger>();

  const triggers = Realtime.Utils.typeGuards.isStartNodeData(editor.data) ? editor.data.triggers ?? [] : editor.data.items;
  const isStartNode = Realtime.Utils.typeGuards.isStartNodeData(editor.data);

  const triggerIntentIDs = useMemo(
    () =>
      triggers.filter((trigger) => trigger.type === TriggerNodeItemType.INTENT && trigger.resourceID !== null).map((trigger) => trigger.resourceID!),
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
    onTriggersChange(triggers.map((t) => (t.id === triggerID ? { ...t, settings: { ...t.settings, ...settings } } : t)));
  };

  const triggersSize = triggers.length + (isStartNode ? 1 : 0);

  return (
    <>
      <Popper
        placement="bottom-start"
        referenceElement={({ ref, onOpen, isOpen }) => (
          <Section.Header.Container
            pt={11}
            pb={triggersSize ? 0 : 11}
            title="Triggers"
            testID={tid(TEST_ID, 'header')}
            variant={triggersSize ? 'active' : 'basic'}
            onHeaderClick={triggersSize ? undefined : onOpen}
          >
            <Section.Header.Button ref={ref} testID={tid(TEST_ID, 'add')} onClick={stopPropagation(onOpen)} isActive={isOpen} iconName="Plus" />
          </Section.Header.Container>
        )}
      >
        {({ onClose }) => <IntentMenu onClose={onClose} onSelect={onTriggerAdd} excludeIDs={triggerIntentIDs} />}
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

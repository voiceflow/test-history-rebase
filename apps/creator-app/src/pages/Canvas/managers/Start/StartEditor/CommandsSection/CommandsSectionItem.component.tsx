import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Box, Divider, EditorButton, Popper, Scroll, Section, Surface, usePopperModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { FlowSelect } from '@/components/Flow/FlowSelect/FlowSelect.component';
import { IntentConfidenceGauge } from '@/components/Intent/IntentConfidenceGauge/IntentConfidenceGauge.component';
import { IntentSelect } from '@/components/Intent/IntentSelect/IntentSelect.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';

interface ICommandsSectionItem {
  command: Realtime.NodeData.Command;
  commandNodeID: string;
  excludeIntentIDs: string[];
}

export const CommandsSectionItem: React.FC<ICommandsSectionItem> = ({ command, commandNodeID, excludeIntentIDs }) => {
  const TEST_ID = 'commands-section-item';

  const editor = useEditor();
  const popperModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, 13] } }]);

  const flow = useSelector(Designer.Flow.selectors.oneByDiagramID, { diagramID: command.diagramID });
  const intent = useSelector(Designer.Intent.selectors.oneByID, { id: command.intent });
  const nonEmptyUtterancesCount = useSelector(Designer.Intent.Utterance.selectors.nonEmptyCountByIntentID, {
    intentID: command.intent ?? null,
  });

  const onChange = async (data: Partial<Realtime.NodeData.Command>) =>
    editor.engine.node.updateData(commandNodeID, data);

  return (
    <Popper
      testID={tid(TEST_ID, 'popper')}
      placement="left-start"
      modifiers={popperModifiers}
      referenceElement={({ ref, onOpen, isOpen }) => (
        <CMSFormListItem width="100%" testID={TEST_ID} onRemove={() => editor.engine.node.remove(commandNodeID)}>
          <EditorButton
            ref={ref}
            label={intent?.name || 'Select a trigger'}
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
              primaryContent={
                nonEmptyUtterancesCount ? (
                  <IntentConfidenceGauge nonEmptyUtterancesCount={nonEmptyUtterancesCount} />
                ) : undefined
              }
            />

            <Box px={24} pb={20}>
              <IntentSelect
                intentID={command.intent}
                onSelect={(intent) => onChange({ intent: intent.id })}
                excludeIDs={excludeIntentIDs}
              />
            </Box>

            <Divider noPadding />

            <Section.Header.Container title="Component" variant="active" />

            <Box px={24} pb={20}>
              <FlowSelect flowID={flow?.id ?? null} onSelect={(flow) => onChange({ diagramID: flow.diagramID })} />
            </Box>
          </Scroll>
        </Surface>
      )}
    </Popper>
  );
};

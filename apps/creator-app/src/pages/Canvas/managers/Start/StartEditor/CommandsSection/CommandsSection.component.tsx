import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Box, Divider, Section, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { COMMAND_STEP_LEARN_MORE } from '@/constants/link.constant';
import { Creator } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { stopPropagation } from '@/utils/handler.util';
import { popperPaddingModifierFactory } from '@/utils/popper.util';
import { openURLInANewTab } from '@/utils/window';

import { CommandsSectionItem } from './CommandsSectionItem.component';

export const CommandsSection: React.FC = () => {
  const TEST_ID = 'commands-section';

  const editor = useEditor<Realtime.NodeData.Start>();
  const tooltipModifiers = useTooltipModifiers([
    { name: 'offset', options: { offset: [0, 0] } },
    popperPaddingModifierFactory({ padding: 3 }),
  ]);

  const commands = useSelector(Creator.nodeDataByIDsSelector, {
    ids: editor.node.combinedNodes,
  }) as Realtime.NodeData<Realtime.NodeData.Command>[];

  const commandsSize = editor.node.combinedNodes.length;
  const excludeIntentIDs = useMemo(
    () =>
      [
        ...(editor.data.triggers?.map((trigger) => trigger.resourceID) ?? []),
        ...commands.map((command) => command.intent),
      ].filter(Utils.array.isNotNullish),
    [editor.data.triggers, commands]
  );

  const onAddCommand = async () => {
    const commandNodeID = Utils.id.objectID();

    await editor.engine.node.insertStep(editor.nodeID, Realtime.BlockType.COMMAND, commandsSize, {
      nodeID: commandNodeID,
      autoFocus: false,
    });
  };

  return (
    <>
      <Tooltip
        inline
        width={176}
        placement="left-start"
        modifiers={tooltipModifiers}
        referenceElement={({ ref, popper, onOpen, onClose }) => (
          <Section.Header.Container
            pt={11}
            ref={ref}
            pb={commandsSize ? 0 : 11}
            title="Commands"
            testID={tid(TEST_ID, 'header')}
            variant={commandsSize ? 'active' : 'basic'}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            onHeaderClick={commandsSize ? undefined : onAddCommand}
          >
            <Section.Header.Button
              testID={tid(TEST_ID, 'add')}
              onClick={stopPropagation(onAddCommand)}
              iconName="Plus"
            />

            {popper}
          </Section.Header.Container>
        )}
      >
        {() => (
          <>
            <TooltipContentLearn
              label="Commands act as a 'go to and return' function."
              onLearnClick={() => openURLInANewTab(COMMAND_STEP_LEARN_MORE)}
            />
          </>
        )}
      </Tooltip>

      <Box pl={12} pb={commandsSize ? 11 : 0} direction="column">
        {commands.map((command) => (
          <CommandsSectionItem
            key={command.nodeID}
            command={command}
            commandNodeID={command.nodeID}
            excludeIntentIDs={excludeIntentIDs}
          />
        ))}
      </Box>

      <Divider noPadding />
    </>
  );
};

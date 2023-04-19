import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';

import CommandEditor from './CommandEditor';
import CommandInfoTooltip from './CommandInfoTooltip';
import CommandSectionItem from './CommandSectionItem';

const CommandsSection: React.FC = () => {
  const editor = EditorV2.useEditor();
  const intentMap = React.useContext(CustomIntentMapContext)!;

  const commands = useSelector(CreatorV2.stepDataByParentNodeIDSelector, { id: editor.nodeID }) as Realtime.NodeData<Realtime.NodeData.Command>[];

  const onGoToCommand = (commandNodeID: string) => editor.goToNested({ path: CommandEditor.PATH, params: { commandNodeID } });

  const onAddCommand = async () => {
    const commandNodeID = Utils.id.objectID();

    await editor.engine.node.insertStep(editor.nodeID, BlockType.COMMAND, commands.length, { nodeID: commandNodeID, autoFocus: false });

    onGoToCommand(commandNodeID);
  };

  return (
    <SectionV2.ActionListSection
      title={
        <Box.Flex gap={16}>
          <SectionV2.Title bold={!!commands.length}>Commands</SectionV2.Title>
          <CommandInfoTooltip />
        </Box.Flex>
      }
      action={<SectionV2.AddButton onClick={onAddCommand} />}
      contentProps={{ bottomOffset: commands.length ? 2 : 0 }}
    >
      {commands.map(({ nodeID, intent }) => (
        <CommandSectionItem
          key={nodeID}
          intent={intent ? intentMap[intent] : null}
          onClick={() => onGoToCommand(nodeID)}
          onRemove={() => editor.engine.node.remove(nodeID)}
        />
      ))}
    </SectionV2.ActionListSection>
  );
};

export default CommandsSection;

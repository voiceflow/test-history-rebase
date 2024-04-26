import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import ComponentSelect from '@/components/ComponentSelect';
import IntentSelect from '@/components/IntentSelect';
import * as Documentation from '@/config/documentation';
import { Designer } from '@/ducks';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

const PATH = 'command/:commandNodeID';

const CommandEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Command>();
  const { commandNodeID } = useParams<{ commandNodeID: string }>();

  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const commandNodeData = useSelector(CreatorV2.nodeDataByIDSelector, {
    id: commandNodeID,
  }) as Realtime.NodeData.Command | null;
  const intent = useSelector(Designer.Intent.selectors.oneWithFormattedBuiltNameByID, { id: commandNodeData?.intent });

  const onChange = (data: Partial<Realtime.NodeData.Command>) => editor.engine.node.updateData(commandNodeID, data);

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="Start" actions={[]} onBack={() => editor.goBack()} />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.COMPONENT_STEP}>
          <Button
            variant={Button.Variant.PRIMARY}
            onClick={() => commandNodeData?.diagramID && goToDiagramHistoryPush(commandNodeData.diagramID)}
            disabled={!commandNodeData?.diagramID}
            squareRadius
          >
            Enter Component
          </Button>
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleSection>
        <Box.Flex width="100%" gap={16} column>
          <IntentSelect
            icon="intentSmall"
            intent={intent}
            onChange={onChange}
            fullWidth
            clearable
            placeholder="Select trigger intent"
            iconProps={{ color: '#6E849A' }}
            clearOnSelectActive
          />

          <ComponentSelect
            icon="systemSymbolSmall"
            onChange={(diagramID) => onChange({ diagramID })}
            iconProps={{ color: '#6E849A' }}
            diagramID={commandNodeData?.diagramID ?? null}
          />
        </Box.Flex>
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default Object.assign(CommandEditor, {
  PATH,
} as const);

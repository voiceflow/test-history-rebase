import { AlexaConstants } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import SlotSelect, { SlotOption } from '@/components/SlotSelect';
import VariableSelect from '@/components/VariableSelect';
import * as Documentation from '@/config/documentation';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { NoReplyV2 } from '../../components';
import ListItem from './ListItem';

const CaptureEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts>();

  const slotFilter = React.useCallback((slotType: SlotOption) => slotType?.value !== AlexaConstants.SlotType.SEARCHQUERY, []);

  const mapManager = useMapManager(editor.data.examples, (examples) => editor.onChange({ examples }), { factory: () => '' });

  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });

  const hasReplies = !!editor.data.examples.length;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.CAPTURE_STEP}>
          <EditorV2.FooterActionsButton actions={[noReplyConfig.option]} />
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleContentSection header={<SectionV2.Title bold>Input Type</SectionV2.Title>} contentProps={{ topOffset: true }}>
        <SlotSelect value={editor.data.slot} onChange={(slot) => editor.onChange({ slot })} filter={slotFilter} />
      </SectionV2.SimpleContentSection>

      <SectionV2.Divider inset />

      {editor.data.slot === CUSTOM_SLOT_TYPE && (
        <>
          <SectionV2.ActionListSection
            title={<SectionV2.Title bold={hasReplies}>User replies</SectionV2.Title>}
            action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} disabled={mapManager.isMaxReached} />}
            sticky
          >
            {hasReplies &&
              mapManager.map((item, { key, isLast, onUpdate, onRemove }) => (
                <Box key={key} pb={isLast ? 8 : 16}>
                  <ListItem value={item} onChange={onUpdate} onRemove={onRemove} autofocus={key === mapManager.latestCreatedKey} />
                </Box>
              ))}
          </SectionV2.ActionListSection>

          <SectionV2.Divider inset />
        </>
      )}

      <SectionV2.SimpleContentSection header={<SectionV2.Title bold>Capture Input to</SectionV2.Title>} contentProps={{ topOffset: true }}>
        <VariableSelect value={editor.data.variable} onChange={(variable) => editor.onChange({ variable })} />
      </SectionV2.SimpleContentSection>

      {noReplyConfig.section}
    </EditorV2>
  );
};

export default CaptureEditor;

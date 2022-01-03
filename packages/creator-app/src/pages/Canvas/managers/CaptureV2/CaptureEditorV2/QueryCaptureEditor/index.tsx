import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import Section, { SectionToggleVariant } from '@/components/Section';
import VariableSelect from '@/components/VariableSelect';
import { getPlatformNewSlotsCreator } from '@/ducks/intent/utils';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useSelector } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { HelpTooltip } from '../components';

const ENTIRE_USER_REPLY = '_ENTIRE_USER_REPLY_';

const QueryCaptureEditor: NodeEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({
  data,
  onChange,
  platform,
  pushToPath,
}) => {
  const [search, setSearch] = React.useState('');
  const entityCapture = (slotID = '') => {
    onChange({
      captureType: Node.CaptureV2.CaptureType.INTENT,
      intent: { slots: [getPlatformNewSlotsCreator(platform)(slotID)] },
      noMatch: getPlatformNoMatchFactory(platform)(),
    });
  };

  const allSlots = useSelector(SlotV2.allSlotsSelector);

  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);

  const { onAddSlot } = useAddSlot();

  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });

  const onSelectSlot = React.useCallback(
    (slotID?: string | null) => {
      if (!slotID) return;
      entityCapture(slotID);
    },
    [getSlotByID]
  );
  const addSlot = React.useCallback(
    async (value = '') => {
      const slot = await onAddSlot(value);
      onSelectSlot(slot?.id);
    },
    [onAddSlot]
  );

  const getOptionLabel = React.useCallback(
    (slotID?: string | null) => (slotID && getSlotByID(slotID)?.name) || (slotID === ENTIRE_USER_REPLY && 'Entire user reply') || null,
    [getSlotByID]
  );
  const getOptionValue = React.useCallback((slot?: Realtime.Slot | null) => slot?.id, []);

  return (
    <Content
      footer={() => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption]} />}
          options={[
            {
              icon: 'capture',
              label: 'Add Capture',
              disabled: true,
              onClick: () => null,
            },
          ]}
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
          }}
        />
      )}
    >
      <EditorSection
        initialOpen
        header="Capture Entire User Reply"
        prefix={<Badge>1</Badge>}
        collapseVariant={SectionToggleVariant.ARROW}
        headerToggle
        customContentStyling={{ padding: '0px' }}
      >
        <Section customContentStyling={{ paddingTop: 0 }}>
          <Select
            value={ENTIRE_USER_REPLY}
            options={allSlots}
            onSelect={onSelectSlot}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            searchable
            creatable
            onCreate={addSlot}
            onSearch={setSearch}
            footerAction={!search}
            onClickFooterAction={addSlot}
            footerActionLabel="Create New Entity"
          />
          <Box mt={16}>
            <VariableSelect
              prefix={<SvgIcon icon="next" color="#6e849ad9" />}
              value={data.variable}
              onChange={(variable: string) => onChange({ variable })}
              placeholder="Select or create variable"
              createInputPlaceholder="Search options"
            />
          </Box>
        </Section>
      </EditorSection>
      {noReplySection}
    </Content>
  );
};

export default QueryCaptureEditor;

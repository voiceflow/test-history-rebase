import { IntentSlot } from '@voiceflow/base-types/build/common/models/base/intent';
import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, stopPropagation, StrengthGauge, SvgIcon, Tag, TippyTooltip } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import * as Normal from 'normal-store';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { InteractionModelTabType, ModalType, NLPProvider, PlatformToNLPProvider } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as SlotV2 from '@/ducks/slotV2';
import { useModals, useSelector } from '@/hooks';
import { EmptyDash } from '@/pages/NLUManager/components';
import { useIsCheckedItem } from '@/pages/NLUManager/components/Content/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { getIntentStrengthLevel, isBuiltInIntent } from '@/utils/intent';
import { hasValidPrompt } from '@/utils/prompt';

import { TableMeta } from '../../constants';
import { StrengthContainer, StrengthDescriptorContainer } from '../Table/components/TableItem/components';
import TableItem from '../TableItem';
import NameBox from '../TableItem/NameBox';

const IntentItem: React.FC<{ item: Realtime.Intent }> = ({ item }) => {
  const { open: openEntityEditModal } = useModals(ModalType.ENTITY_EDIT);
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });

  const allSlotsMap = useSelector(SlotV2.slotMapSelector);
  const { toggleCheckedItem, exportItem } = React.useContext(NLUManagerContext);
  const { isChecked } = useIsCheckedItem(item.id);

  const isBuiltIn = isBuiltInIntent(item.id);
  const IntentTableColumnMeta = TableMeta[InteractionModelTabType.INTENTS].columns;
  const intentStrength = isBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(item.inputs.length);

  const hasEntityError = React.useMemo(() => {
    return Normal.denormalize<IntentSlot>(item.slots).some((intentSlot) => {
      const { prompt } = intentSlot.dialog ?? { prompt: [] };
      if (!intentSlot?.required) {
        return false;
      }
      return !hasValidPrompt(prompt as Realtime.NodeData.VoicePrompt[] | ChatModels.Prompt[] | VoiceModels.IntentPrompt<any>[]);
    });
  }, [item]);

  const requiredSlots = React.useMemo(() => Normal.denormalize<IntentSlot>(item.slots).filter(({ required }) => required), [item.slots]);

  const contextOptions = [
    {
      label: 'Export CSV',
      value: 'exportCSV',
      onClick: () => exportItem(item.id, InteractionModelTabType.INTENTS, NLPProvider.VF_CSV),
    },
    {
      label: 'Export JSON',
      value: 'exportJSON',
      onClick: () => {
        const nlpProvider = (project?.platform && PlatformToNLPProvider[project.platform]) || null;
        exportItem(item.id, InteractionModelTabType.INTENTS, nlpProvider);
      },
    },
    { label: 'Divider', divider: true },
  ];

  return (
    <TableItem isBuiltIn={isBuiltIn} itemType={InteractionModelTabType.INTENTS} item={item} additionalContextOptions={contextOptions}>
      <Box minWidth={40}>
        {hasEntityError ? (
          <TippyTooltip title="Required entity error">
            <Box pt={4} pl={1}>
              <SvgIcon icon="warning" color="#BF395B" size={16} />
            </Box>
          </TippyTooltip>
        ) : (
          <Checkbox checked={isChecked} onChange={() => toggleCheckedItem(item.id)} />
        )}
      </Box>
      <NameBox flex={IntentTableColumnMeta[0].flexWidth} name={item.name} />
      <StrengthContainer flex={IntentTableColumnMeta[1].flexWidth}>
        <Box display="inline-block" mt={-6}>
          <StrengthGauge tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }} width={40} level={intentStrength} />
        </Box>
        <StrengthDescriptorContainer>
          {intentStrength === StrengthGauge.Level.NOT_SET ? 'No utterances' : StrengthGauge.TOOLTIP_LABEL_MAP[intentStrength]}
        </StrengthDescriptorContainer>
      </StrengthContainer>
      <Box flex={IntentTableColumnMeta[2].flexWidth}>
        <Box width={80} textAlign="right">
          {item.inputs.length}
        </Box>
      </Box>
      <Box flex={IntentTableColumnMeta[3].flexWidth}>
        {requiredSlots.length ? (
          <>
            {requiredSlots.map((slot) => {
              const slotData = allSlotsMap[slot.id];
              return slotData ? (
                <>
                  <Tag key={slotData.id} color={slotData.color} onClick={stopPropagation(() => openEntityEditModal({ id: slotData.id }))}>
                    {`{${slotData.name}}`}
                  </Tag>{' '}
                </>
              ) : null;
            })}
          </>
        ) : (
          <BoxFlex alignItems="center" height="100%">
            <EmptyDash />
          </BoxFlex>
        )}
      </Box>
    </TableItem>
  );
};

export default IntentItem;

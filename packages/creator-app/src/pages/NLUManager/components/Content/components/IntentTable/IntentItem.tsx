import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, StrengthGauge, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import * as Normal from 'normal-store';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { InteractionModelTabType, NLPProvider, PlatformToNLPProvider } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useIsCheckedItem } from '@/pages/NLUManager/components/Content/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { getIntentStrengthLevel, isBuiltInIntent } from '@/utils/intent';
import { hasValidPrompt } from '@/utils/prompt';

import { TableMeta } from '../../constants';
import TableItem from '../TableItem';
import NameBox from '../TableItem/NameBox';
import { Clarity, Confidence, Entities, UtteranceCount } from './components';

const IntentItem: React.FC<{ item: Realtime.Intent }> = ({ item }) => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });

  const { toggleCheckedItem, exportItem } = React.useContext(NLUManagerContext);
  const { isChecked } = useIsCheckedItem(item.id);

  const isBuiltIn = isBuiltInIntent(item.id);
  const IntentTableColumnMeta = TableMeta[InteractionModelTabType.INTENTS].columns;
  const intentStrength = isBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(item.inputs.length);

  const hasEntityError = React.useMemo(() => {
    return Normal.denormalize<Realtime.IntentSlot>(item.slots).some((intentSlot) => {
      const { prompt } = intentSlot.dialog ?? { prompt: [] };
      if (!intentSlot?.required) {
        return false;
      }
      return !hasValidPrompt(prompt as Realtime.NodeData.VoicePrompt[] | ChatModels.Prompt[] | VoiceModels.IntentPrompt<any>[]);
    });
  }, [item]);

  const requiredSlots = React.useMemo(() => Normal.denormalize<Realtime.IntentSlot>(item.slots).filter(({ required }) => required), [item.slots]);

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
      <Confidence flex={IntentTableColumnMeta[1].flexWidth} intentStrength={intentStrength} />
      <Clarity flex={IntentTableColumnMeta[2].flexWidth} clarityStrength={intentStrength} />
      <UtteranceCount flex={IntentTableColumnMeta[3].flexWidth} count={item.inputs.length} />
      <Entities flex={IntentTableColumnMeta[4].flexWidth} requiredSlots={requiredSlots} />
    </TableItem>
  );
};

export default IntentItem;

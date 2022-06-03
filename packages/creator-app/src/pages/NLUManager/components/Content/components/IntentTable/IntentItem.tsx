import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, StrengthGauge, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import * as Normal from 'normal-store';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { InteractionModelTabType } from '@/constants';
import { useIsCheckedItem } from '@/pages/NLUManager/components/Content/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { getIntentStrengthLevel, isBuiltInIntent } from '@/utils/intent';
import { hasValidPrompt } from '@/utils/prompt';

import { TableMeta } from '../../constants';
import TableItem from '../TableItem';
import NameBox from '../TableItem/NameBox';
import { Clarity, Confidence, Entities, UtteranceCount } from './components';

const IntentItem: React.FC<{ item: Realtime.Intent }> = ({ item }) => {
  const { toggleCheckedItem } = React.useContext(NLUManagerContext);
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

  return (
    <TableItem isBuiltIn={isBuiltIn} itemType={InteractionModelTabType.INTENTS} item={item}>
      <Box minWidth={28}>
        {hasEntityError ? (
          <TippyTooltip title="Required entity error">
            <Box ml={-1} pt={4} pl={1} mr={1}>
              <SvgIcon icon="warning" color="#BF395B" size={17} />
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

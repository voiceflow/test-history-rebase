import * as Realtime from '@voiceflow/realtime-sdk';
import { StrengthGauge, SvgIcon, Table, TableTypes } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';
import { hasValidPrompt } from '@/utils/prompt';

import { SelectColumn } from '../../../components';

const IntentSelectColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = (props) => {
  const row = Table.useRowContext<NLUIntent>();
  const nluManager = React.useContext(NLUManagerContext);
  const isSelected = row.hovered || nluManager.selectedItemIDs.has(props.item.id);

  const hasEntityError = React.useMemo(
    () =>
      Normal.denormalize<Realtime.IntentSlot>(props.item.slots).some(
        (intentSlot) => !!intentSlot?.required && !hasValidPrompt(intentSlot.dialog.prompt)
      ),
    [props.item]
  );

  const isWeak = hasEntityError || props.item.clarityLevel === StrengthGauge.Level.WEAK || props.item.confidenceLevel === StrengthGauge.Level.WEAK;

  return isWeak && !isSelected ? <SvgIcon icon="warning" color="#BF395B" size={16} /> : <SelectColumn {...props} />;
};

export default IntentSelectColumn;

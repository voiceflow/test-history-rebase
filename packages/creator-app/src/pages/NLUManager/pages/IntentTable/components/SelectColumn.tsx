import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIcon, Table, TableTypes } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';
import { hasValidPrompt } from '@/utils/prompt';

import { SelectColumn } from '../../../components';

const IntentSelectColumn: React.FC<TableTypes.ItemProps<Realtime.Intent>> = (props) => {
  const row = Table.useRowContext<Realtime.Intent>();
  const nluManager = React.useContext(NLUManagerContext);

  const hasEntityError = React.useMemo(
    () =>
      Normal.denormalize<Realtime.IntentSlot>(props.item.slots).some(
        (intentSlot) => !!intentSlot?.required && !hasValidPrompt(intentSlot.dialog.prompt)
      ),
    [props.item]
  );

  return hasEntityError && !row.hovered && !nluManager.selectedItemIDs.has(props.item.id) ? (
    <SvgIcon icon="warning" color="#BF395B" size={16} />
  ) : (
    <SelectColumn {...props} />
  );
};

export default IntentSelectColumn;

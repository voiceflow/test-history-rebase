import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIcon, TableTypes, TippyTooltip } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { hasValidPrompt } from '@/utils/prompt';

import { SelectColumn } from '../../../components';

const IntentSelectColumn: React.FC<TableTypes.ItemProps<Realtime.Intent>> = (props) => {
  const hasEntityError = React.useMemo(
    () =>
      Normal.denormalize<Realtime.IntentSlot>(props.item.slots).some(
        (intentSlot) => !!intentSlot?.required && !hasValidPrompt(intentSlot.dialog.prompt)
      ),
    [props.item]
  );

  return hasEntityError ? (
    <TippyTooltip title="Required entity error">
      <SvgIcon icon="warning" color="#BF395B" size={17} />
    </TippyTooltip>
  ) : (
    <SelectColumn {...props} />
  );
};

export default IntentSelectColumn;

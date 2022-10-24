import { Checkbox, stopPropagation, TableTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';

import WarningIcon from './WarningIcon';

const SelectColumn = <I extends NLUIntent>({ item: intent }: TableTypes.ItemProps<I>): React.ReactElement => {
  const nluManager = React.useContext(NLUManagerContext);

  if (intent.hasEntityError) {
    return (
      <TippyTooltip title="Required entity error">
        <WarningIcon />
      </TippyTooltip>
    );
  }

  if (intent.hasErrors) return <WarningIcon />;

  return (
    <Checkbox
      checked={nluManager.selectedIntentIDs.has(intent.id)}
      padding={false}
      onClick={stopPropagation()}
      onChange={() => nluManager.toggleSelectedIntentID(intent.id)}
    />
  );
};

export default SelectColumn;

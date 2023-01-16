import { Checkbox, stopPropagation, Table, TableTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';

import WarningIcon from './WarningIcon';

const SelectColumn = <I extends NLUIntent>({ item: intent }: TableTypes.ItemProps<I>): React.ReactElement => {
  const nluManager = React.useContext(NLUManagerContext);
  const rowContext = Table.useRowContext();

  const isSelected = nluManager.selectedIntentIDs.has(intent.id);
  const isActive = nluManager.activeItemID === intent.id || isSelected;
  const isHovered = rowContext.hovered;

  if (intent.hasEntityError && !isActive && !isHovered) {
    return (
      <TippyTooltip content="Required entity error">
        <WarningIcon />
      </TippyTooltip>
    );
  }

  if (intent.hasErrors && !isActive && !isHovered) return <WarningIcon />;

  return <Checkbox checked={isSelected} padding={false} onClick={stopPropagation()} onChange={() => nluManager.toggleSelectedIntentID(intent.id)} />;
};

export default SelectColumn;

import { Checkbox, stopPropagation, TableTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';

import WarningIcon from './WarningIcon';

const SelectColumn = <I extends NLUIntent>({ item: intent }: TableTypes.ItemProps<I>): React.ReactElement => {
  const nluManager = React.useContext(NLUManagerContext);

  const [showCheckbox, setShowCheckbox] = React.useState(!intent.hasErrors);

  React.useEffect(() => {
    if (intent.hasErrors && !nluManager.selectedIntentIDs.has(intent.id)) {
      setShowCheckbox(false);
    }
  }, [nluManager.selectedIntentIDs]);

  React.useEffect(() => {
    if (nluManager.hovered === intent.id) {
      setShowCheckbox(true);
    } else if (intent.hasErrors && !nluManager.selectedIntentIDs.has(intent.id)) {
      setShowCheckbox(false);
    }
  }, [nluManager.hovered]);

  if (!showCheckbox && intent.hasEntityError) {
    return (
      <TippyTooltip content="Required entity error">
        <WarningIcon />
      </TippyTooltip>
    );
  }

  return (
    <>
      {showCheckbox ? (
        <Checkbox
          checked={nluManager.selectedIntentIDs.has(intent.id)}
          padding={false}
          onClick={stopPropagation()}
          onChange={() => nluManager.toggleSelectedIntentID(intent.id)}
        />
      ) : (
        <WarningIcon />
      )}
    </>
  );
};

export default SelectColumn;

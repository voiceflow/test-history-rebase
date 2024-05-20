import { Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { FlowMenu } from '../FlowMenu/FlowMenu.component';
import type { IFlowSelect } from './FlowSelect.interface';

export const FlowSelect: React.FC<IFlowSelect> = ({ flowID, onSelect, excludeIDs }) => {
  const flowName = useSelector(Designer.Flow.selectors.nameByID, { id: flowID });

  return (
    <Dropdown value={flowName} testID="flow-select" placeholder="Select component">
      {({ onClose, referenceRef }) => (
        <FlowMenu
          width={referenceRef.current?.clientWidth ?? 252}
          onClose={onClose}
          onSelect={onSelect}
          excludeIDs={excludeIDs}
        />
      )}
    </Dropdown>
  );
};

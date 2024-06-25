import { Link, Text } from '@voiceflow/ui';
import React from 'react';

import * as VariableState from '@/ducks/variableState';
import { useSelector } from '@/hooks';

import VariableStateSelectMenu from './VariableStateSelectMenu';

const SelectedVariableStateText: React.FC = () => {
  const selectedVariableStateName = useSelector(VariableState.getSelectedVariableStateNameSelector);

  if (!selectedVariableStateName) return null;

  return (
    <VariableStateSelectMenu
      render={({ ref, toggleSelectMenuOpen }) => (
        <Text fontSize={13} color="#62778c" lineHeight={1.54} textAlign="center">
          Running test in{' '}
          <Link
            onClick={toggleSelectMenuOpen}
            style={{ borderBottom: '1px dotted #5d9df5' }}
            ref={ref as React.RefObject<HTMLAnchorElement>}
          >
            {selectedVariableStateName}
          </Link>{' '}
          state
        </Text>
      )}
    />
  );
};

export default SelectedVariableStateText;

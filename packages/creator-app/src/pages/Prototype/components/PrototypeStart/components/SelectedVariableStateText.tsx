import { Link, Text } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as VariableState from '@/ducks/variableState';
import { useFeature, useSelector } from '@/hooks';

import VariableStateSelectMenu from './VariableStateSelectMenu';

const SelectedVariableStateText: React.FC = () => {
  const selectedVariableStateName = useSelector(VariableState.getSelectedVariableStateNameSelector);
  const { isEnabled: isVariableStateEnabled } = useFeature(FeatureFlag.VARIABLE_STATES);

  if (!isVariableStateEnabled || !selectedVariableStateName) return null;

  return (
    <VariableStateSelectMenu
      render={({ ref, toggleSelectMenuOpen }) => (
        <Text fontSize={13} color="#62778c" lineHeight={1.54}>
          Running test in{' '}
          <Link onClick={toggleSelectMenuOpen} style={{ borderBottom: '1px dotted #5d9df5' }} ref={ref as any}>
            {selectedVariableStateName}
          </Link>{' '}
          state
        </Text>
      )}
    />
  );
};

export default SelectedVariableStateText;

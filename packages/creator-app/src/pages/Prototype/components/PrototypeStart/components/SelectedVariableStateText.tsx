import { Link, Text } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import * as VariableState from '@/ducks/variableState';
import { useFeature, useModals, useSelector } from '@/hooks';

const SelectedVariableStateText: React.FC = () => {
  const selectedVariableStateName = useSelector(VariableState.getSelectedVariableStateName);
  const variableStateID = useSelector(VariableState.selectedVariableStateId);
  const { isEnabled: isVariableStateEnabled } = useFeature(FeatureFlag.VARIABLE_STATES);
  const { open: openEditorModal } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);

  const openManageSelectedState = () => {
    openEditorModal({ variableStateID });
  };

  if (!isVariableStateEnabled || !selectedVariableStateName) return null;

  return (
    <Text fontSize={13} color="#62778c" fontWeight={500} mt={12} lineHeight={1.54}>
      Running test in{' '}
      <Link onClick={openManageSelectedState} style={{ borderBottom: '1px dashed #62778c' }}>
        {selectedVariableStateName}
      </Link>{' '}
      state
    </Text>
  );
};

export default SelectedVariableStateText;

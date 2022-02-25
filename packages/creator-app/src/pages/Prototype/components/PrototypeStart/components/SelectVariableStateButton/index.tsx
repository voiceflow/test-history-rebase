import { ButtonVariant, FlexCenter, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as VariableState from '@/ducks/variableState';
import { useDispatch, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import VariableStateSelectMenu from '../VariableStateSelectMenu';
import { IconedButton, RunTestButton } from './components';

interface SelectVariableStateButtonProps {
  onStart: () => void;
}

const SelectVariableStateButton: React.FC<SelectVariableStateButtonProps> = ({ onStart }) => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const selectedVariableStateId = useSelector(VariableState.selectedVariableStateIdSelector);
  const updateSelectedVariableStateById = useDispatch(VariableState.updateSelectedVariableStateById);

  return (
    <VariableStateSelectMenu
      render={({ ref, isOpen, toggleSelectMenuOpen }) => (
        <FlexCenter fullWidth style={{ marginBottom: '12px' }}>
          <RunTestButton withIconButton={variableStates.length > 0} variant={ButtonVariant.PRIMARY} onClick={onStart} id={Identifier.PROTOTYPE_START}>
            Run Test
          </RunTestButton>
          {variableStates.length > 0 && (
            <TippyTooltip title={selectedVariableStateId ? 'Reset state' : 'Select variable state'}>
              <IconedButton
                ref={ref as any}
                variant={ButtonVariant.PRIMARY}
                onClick={() => {
                  if (selectedVariableStateId) {
                    updateSelectedVariableStateById(null);
                    return;
                  }

                  toggleSelectMenuOpen();
                }}
                icon={selectedVariableStateId ? 'refreshData' : 'caretDown'}
                iconProps={{ size: selectedVariableStateId ? 16 : 10, color: '#fff' }}
                isOpen={isOpen}
              />
            </TippyTooltip>
          )}
        </FlexCenter>
      )}
    />
  );
};

export default SelectVariableStateButton;

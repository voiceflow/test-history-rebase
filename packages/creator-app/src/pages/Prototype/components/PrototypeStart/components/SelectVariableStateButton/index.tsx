import { ButtonVariant, FlexCenter, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { VariableStateAppliedType } from '@/ducks/tracking';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { Identifier } from '@/styles/constants';

import VariableStateSelectMenu from '../VariableStateSelectMenu';
import { IconedButton, RunTestButton } from './components';

interface SelectVariableStateButtonProps {
  onStart: () => void;
}

const SelectVariableStateButton: React.FC<SelectVariableStateButtonProps> = ({ onStart }) => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const isVariableStateSelected = useSelector(VariableState.isVariableStateSelected);
  const updateSelectedVariableStateById = useDispatch(VariableState.updateSelectedVariableStateById);
  const [trackingEvents] = useTrackingEvents();

  const onStartTest = () => {
    onStart();
    if (isVariableStateSelected) {
      trackingEvents.trackVariableStateApplied({ type: VariableStateAppliedType.LOCAL });
    }
  };

  return (
    <VariableStateSelectMenu
      render={({ ref, isOpen, toggleSelectMenuOpen }) => (
        <FlexCenter fullWidth style={{ marginBottom: '8px' }}>
          <RunTestButton
            withIconButton={variableStates.length > 0}
            squareRadius
            variant={ButtonVariant.PRIMARY}
            onClick={onStartTest}
            id={Identifier.PROTOTYPE_START}
          >
            Run Test
          </RunTestButton>

          {variableStates.length > 0 && (
            <TippyTooltip title={isVariableStateSelected ? 'Reset state' : 'Select variable state'}>
              <IconedButton
                ref={ref as React.RefObject<HTMLButtonElement>}
                variant={ButtonVariant.PRIMARY}
                onClick={() => {
                  if (isVariableStateSelected) {
                    updateSelectedVariableStateById(null);
                    return;
                  }

                  toggleSelectMenuOpen();
                }}
                icon={isVariableStateSelected ? 'refreshData' : 'caretDown'}
                iconProps={isVariableStateSelected ? { size: 16, color: '#fff', marginTop: '1px', marginLeft: '1px' } : { size: 10, color: '#fff' }}
                isOpen={isOpen}
                squareRadius
              />
            </TippyTooltip>
          )}
        </FlexCenter>
      )}
    />
  );
};

export default SelectVariableStateButton;

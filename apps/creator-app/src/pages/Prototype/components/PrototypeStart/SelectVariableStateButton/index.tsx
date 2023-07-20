import { ButtonVariant, FlexCenter, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { VariableStateAppliedType } from '@/ducks/tracking';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { Identifier } from '@/styles/constants';

import VariableStateSelectMenu from '../VariableStateSelectMenu';
import * as S from './styles';

interface SelectVariableStateButtonProps {
  onStart: () => void;
}

const SelectVariableStateButton: React.FC<SelectVariableStateButtonProps> = ({ onStart }) => {
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
          <S.RunTestButton withIconButton variant={ButtonVariant.PRIMARY} onClick={onStartTest} id={Identifier.PROTOTYPE_START}>
            Run Test
          </S.RunTestButton>

          <TippyTooltip content={isVariableStateSelected ? 'Reset state' : 'Select variable state'}>
            <S.IconedButton
              ref={ref as React.RefObject<HTMLButtonElement>}
              icon={isVariableStateSelected ? 'removeData' : 'caretDown'}
              isOpen={isOpen}
              variant={ButtonVariant.PRIMARY}
              onClick={() => (isVariableStateSelected ? updateSelectedVariableStateById(null) : toggleSelectMenuOpen())}
              iconProps={isVariableStateSelected ? { size: 16, color: '#fff', marginTop: '1px', marginLeft: '1px' } : { size: 10, color: '#fff' }}
            />
          </TippyTooltip>
        </FlexCenter>
      )}
    />
  );
};

export default SelectVariableStateButton;

import { Select } from '@voiceflow/ui';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useSelector } from '@/hooks';

const VariableStateSelect: React.FC = () => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const options = React.useMemo(() => variableStates?.map((variableState) => variableState.name), [variableStates]);
  const updateSharePrototypeSettings = useDispatch(Prototype.updateSharePrototypeSettings);
  const prototypeSettings = useSelector(Prototype.prototypeSettingsSelector);
  const { variableStateID } = prototypeSettings;
  const variableStateName = variableStates.find((variableState) => variableState.id === variableStateID)?.name;

  const onSelect = (selectedVariableStateName: string) => {
    const variableState = variableStates.find((variableState) => variableState.name === selectedVariableStateName);
    if (!variableState?.id) return;

    updateSharePrototypeSettings({ variableStateID: variableStateID === variableState.id ? '' : variableState.id });
  };

  return <Select placeholder="Select variable state" value={variableStateName} options={options} onSelect={onSelect} />;
};

export default VariableStateSelect;

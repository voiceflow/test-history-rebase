import React from 'react';

import { useKeygen } from '@/components/KeyedComponent';
import ActionStep from '@/containers/Designer/components/ActionStep';
import Block from '@/containers/Designer/components/Block';
import { StepType } from '@/containers/Designer/constants';
import { StepManagerProvider, StepProvider } from '@/containers/Designer/contexts';
import STEP_COMPONENTS from '@/containers/Designer/steps';
import UserUtteranceStep from '@/containers/Designer/steps/UserUtterance';

import BlockDivider from './BlockDivider';

const BlockRenderer = () => {
  // eslint-disable-next-line no-unused-vars
  const [userUtterance, setUserUtterance] = React.useState({
    value: 'Lorem ipsum dolor sit',
  });
  const [steps, setSteps] = React.useState([
    { type: StepType.SYSTEM_UTTERANCE, value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
    { type: StepType.SET },
  ]);
  const keygen = useKeygen();

  return (
    <StepManagerProvider steps={steps} onChange={setSteps}>
      <Block title="Default Block">
        {userUtterance && <UserUtteranceStep {...userUtterance} />}
        <BlockDivider index={0} />
        {steps.map((step, index) => {
          const StepComponent = STEP_COMPONENTS[step.type];

          return (
            <StepProvider value={{ index, value: step.value }} key={keygen(step)}>
              <StepComponent {...step} />
              <BlockDivider index={index + 1} />
            </StepProvider>
          );
        })}
        <ActionStep />
        <ActionStep type="prompt" />
      </Block>
    </StepManagerProvider>
  );
};

export default BlockRenderer;

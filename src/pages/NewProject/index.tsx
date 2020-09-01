import React from 'react';

import InnerContainer from '@/components/CreationSteps/components/Containers/InnerContainer';
import OuterContainer from '@/components/CreationSteps/components/Containers/OuterContainer';
import CreationHeader from '@/components/CreationSteps/components/Header';
import { FlexCenter } from '@/components/Flex';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

import { Platform } from './Steps/constants';
import { StepID, StepMeta } from './constants';

const NUMBER_OF_STEPS = 3;

const NewProject: React.FC<ConnectedNewProjectProps> = ({ goToDashboard }) => {
  // Once this starts getting more complex, we should move all this logic to a context, but right now that's overkill
  const [stepStack, setStepStack] = React.useState<StepID[]>([StepID.NAME_AND_IMAGE]);
  const currentStep = stepStack[0];
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('');
  const [invocationName, setInvocationName] = React.useState('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<Platform>();
  const [selectedLocales, setSelectedLocales] = React.useState([LOCALE_MAP[0].value]);
  const CurrentStep: React.FC<any> = StepMeta[currentStep].component;

  const finalizeCreation = noop;
  const stepBack = () => {
    const [, ...remainingStack] = stepStack;
    setStepStack([...remainingStack]);
  };

  const onContinue = () => {
    if (stepStack.length === NUMBER_OF_STEPS || (selectedPlatform === Platform.GENERAL && currentStep === StepID.PLATFORM_SELECT)) {
      finalizeCreation();
    } else {
      if (currentStep === StepID.NAME_AND_IMAGE) {
        setStepStack([StepID.PLATFORM_SELECT, ...stepStack]);
      } else if (currentStep === StepID.PLATFORM_SELECT) {
        setStepStack([StepID.PROJECT_SETTINGS, ...stepStack]);
      }
    }
  };

  useDidUpdateEffect(() => {
    if (selectedPlatform) {
      onContinue();
    }
  }, [selectedPlatform]);

  useDidUpdateEffect(() => {
    setInvocationName(name);
  }, [name]);

  return (
    <OuterContainer>
      <InnerContainer>
        <CreationHeader
          title={StepMeta[currentStep].title(selectedPlatform)}
          numberOfSteps={NUMBER_OF_STEPS}
          stepStack={stepStack}
          hasBackButton={stepStack.length > 1}
          stepBack={stepBack}
          canCancel
          onCancel={goToDashboard}
          hasSkipButton={false}
          onSkipClick={noop}
        />

        <FlexCenter>
          <CurrentStep
            invocationName={invocationName}
            setInvocationName={setInvocationName}
            selectedLocales={selectedLocales}
            setSelectedLocales={setSelectedLocales}
            name={name}
            setImage={setImage}
            setName={setName}
            image={image}
            onContinue={onContinue}
            setSelectedPlatform={setSelectedPlatform}
            selectedPlatform={selectedPlatform}
          />
        </FlexCenter>
      </InnerContainer>
    </OuterContainer>
  );
};

const mapDispatchToPrpos = {
  goToDashboard: Router.goToDashboard,
};

type ConnectedNewProjectProps = ConnectedProps<{}, typeof mapDispatchToPrpos>;

export default connect(null, mapDispatchToPrpos)(NewProject);

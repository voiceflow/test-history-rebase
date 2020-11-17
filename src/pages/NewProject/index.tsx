import { constants } from '@voiceflow/common';
import React from 'react';

import client from '@/client';
import InnerContainer from '@/components/CreationSteps/components/Containers/InnerContainer';
import OuterContainer from '@/components/CreationSteps/components/Containers/OuterContainer';
import CreationHeader from '@/components/CreationSteps/components/Header';
import { FlexCenter } from '@/components/Flex';
import { PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

import { StepID, StepMeta } from './constants';

const { GOOGLE_LOCALES } = constants.locales;

const NUMBER_OF_STEPS = 3;

const NewProject: React.FC<ConnectedNewProjectProps & { computedMatch: { params?: { listID: string } } }> = ({
  computedMatch,
  goToDashboard,
  goToCanvas,
  createProject,
}) => {
  // Once this starts getting more complex, we should move all this logic to a context, but right now that's overkill
  const [stepStack, setStepStack] = React.useState<StepID[]>([StepID.NAME_AND_IMAGE]);
  const currentStep = stepStack[0];
  const [name, setName] = React.useState('');
  const [smallIcon, setSmallIcon] = React.useState('');
  const [largeIcon, setLargeIcon] = React.useState('');
  const [invocationName, setInvocationName] = React.useState('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<PlatformType>();
  const [selectedLocales, setSelectedLocales] = React.useState([LOCALE_MAP[0].value]);
  // For Google only
  const [mainLanguage, setMainLanguage] = React.useState(GOOGLE_LOCALES.EN);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const CurrentStep: React.FC<any> = StepMeta[currentStep].component;

  const finalizeCreation = async () => {
    setCreatingProject(true);
    const listID = computedMatch?.params?.listID;

    try {
      const project = await createProject({ platform: selectedPlatform!, name, largeIcon, listID });
      // TODO: in the future make new project parameters much more platform specific
      if (selectedPlatform === PlatformType.ALEXA) {
        client.platform.alexa.version.updatePublishing(project.versionID, {
          invocationName,
          invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
          locales: selectedLocales as any,
          largeIcon,
          smallIcon,
        });
      } else if (selectedPlatform === PlatformType.GOOGLE) {
        client.platform.google.version.updatePublishing(project.versionID, {
          locales: selectedLocales as any,
          smallLogoImage: smallIcon,
          displayName: name,
          pronunciation: invocationName,
          sampleInvocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
        });
      }
      goToCanvas(project.versionID);
    } finally {
      setCreatingProject(false);
    }
  };

  const stepBack = () => {
    const [, ...remainingStack] = stepStack;
    setStepStack([...remainingStack]);
  };

  const onContinue = () => {
    if (stepStack.length === NUMBER_OF_STEPS || selectedPlatform === PlatformType.GENERAL) {
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
            mainLanguage={mainLanguage}
            setMainLanguage={setMainLanguage}
            creatingProject={creatingProject}
            invocationName={invocationName}
            setInvocationName={setInvocationName}
            selectedLocales={selectedLocales}
            setSelectedLocales={setSelectedLocales}
            name={name}
            setName={setName}
            smallIcon={smallIcon}
            largeIcon={largeIcon}
            setSmallIcon={setSmallIcon}
            setLargeIcon={setLargeIcon}
            finalizeCreation={finalizeCreation}
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
  goToCanvas: Router.goToCanvas,
  createProject: Project.createProject,
};

type ConnectedNewProjectProps = ConnectedProps<{}, typeof mapDispatchToPrpos>;

export default connect(null, mapDispatchToPrpos)(NewProject);

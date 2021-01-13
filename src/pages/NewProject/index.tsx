import { Locale as AlexaLocale } from '@voiceflow/alexa-types';
import { Locale as GeneralLocale } from '@voiceflow/general-types';
import { Language as GoogleLanguage, LanguageToLocale } from '@voiceflow/google-types';
import React from 'react';

import client from '@/client';
import { CreationHeader, InnerContainer, OuterContainer } from '@/components/CreationSteps';
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
  const [alexaLocales, setAlexaLocales] = React.useState<[AlexaLocale, ...AlexaLocale[]]>([LOCALE_MAP[0].value]);
  const [googleLanguage, setGoogleLanguage] = React.useState<GoogleLanguage>(GoogleLanguage.EN);
  const [generalLocale, setGeneralLocale] = React.useState<GeneralLocale>(GeneralLocale.EN_US);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const CurrentStep = StepMeta[currentStep].component;

  const finalizeCreation = async () => {
    setCreatingProject(true);
    const listID = computedMatch?.params?.listID;

    try {
      const project = await createProject({ platform: selectedPlatform!, name, largeIcon, listID });

      // TODO: in the future make new project parameters much more platform specific
      if (selectedPlatform === PlatformType.ALEXA) {
        await client.platform.alexa.version.updatePublishing(project.versionID, {
          invocationName,
          invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
          locales: alexaLocales,
          largeIcon,
          smallIcon,
        });
      } else if (selectedPlatform === PlatformType.GOOGLE) {
        await client.platform.google.version.updatePublishing(project.versionID, {
          locales: LanguageToLocale[googleLanguage],
          smallLogoImage: smallIcon,
          displayName: name,
          pronunciation: invocationName,
          sampleInvocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
        });
      } else if (selectedPlatform === PlatformType.GENERAL) {
        await client.platform.general.version.updateSettings(project.versionID, {
          locales: [generalLocale],
        });
      }

      goToCanvas(project.versionID);
    } finally {
      setCreatingProject(false);
    }
  };

  const stepBack = () => {
    setStepStack(([, ...remainingStack]) => [...remainingStack]);
  };

  const onContinue = () => {
    if (stepStack.length === NUMBER_OF_STEPS) {
      finalizeCreation();
    } else {
      if (currentStep === StepID.NAME_AND_IMAGE) {
        setStepStack((prevStepSTack) => [StepID.PLATFORM_SELECT, ...prevStepSTack]);
      } else if (currentStep === StepID.PLATFORM_SELECT) {
        setStepStack((prevStepSTack) => [StepID.PROJECT_SETTINGS, ...prevStepSTack]);
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
          onCancel={goToDashboard}
          stepBack={stepBack}
          canCancel
          stepStack={stepStack}
          onSkipClick={noop}
          numberOfSteps={NUMBER_OF_STEPS}
          hasBackButton={stepStack.length > 1}
          hasSkipButton={false}
        />

        <FlexCenter>
          <CurrentStep
            name={name}
            setName={setName}
            smallIcon={smallIcon}
            largeIcon={largeIcon}
            onContinue={onContinue}
            setSmallIcon={setSmallIcon}
            setLargeIcon={setLargeIcon}
            alexaLocales={alexaLocales}
            generalLocale={generalLocale}
            invocationName={invocationName}
            googleLanguage={googleLanguage}
            creatingProject={creatingProject}
            setAlexaLocales={setAlexaLocales}
            setGeneralLocale={setGeneralLocale}
            finalizeCreation={finalizeCreation}
            selectedPlatform={selectedPlatform}
            setGoogleLanguage={setGoogleLanguage}
            setInvocationName={setInvocationName}
            setSelectedPlatform={setSelectedPlatform}
          />
        </FlexCenter>
      </InnerContainer>
    </OuterContainer>
  );
};

const mapDispatchToPrpos = {
  goToCanvas: Router.goToCanvas,
  goToDashboard: Router.goToDashboard,
  createProject: Project.createProject,
};

type ConnectedNewProjectProps = ConnectedProps<{}, typeof mapDispatchToPrpos>;

export default connect(null, mapDispatchToPrpos)(NewProject);

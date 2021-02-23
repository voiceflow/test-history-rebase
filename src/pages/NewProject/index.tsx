import { Locale as AlexaLocale } from '@voiceflow/alexa-types';
import { Locale as GeneralLocale } from '@voiceflow/general-types';
import { Language as GoogleLanguage, LanguageToLocale } from '@voiceflow/google-types';
import React from 'react';

import client from '@/client';
import { CreationHeader, InnerContainer, OuterContainer } from '@/components/CreationSteps';
import { FlexCenter } from '@/components/Flex';
import { ChannelType, PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

import { StepID, StepMeta } from './constants';
import { CHANNEL_META } from './Steps/constants';

const NUMBER_OF_STEPS = 3;
const TEMPLATE_TAG = {
  [ChannelType.ALEXA_ASSISTANT]: 'default',
  [ChannelType.GOOGLE_ASSISTANT]: 'default',
  [ChannelType.CUSTOM_ASSISTANT]: 'default',
  [ChannelType.CHATBOT]: `default:${ChannelType.CHATBOT}`,
  [ChannelType.IVR]: `default:${ChannelType.IVR}`,
  [ChannelType.MOBILE_APP]: `default:${ChannelType.MOBILE_APP}`,
};

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
  const [projectImage, setProjectImage] = React.useState('');
  const [invocationName, setInvocationName] = React.useState('');
  const [selectedChannel, setSelectedChannel] = React.useState<ChannelType | null>(null);
  const [alexaLocales, setAlexaLocales] = React.useState<[AlexaLocale, ...AlexaLocale[]]>([LOCALE_MAP[0].value]);
  const [googleLanguage, setGoogleLanguage] = React.useState<GoogleLanguage>(GoogleLanguage.EN);
  const [generalLocale, setGeneralLocale] = React.useState<GeneralLocale>(GeneralLocale.EN_US);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const CurrentStep = StepMeta[currentStep].component;
  const platform = selectedChannel ? CHANNEL_META[selectedChannel].platform : null;

  const finalizeCreation = async () => {
    setCreatingProject(true);
    const listID = computedMatch?.params?.listID;

    try {
      const project = await createProject({ platform: platform!, name, image: projectImage, listID }, TEMPLATE_TAG[selectedChannel!]);

      // TODO: in the future make new project parameters much more platform specific
      if (platform === PlatformType.ALEXA) {
        await client.platform.alexa.version.updatePublishing(project.versionID, {
          invocationName,
          invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
          locales: alexaLocales,
        });
      } else if (platform === PlatformType.GOOGLE) {
        await client.platform.google.version.updatePublishing(project.versionID, {
          locales: LanguageToLocale[googleLanguage],
          displayName: name,
          pronunciation: invocationName,
          sampleInvocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
        });
      } else if (platform === PlatformType.GENERAL) {
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
    } else if (currentStep === StepID.NAME_AND_IMAGE) {
      setStepStack((prevStepSTack) => [StepID.PLATFORM_SELECT, ...prevStepSTack]);
    } else if (currentStep === StepID.PLATFORM_SELECT) {
      setStepStack((prevStepSTack) => [StepID.PROJECT_SETTINGS, ...prevStepSTack]);
    }
  };

  useDidUpdateEffect(() => {
    if (selectedChannel) {
      onContinue();
    }
  }, [selectedChannel]);

  useDidUpdateEffect(() => {
    setInvocationName(name);
  }, [name]);

  return (
    <OuterContainer>
      <InnerContainer>
        <CreationHeader
          title={StepMeta[currentStep].title(platform!)}
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
            onContinue={onContinue}
            alexaLocales={alexaLocales}
            generalLocale={generalLocale}
            invocationName={invocationName}
            googleLanguage={googleLanguage}
            creatingProject={creatingProject}
            setAlexaLocales={setAlexaLocales}
            setGeneralLocale={setGeneralLocale}
            projectImage={projectImage}
            setProjectImage={setProjectImage}
            finalizeCreation={finalizeCreation}
            selectedChannel={selectedChannel}
            setGoogleLanguage={setGoogleLanguage}
            setInvocationName={setInvocationName}
            setSelectedChannel={setSelectedChannel}
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

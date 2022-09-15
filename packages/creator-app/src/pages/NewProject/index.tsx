import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullable, Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexCenter, useDidUpdateEffect } from '@voiceflow/ui';
import { VoiceflowConstants as GeneralConstants, VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import client from '@/client';
import { CreationHeader, InnerContainer, OuterContainer } from '@/components/CreationSteps';
import { Path } from '@/config/routes';
import { GENERAL_LOCALE_NAME_MAP, getDefaultPlatformLanguageLabel } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useActiveWorkspace, useDispatch, useSelector } from '@/hooks';
import { FORMATTED_DIALOGFLOW_LOCALES_LABELS } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { isAlexaPlatform, isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { DEFAULT_PROJECT_NAME, PROJECT_CREATION_STEPS_NUMBER, StepID, StepMeta } from './constants';

const getTemplateTag = Realtime.Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: `default:chatbot`,
  },
  'default'
);

const getDefaultAlexaVoice = (locale: AlexaConstants.Locale) => {
  return AlexaConstants.DEFAULT_LOCALE_VOICE_MAP[locale] || null;
};

const getDefaultGoogleVoice = (language?: GoogleConstants.Language, locale?: GoogleConstants.Locale) => {
  const languageCode = language || (locale && Object.entries(GoogleConstants.LanguageToLocale).find(([_key, value]) => value.includes(locale))?.[0]);

  return GoogleConstants.DEFAULT_LANGUAGE_VOICE_MAP[languageCode as GoogleConstants.Language] || null;
};

const updateAlexaMeta = async (versionID: string, locales: [AlexaConstants.Locale, ...AlexaConstants.Locale[]], invocationName?: string) => {
  const defaultVoice = getDefaultAlexaVoice(locales[0]);

  await Promise.all([
    client.platform.alexa.version.updatePublishing(versionID, {
      invocationName,
      invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
      locales,
    }),
    defaultVoice && client.platform.alexa.version.updateSettings(versionID!, { defaultVoice }),
  ]);
};

const updateGoogleMeta = async (versionID: string, googleLanguage: GoogleConstants.Language, invocationName?: string) => {
  const defaultVoice = getDefaultGoogleVoice(googleLanguage) as Nullable<GoogleConstants.Voice>;
  await Promise.all([
    client.platform.google.version.updatePublishing(versionID, {
      locales: GoogleConstants.LanguageToLocale[googleLanguage],
      displayName: DEFAULT_PROJECT_NAME,
      pronunciation: invocationName,
      sampleInvocations: [`Talk to ${invocationName}`],
    }),
    defaultVoice && client.platform.google.version.updateSettings(versionID!, { defaultVoice }),
  ]);
};

const updateDialogFlowMeta = async (versionID: string, dialogFlowLanguage: DFESConstants.Language) => {
  await client.platform.dialogflow.version.updatePublishing(versionID, {
    locales: DFESConstants.LanguageToLocale[dialogFlowLanguage],
  });
};

const updateGeneralMeta = async (versionID: string, generalLocale: GeneralConstants.Locale) => {
  const firstAlexaVoice = getDefaultAlexaVoice(generalLocale as unknown as AlexaConstants.Locale);
  const firstGoogleVoice = !firstAlexaVoice && getDefaultGoogleVoice(undefined, generalLocale as unknown as GoogleConstants.Locale);
  const defaultVoice = firstAlexaVoice || firstGoogleVoice || undefined;

  await client.platform.general.version.updateSettings(versionID, {
    locales: [generalLocale],
    defaultVoice: defaultVoice ? (defaultVoice as unknown as Nullable<GoogleConstants.Voice>) : undefined,
  });
};

const NewProject: React.FC = () => {
  const projects = useSelector(ProjectV2.allProjectsSelector);
  const workspace = useActiveWorkspace();

  const goToDashboard = useDispatch(Router.goToDashboard);
  const createProject = useDispatch(Project.createProject);
  const redirectToDomain = useDispatch(Router.redirectToDomain);

  // Once this starts getting more complex, we should move all this logic to a context, but right now that's overkill
  const [stepStack, setStepStack] = React.useState<StepID[]>([StepID.PLATFORM_SELECT]);
  const currentStep = stepStack[0];

  const [invocationName, setInvocationName] = React.useState('');
  const [selectedChannel, setSelectedChannel] = React.useState<{
    platform: VoiceflowConstants.PlatformType;
    projectType: VoiceflowConstants.ProjectType;
  } | null>(null);

  const [alexaLocales, setAlexaLocales] = React.useState<[AlexaConstants.Locale, ...AlexaConstants.Locale[]]>([LOCALE_MAP[0].value]);
  const [googleLanguage, setGoogleLanguage] = React.useState<GoogleConstants.Language>(GoogleConstants.Language.EN);
  const [dialogflowLanguage, setDialogflowLanguage] = React.useState<DFESConstants.Language>(DFESConstants.Language.EN);
  const [generalLocale, setGeneralLocale] = React.useState<GeneralConstants.Locale>(GeneralConstants.Locale.EN_US);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const CurrentStep = StepMeta[currentStep].component;

  const {
    params: { listID },
  } = useRouteMatch<{ listID?: string }>();

  const finalizeCreation = async () => {
    setCreatingProject(true);

    const getLanguage = () => {
      const defaultLabel = getDefaultPlatformLanguageLabel(selectedChannel?.platform);

      return Realtime.Utils.platform.createPlatformSelector(
        {
          [VoiceflowConstants.PlatformType.ALEXA]: LOCALE_MAP.find((locale) => locale.value === alexaLocales[0])?.name ?? defaultLabel,
          [VoiceflowConstants.PlatformType.GOOGLE]: FORMATTED_GOOGLE_LOCALES_LABELS[googleLanguage] ?? defaultLabel,
          [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: FORMATTED_DIALOGFLOW_LOCALES_LABELS[dialogflowLanguage] ?? defaultLabel,
        },
        GENERAL_LOCALE_NAME_MAP[generalLocale] ?? defaultLabel
      )(selectedChannel?.platform);
    };

    let newVersionID: string | null = null;

    try {
      const project = await createProject(
        {
          name: DEFAULT_PROJECT_NAME,
          listID,
          platform: Realtime.projectTypeToLegacyPlatform(selectedChannel!.platform, selectedChannel!.projectType),
          language: getLanguage(),
          onboarding: false,
        },
        getTemplateTag(selectedChannel?.platform, selectedChannel?.projectType)
      );

      newVersionID = project.versionID;

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(selectedChannel?.platform)) {
        await updateAlexaMeta(newVersionID, alexaLocales, invocationName);
      } else if (isGooglePlatform(selectedChannel?.platform)) {
        await updateGoogleMeta(newVersionID, googleLanguage, invocationName);
      } else if (isDialogflowPlatform(selectedChannel?.platform)) {
        await updateDialogFlowMeta(newVersionID, dialogflowLanguage);
      } else {
        await updateGeneralMeta(newVersionID, generalLocale);
      }
    } finally {
      setCreatingProject(false);
    }

    if (newVersionID) {
      redirectToDomain({ versionID: newVersionID });
    }
  };

  const stepBack = () => {
    setStepStack(([, ...remainingStack]) => [...remainingStack]);
  };

  const onContinue = () => {
    if (stepStack.length === PROJECT_CREATION_STEPS_NUMBER) {
      finalizeCreation();
    } else if (currentStep === StepID.PLATFORM_SELECT) {
      setStepStack((prevStepSTack) => [StepID.PROJECT_SETTINGS, ...prevStepSTack]);
    }
  };

  useDidUpdateEffect(() => {
    if (selectedChannel) {
      onContinue();
    }
  }, [selectedChannel]);

  if (!workspace || projects.length >= workspace.projects) {
    return <Redirect to={Path.DASHBOARD} />;
  }

  return (
    <OuterContainer>
      <InnerContainer>
        <CreationHeader
          title={StepMeta[currentStep].title(selectedChannel?.platform)}
          onCancel={goToDashboard}
          stepBack={stepBack}
          canCancel
          stepStack={stepStack}
          onSkipClick={Utils.functional.noop}
          numberOfSteps={PROJECT_CREATION_STEPS_NUMBER}
          hasBackButton={stepStack.length > 1}
          hasSkipButton={false}
        />

        <FlexCenter>
          <CurrentStep
            platform={selectedChannel?.platform}
            onContinue={onContinue}
            alexaLocales={alexaLocales}
            generalLocale={generalLocale}
            invocationName={invocationName}
            googleLanguage={googleLanguage}
            creatingProject={creatingProject}
            setAlexaLocales={setAlexaLocales}
            setGeneralLocale={setGeneralLocale}
            finalizeCreation={finalizeCreation}
            setGoogleLanguage={setGoogleLanguage}
            setInvocationName={setInvocationName}
            setSelectedChannel={setSelectedChannel}
            dialogflowLanguage={dialogflowLanguage}
            setDialogflowLanguage={setDialogflowLanguage}
          />
        </FlexCenter>
      </InnerContainer>
    </OuterContainer>
  );
};

export default NewProject;

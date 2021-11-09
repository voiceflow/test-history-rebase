import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { Nullable, Utils } from '@voiceflow/common';
import { Constants, Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as DialogflowConstants } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';
import { Voice } from '@voiceflow/google-types/build/constants';
import { FlexCenter, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import client from '@/client';
import { CreationHeader, InnerContainer, OuterContainer } from '@/components/CreationSteps';
import { Path } from '@/config/routes';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useActiveWorkspace, useDispatch, useSelector, useSetup } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { createPlatformSelector } from '@/utils/platform';
import { isAlexaPlatform, isAnyGeneralPlatform, isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { DEFAULT_PROJECT_NAME, PROJECT_CREATION_STEPS_NUMBER, StepID, StepMeta } from './constants';

const getTemplateTag = createPlatformSelector({
  [Constants.PlatformType.ALEXA]: 'default',
  [Constants.PlatformType.GOOGLE]: 'default',
  [Constants.PlatformType.GENERAL]: 'default',
  [Constants.PlatformType.CHATBOT]: `default:${Constants.PlatformType.CHATBOT}`,
  [Constants.PlatformType.IVR]: `default:${Constants.PlatformType.IVR}`,
  [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 'default',
  [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 'default',
  [Constants.PlatformType.MOBILE_APP]: `default:${Constants.PlatformType.MOBILE_APP}`,
});

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
  const defaultVoice = getDefaultGoogleVoice(googleLanguage) as Nullable<Voice>;
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

const updateDialogFlowMeta = async (versionID: string, dialogFlowLanguage: DialogflowConstants.Language) => {
  await client.platform.dialogflow.version.updatePublishing(versionID, {
    locales: DialogflowConstants.LanguageToLocale[dialogFlowLanguage],
  });
};

const updateGeneralMeta = async (versionID: string, generalLocale: GeneralConstants.Locale) => {
  const firstAlexaVoice = getDefaultAlexaVoice(generalLocale as unknown as AlexaConstants.Locale);
  const firstGoogleVoice = !firstAlexaVoice && getDefaultGoogleVoice(undefined, generalLocale as unknown as GoogleConstants.Locale);
  const defaultVoice = firstAlexaVoice || firstGoogleVoice || undefined;

  await client.platform.general.version.updateSettings(versionID, {
    locales: [generalLocale],
    defaultVoice: defaultVoice ? (defaultVoice as unknown as Nullable<Voice>) : undefined,
  });
};

const NewProject: React.FC = () => {
  const projects = useSelector(ProjectV2.allProjectsSelector);
  const workspace = useActiveWorkspace();

  const redirectToCanvas = useDispatch(Router.redirectToCanvas);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const createProject = useDispatch(Project.createProject);
  const loadProjectsByWorkspaceID = useDispatch(Project.loadProjectsByWorkspaceID);

  // Once this starts getting more complex, we should move all this logic to a context, but right now that's overkill
  const [stepStack, setStepStack] = React.useState<StepID[]>([StepID.PLATFORM_SELECT]);
  const currentStep = stepStack[0];

  const [invocationName, setInvocationName] = React.useState<string>();
  const [selectedChannel, setSelectedChannel] = React.useState<Constants.PlatformType | null>(null);
  const [alexaLocales, setAlexaLocales] = React.useState<[AlexaConstants.Locale, ...AlexaConstants.Locale[]]>([LOCALE_MAP[0].value]);
  const [googleLanguage, setGoogleLanguage] = React.useState<GoogleConstants.Language>(GoogleConstants.Language.EN);
  const [dialogflowLanguage, setDialogflowLanguage] = React.useState<DialogflowConstants.Language>(DialogflowConstants.Language.EN);
  const [generalLocale, setGeneralLocale] = React.useState<GeneralConstants.Locale>(GeneralConstants.Locale.EN_US);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const CurrentStep = StepMeta[currentStep].component;

  const {
    params: { listID },
  } = useRouteMatch<{ listID?: string }>();

  const finalizeCreation = async () => {
    setCreatingProject(true);
    let newVersionID: string | null = null;

    try {
      const project = await createProject({ platform: selectedChannel!, name: DEFAULT_PROJECT_NAME, listID }, getTemplateTag(selectedChannel!));
      newVersionID = project.versionID;

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(selectedChannel!)) {
        await updateAlexaMeta(newVersionID, alexaLocales, invocationName);
      } else if (isGooglePlatform(selectedChannel!)) {
        await updateGoogleMeta(newVersionID, googleLanguage, invocationName);
      } else if (isDialogflowPlatform(selectedChannel!)) {
        await updateDialogFlowMeta(newVersionID, dialogflowLanguage);
      } else if (isAnyGeneralPlatform(selectedChannel!)) {
        await updateGeneralMeta(newVersionID, generalLocale);
      }
    } finally {
      setCreatingProject(false);
    }

    if (newVersionID) {
      redirectToCanvas(newVersionID);
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

  useSetup(() => {
    if (workspace?.id && !projects.length) {
      loadProjectsByWorkspaceID(workspace.id);
    }
  });

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
          title={StepMeta[currentStep].title(selectedChannel!)}
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
            onContinue={onContinue}
            alexaLocales={alexaLocales}
            generalLocale={generalLocale}
            invocationName={invocationName}
            googleLanguage={googleLanguage}
            creatingProject={creatingProject}
            setAlexaLocales={setAlexaLocales}
            setGeneralLocale={setGeneralLocale}
            finalizeCreation={finalizeCreation}
            selectedChannel={selectedChannel}
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

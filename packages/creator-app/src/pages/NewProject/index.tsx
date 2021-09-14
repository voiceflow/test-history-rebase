import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';
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
import { noop } from '@/utils/functional';
import { createPlatformSelector } from '@/utils/platform';
import { isAlexaPlatform, isAnyGeneralPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { DEFAULT_PROJECT_NAME, PROJECT_CREATION_STEPS_NUMBER, StepID, StepMeta } from './constants';

const getTemplateTag = createPlatformSelector({
  [PlatformType.ALEXA]: 'default',
  [PlatformType.GOOGLE]: 'default',
  [PlatformType.DIALOGFLOW]: 'default',
  [PlatformType.GENERAL]: 'default',
  [PlatformType.CHATBOT]: `default:${PlatformType.CHATBOT}`,
  [PlatformType.IVR]: `default:${PlatformType.IVR}`,
  [PlatformType.MOBILE_APP]: `default:${PlatformType.MOBILE_APP}`,
});

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
  const [selectedChannel, setSelectedChannel] = React.useState<PlatformType | null>(null);
  const [alexaLocales, setAlexaLocales] = React.useState<[AlexaConstants.Locale, ...AlexaConstants.Locale[]]>([LOCALE_MAP[0].value]);
  const [googleLanguage, setGoogleLanguage] = React.useState<GoogleConstants.Language>(GoogleConstants.Language.EN);
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

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(selectedChannel!)) {
        await client.platform.alexa.version.updatePublishing(project.versionID, {
          invocationName,
          invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
          locales: alexaLocales,
        });
      } else if (isGooglePlatform(selectedChannel!)) {
        await client.platform.google.version.updatePublishing(project.versionID, {
          locales: GoogleConstants.LanguageToLocale[googleLanguage],
          displayName: DEFAULT_PROJECT_NAME,
          pronunciation: invocationName,
          sampleInvocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
        });
      } else if (isAnyGeneralPlatform(selectedChannel!)) {
        await client.platform.general.version.updateSettings(project.versionID, {
          locales: [generalLocale],
        });
      }

      newVersionID = project.versionID;
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
          onSkipClick={noop}
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
          />
        </FlexCenter>
      </InnerContainer>
    </OuterContainer>
  );
};

export default NewProject;

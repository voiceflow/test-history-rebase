import { Locale as AlexaLocale } from '@voiceflow/alexa-types';
import { Locale as GeneralLocale } from '@voiceflow/general-types';
import { Language as GoogleLanguage, LanguageToLocale } from '@voiceflow/google-types';
import { FlexCenter, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import client from '@/client';
import { CreationHeader, InnerContainer, OuterContainer } from '@/components/CreationSteps';
import { Path } from '@/config/routes';
import { PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useSetup } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';
import { createPlatformSelector } from '@/utils/platform';
import { isAlexaPlatform, isAnyGeneralPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { StepID, StepMeta } from './constants';

const NUMBER_OF_STEPS = 3;

const getTemplateTag = createPlatformSelector({
  [PlatformType.ALEXA]: 'default',
  [PlatformType.GOOGLE]: 'default',
  [PlatformType.GENERAL]: 'default',
  [PlatformType.CHATBOT]: `default:${PlatformType.CHATBOT}`,
  [PlatformType.IVR]: `default:${PlatformType.IVR}`,
  [PlatformType.MOBILE_APP]: `default:${PlatformType.MOBILE_APP}`,
});

const NewProject: React.FC<ConnectedNewProjectProps> = ({
  workspace,
  projects,
  activeWorkspaceID,
  goToDashboard,
  redirectToCanvas,
  createProject,
  loadProjectsByWorkspaceID,
}) => {
  // Once this starts getting more complex, we should move all this logic to a context, but right now that's overkill
  const [stepStack, setStepStack] = React.useState<StepID[]>([StepID.NAME_AND_IMAGE]);
  const currentStep = stepStack[0];

  const [name, setName] = React.useState('');
  const [projectImage, setProjectImage] = React.useState('');
  const [invocationName, setInvocationName] = React.useState('');
  const [selectedChannel, setSelectedChannel] = React.useState<PlatformType | null>(null);
  const [alexaLocales, setAlexaLocales] = React.useState<[AlexaLocale, ...AlexaLocale[]]>([LOCALE_MAP[0].value]);
  const [googleLanguage, setGoogleLanguage] = React.useState<GoogleLanguage>(GoogleLanguage.EN);
  const [generalLocale, setGeneralLocale] = React.useState<GeneralLocale>(GeneralLocale.EN_US);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const CurrentStep = StepMeta[currentStep].component;

  const {
    params: { listID },
  } = useRouteMatch<{ listID?: string }>();

  const finalizeCreation = async () => {
    setCreatingProject(true);
    let newVersionID: string | null = null;

    try {
      // TODO: change this when we have templates for all channels
      const project = await createProject(
        { platform: isAnyGeneralPlatform(selectedChannel!) ? PlatformType.GENERAL : selectedChannel!, name, image: projectImage, listID },
        getTemplateTag(selectedChannel!)
      );

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(selectedChannel!)) {
        await client.platform.alexa.version.updatePublishing(project.versionID, {
          invocationName,
          invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
          locales: alexaLocales,
        });
      } else if (isGooglePlatform(selectedChannel!)) {
        await client.platform.google.version.updatePublishing(project.versionID, {
          locales: LanguageToLocale[googleLanguage],
          displayName: name,
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
    if (stepStack.length === NUMBER_OF_STEPS) {
      finalizeCreation();
    } else if (currentStep === StepID.NAME_AND_IMAGE) {
      setStepStack((prevStepSTack) => [StepID.PLATFORM_SELECT, ...prevStepSTack]);
    } else if (currentStep === StepID.PLATFORM_SELECT) {
      setStepStack((prevStepSTack) => [StepID.PROJECT_SETTINGS, ...prevStepSTack]);
    }
  };

  useSetup(() => {
    if (activeWorkspaceID && !projects.length) {
      loadProjectsByWorkspaceID(activeWorkspaceID);
    }
  });

  useDidUpdateEffect(() => {
    if (selectedChannel) {
      onContinue();
    }
  }, [selectedChannel]);

  useDidUpdateEffect(() => {
    setInvocationName(name);
  }, [name]);

  if (!activeWorkspaceID || !workspace || projects.length >= workspace.projects) {
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

const mapStateToProps = {
  projects: Project.allProjectsSelector,
  workspace: Workspace.activeWorkspaceSelector,
  activeWorkspaceID: Session.activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  redirectToCanvas: Router.redirectToCanvas,
  goToDashboard: Router.goToDashboard,
  createProject: Project.createProject,
  loadProjectsByWorkspaceID: Project.loadProjectsByWorkspaceID,
};

type ConnectedNewProjectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);

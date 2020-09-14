import React from 'react';

import clientV2 from '@/clientV2';
import InnerContainer from '@/components/CreationSteps/components/Containers/InnerContainer';
import OuterContainer from '@/components/CreationSteps/components/Containers/OuterContainer';
import CreationHeader from '@/components/CreationSteps/components/Header';
import { FlexCenter } from '@/components/Flex';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useFeature } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

import { StepID, StepMeta } from './constants';

const NUMBER_OF_STEPS = 3;

const NewProject: React.FC<ConnectedNewProjectProps & { computedMatch: { params?: { listID: string } } }> = ({
  computedMatch,
  goToDashboard,
  createSkill,
  goToCanvas,
  createProject,
}) => {
  // Once this starts getting more complex, we should move all this logic to a context, but right now that's overkill
  const [stepStack, setStepStack] = React.useState<StepID[]>([StepID.NAME_AND_IMAGE]);
  const currentStep = stepStack[0];
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('');
  const [invocationName, setInvocationName] = React.useState('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<PlatformType>();
  const [selectedLocales, setSelectedLocales] = React.useState([LOCALE_MAP[0].value]);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const CurrentStep: React.FC<any> = StepMeta[currentStep].component;
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const finalizeCreation = async () => {
    setCreatingProject(true);
    const projectData = {
      name,
      locales: selectedPlatform === PlatformType.GENERAL ? [] : selectedLocales,
      platform: selectedPlatform!,
    };
    const listID = computedMatch?.params?.listID;

    const projectMeta = { inv_name: invocationName, large_icon: image };

    try {
      if (dataRefactor.isEnabled) {
        const project = await createProject({ platform: selectedPlatform!, name, image, listID });
        // TODO: in the future make new project parameters much more platform specific
        if (selectedPlatform === PlatformType.ALEXA) {
          clientV2.alexaService.updatePublishing(project.versionID, {
            invocationName,
            invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
            locales: selectedLocales as any,
            largeIcon: image,
          });
        }
        goToCanvas(project.versionID);
      } else {
        await createSkill(selectedPlatform!, projectData, projectMeta, listID);
      }
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
            creatingProject={creatingProject}
            invocationName={invocationName}
            setInvocationName={setInvocationName}
            selectedLocales={selectedLocales}
            setSelectedLocales={setSelectedLocales}
            name={name}
            setImage={setImage}
            setName={setName}
            image={image}
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
  createSkill: Skill.createSkill,
  createProject: ProjectV2.createProject,
};

type ConnectedNewProjectProps = ConnectedProps<{}, typeof mapDispatchToPrpos>;

export default connect(null, mapDispatchToPrpos)(NewProject);

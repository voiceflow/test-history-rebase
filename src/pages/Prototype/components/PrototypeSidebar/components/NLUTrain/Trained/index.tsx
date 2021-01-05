import React from 'react';

import client from '@/client';
import Button, { ButtonVariant } from '@/components/Button';
import Text, { Link } from '@/components/Text';
import { toast } from '@/components/Toast';
import { PlatformType } from '@/constants';
import { NLPTrainStageType } from '@/constants/platforms';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useSetup } from '@/hooks';
import { NLPContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';

import NLUContainer from '../../NLUContainer';
import { ModelDiff, getModelsDiffs, isModelChanged } from './utils';

const TRAIN_ASSISTANT_TEXT = {
  [PlatformType.ALEXA]: 'Train Alexa Skill',
  [PlatformType.GOOGLE]: 'Train Google Action',
  [PlatformType.GENERAL]: 'Train Assistant',
};

const Trained: React.FC<ConnectedTrainedProps> = ({ platform, versionID, projectID }) => {
  const nlp = React.useContext(NLPContext)!;
  const [modelDiff, setModelDiff] = React.useState<ModelDiff>({
    slots: { new: [], deleted: [], updated: [] },
    intents: { new: [], deleted: [], updated: [] },
  })!;

  const onStartTraining = async () => {
    try {
      await nlp.publish();
    } catch {
      toast.error('An error occurred while training the model');
    }
  };

  useSetup(async () => {
    const [projectPrototype, versionPrototype] = await Promise.all([
      client.api.project.getPrototype(projectID),
      client.api.version.getPrototype(versionID),
    ] as const);

    setModelDiff(getModelsDiffs(projectPrototype?.trainedModel ?? { slots: [], intents: [] }, versionPrototype.model));
  });

  const isTrained = !isModelChanged(modelDiff) && (!nlp.job || nlp.job.stage.type === NLPTrainStageType.SUCCESS);

  return (
    <NLUContainer>
      <img src="/lightbulb.svg" alt="user" width="80" />

      <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
        {isTrained ? 'Your assistant is trained' : 'Your assistant needs training'}
      </Text>

      <Text fontSize={13} color="#62778c" fontWeight={500} mt={16} mb={27} lineHeight={1.54}>
        Train your assistant for the highest fidelity testing experience. <Link href="">Learn more.</Link>
      </Text>

      <Button variant={ButtonVariant.TERTIARY} disabled={isTrained} onClick={onStartTraining}>
        {TRAIN_ASSISTANT_TEXT[platform]}
      </Button>
    </NLUContainer>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  versionID: Skill.activeSkillIDSelector,
  projectID: Skill.activeProjectIDSelector,
};

type ConnectedTrainedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Trained) as React.FC;

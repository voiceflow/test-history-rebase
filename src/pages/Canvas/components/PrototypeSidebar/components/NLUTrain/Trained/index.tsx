import React from 'react';

import client from '@/client';
import Button, { ButtonVariant } from '@/components/Button';
import Text, { Link } from '@/components/Text';
import { toast } from '@/components/Toast';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { NLUContainer } from '../../components';

const TRAIN_ASSISTANT_TEXT = {
  [PlatformType.ALEXA]: 'Train Alexa Skill',
  [PlatformType.GOOGLE]: 'Train Google Action',
  [PlatformType.GENERAL]: 'Train Assistant',
};

type TrainedProps = {
  trainingCompleted: boolean;
  setTrainingInProgress: (training: boolean) => void;
};

const Trained: React.FC<TrainedProps & ConnectedTrainedProps> = ({ trainingCompleted, setTrainingInProgress, platform, projectID, versionID }) => {
  const startTraining = async () => {
    try {
      const version = await client.api.version.get(versionID);
      if (!version.prototype) {
        throw new Error('Prototype is not rendered'); // we shouldn't start training the model if prototype isn't rendered
      }
      const { slots, intents } = version.prototype.model;

      client.platform.general.luis.publish(projectID, {
        slots,
        intents,
      });
      setTrainingInProgress(true);
    } catch (err) {
      toast.error('error occured while training the model');
    }
  };

  return (
    <NLUContainer>
      <img src="/lightbulb.svg" alt="user" width="80" />
      <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
        {trainingCompleted ? 'Your assistant is trained' : 'Your assistant needs training.'}
      </Text>
      <Text fontSize={13} color="#62778c" fontWeight={500} mt={16} mb={27} lineHeight={1.54}>
        Train your assistant for the highest fidelity testing experience. <Link href="">Learn more.</Link>
      </Text>

      <Button variant={ButtonVariant.TERTIARY} disabled={trainingCompleted} onClick={startTraining}>
        {TRAIN_ASSISTANT_TEXT[platform]}
      </Button>
    </NLUContainer>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  projectID: Skill.activeProjectIDSelector,
  versionID: Skill.activeSkillIDSelector,
};

type ConnectedTrainedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Trained) as React.FC<TrainedProps>;

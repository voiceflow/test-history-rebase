import { Flex, logger, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import { NLPTrainStageType } from '@/constants/platforms';
import { PrototypeStatus } from '@/constants/prototype';
import { TrainingContext } from '@/contexts/TrainingContext';
import * as ProjectV2 from '@/ducks/projectV2';
import * as PrototypeDuck from '@/ducks/prototype';
import * as Tracking from '@/ducks/tracking';
import { useSelector } from '@/hooks';
import { TrainingModelContext } from '@/pages/Project/contexts';

import TrainContainer from './TrainContainer';
import Trained from './Trained';
import TrainFadeDown from './TrainFadeDown';
import Training from './Training';
import TrainingSectionTitle, { TrainingSectionTitleVariant } from './TrainingSectionTitle';

export interface TrainingSectionProps {
  isOpen: boolean;
  onOpen: () => void;
  toggleOpen: () => void;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ isOpen, onOpen, toggleOpen }) => {
  const nlp = React.useContext(TrainingContext)!;
  const { cancelTraining, startTraining, isTrained, isTraining, state: trainingState } = React.useContext(TrainingModelContext);
  const status = useSelector(PrototypeDuck.prototypeStatusSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  React.useEffect(() => {
    if (status === PrototypeStatus.IDLE && !isTrained) {
      onOpen();
    }
  }, [status]);

  React.useEffect(() => {
    const stage = nlp.job?.stage;

    if (stage?.type === NLPTrainStageType.ERROR) {
      logger.warn('Train error', stage.data);

      let message: string;
      const error = stage.data?.error?.message || stage.data?.error;
      const nlpMessage = typeof error === 'string' ? error : JSON.stringify(error);

      // eslint-disable-next-line sonarjs/no-small-switch
      switch (nlpMessage) {
        case 'Training failed with reason: FewLabels':
          message =
            'Your Assistant was unable to be trained because you have Entities set as required, but you have not provided any Response Utterances. Please fix this and try training again.';
          break;

        default:
          message = `An error occurred while training the model${nlpMessage ? `: ${nlpMessage}` : '.'}`;
      }

      toast.error(message, { autoClose: false });
    }
  }, [nlp.job?.stage.type]);

  return (
    <Section
      header={
        <TippyTooltip content={!isTrained ? 'Assistant needs training' : 'Assistant fully trained'} disabled={isOpen}>
          <Flex>
            <TrainingSectionTitle
              variant={
                // eslint-disable-next-line no-nested-ternary
                !trainingState.trainedModel
                  ? TrainingSectionTitleVariant.IDLE
                  : isTrained
                  ? TrainingSectionTitleVariant.TRAINED
                  : TrainingSectionTitleVariant.UNTRAINED
              }
              statusVisible={!isOpen}
            >
              <span>TRAINING</span>
            </TrainingSectionTitle>
          </Flex>
        </TippyTooltip>
      }
      variant={SectionVariant.PROTOTYPE}
      onClick={toggleOpen}
      isCollapsed={!isOpen}
      collapseVariant={SectionToggleVariant.ARROW}
      customHeaderStyling={{ backgroundColor: 'rgba(238, 244, 246, 0.5)' }}
      customContentStyling={{ backgroundColor: 'rgba(238, 244, 246, 0.5)' }}
    >
      <TrainContainer isModelTraining={isTraining}>
        {isTraining ? (
          <TrainFadeDown key="training">
            <Training onCancelTraining={cancelTraining} />
          </TrainFadeDown>
        ) : (
          !trainingState.fetching && (
            <TrainFadeDown key="trained">
              <Trained
                diff={trainingState.diff}
                platform={platform}
                isTrained={isTrained}
                trainedModel={trainingState.trainedModel}
                lastTrainedTime={trainingState.lastTrainedTime}
                onStartTraining={() => startTraining(Tracking.AssistantOriginType.TEST_TOOL)}
              />
            </TrainFadeDown>
          )
        )}
      </TrainContainer>
    </Section>
  );
};

export default TrainingSection;

import { Flex, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';
import { PrototypeStatus } from '@/constants/prototype';
import { Designer, Project, Tracking } from '@/ducks';
import * as PrototypeDuck from '@/ducks/prototype';
import { useSelector } from '@/hooks';
import { NLUTrainingModelContext } from '@/pages/Project/contexts';

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
  const nluTrainingModel = React.useContext(NLUTrainingModelContext);

  const status = useSelector(PrototypeDuck.prototypeStatusSelector);
  const platform = useSelector(Project.active.platformSelector);
  const nluTrainingDiffData = useSelector(Designer.Environment.selectors.nluTrainingDiffData);
  const nluTrainingDiffStatus = useSelector(Designer.Environment.selectors.nluTrainingDiffStatus);

  React.useEffect(() => {
    if (status === PrototypeStatus.IDLE && !nluTrainingModel.isTrained) {
      onOpen();
    }
  }, [status]);

  return (
    <Section
      header={
        <TippyTooltip content={!nluTrainingModel.isTrained ? 'Assistant needs training' : 'Assistant fully trained'} disabled={isOpen}>
          <Flex>
            <TrainingSectionTitle
              variant={
                // eslint-disable-next-line no-nested-ternary
                nluTrainingDiffStatus === NLUTrainingDiffStatus.UNKNOWN
                  ? TrainingSectionTitleVariant.IDLE
                  : nluTrainingModel.isTrained
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
      <TrainContainer isModelTraining={nluTrainingModel.isTraining}>
        {nluTrainingModel.isTraining ? (
          <TrainFadeDown key="training">
            <Training onCancelTraining={nluTrainingModel.cancel} />
          </TrainFadeDown>
        ) : (
          nluTrainingDiffStatus !== NLUTrainingDiffStatus.FETCHING && (
            <TrainFadeDown key="trained">
              <Trained
                platform={platform}
                isTrained={nluTrainingModel.isTrained}
                onStartTraining={() => nluTrainingModel.start(Tracking.AssistantOriginType.TEST_TOOL)}
                nluTrainingDiffData={nluTrainingDiffData}
              />
            </TrainFadeDown>
          )
        )}
      </TrainContainer>
    </Section>
  );
};

export default TrainingSection;

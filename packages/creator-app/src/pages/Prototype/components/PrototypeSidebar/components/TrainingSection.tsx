import { PrototypeModel } from '@voiceflow/api-sdk';
import { ClickableText, Flex, logger, TippyTooltip, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { SectionToggleVariant, SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import * as Errors from '@/config/errors';
import { NLPTrainStageType } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import * as PrototypeDuck from '@/ducks/prototype';
import { PrototypeStatus } from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { NLPContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';
import { getModelsDiffs, isModelChanged, ModelDiff } from '@/utils/prototypeModel';
import * as Sentry from '@/vendors/sentry';

import TrainContainer from './TrainContainer';
import Trained from './Trained';
import TrainFadeDown from './TrainFadeDown';
import Training from './Training';
import TrainingSectionTitle, { TrainingSectionTitleVariant } from './TrainingSectionTitle';

export type TrainingSectionProps = {
  isOpen: boolean;
  onOpen: () => void;
  isTraining: boolean;
  toggleOpen: () => void;
};

const TrainingSection: React.FC<ConnectedTrainingSectionProps & TrainingSectionProps> = ({
  isOpen,
  status,
  onOpen,
  platform,
  projectID,
  versionID,
  diagramID,
  isTraining,
  toggleOpen,
  validateModel,
  goToInteractionModel,
}) => {
  const nlp = React.useContext(NLPContext)!;
  const [trackingEvents] = useTrackingEvents();
  const [state, stateApi] = useSmartReducerV2({
    diff: {
      slots: { new: [], deleted: [], updated: [] },
      intents: { new: [], deleted: [], updated: [] },
    } as ModelDiff,
    fetching: false,
    trainedModel: null as PrototypeModel | null,
    lastTrainedTime: 0,
  });

  const onStartTraining = async () => {
    trackingEvents.trackProjectTrainAssistant();

    try {
      const { invalid } = await validateModel();
      if (invalid.slots.length) {
        toast.warn(
          <>
            Your slots <b>({invalid.slots.map(({ name }) => name).join(', ')})</b> require custom values in order to be properly recognized during
            testing. Update the{' '}
            <ClickableText onClick={() => goToInteractionModel(versionID!, diagramID!, 'slots', invalid.slots[0].key)}>
              Interaction Model
            </ClickableText>{' '}
            and train your assistant again.
          </>
        );
      }
      await nlp.publish();
    } catch (err) {
      logger.warn('Train error', err);
      toast.error('An error occurred while training the model.');
    }
  };

  const onCancelTraining = async () => {
    await nlp.cancel();
  };

  const getDiff = async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    if (!versionID) {
      Sentry.error(Errors.noActiveVersionID());
      toast.genericError();
      return;
    }

    try {
      stateApi.update({ fetching: true });

      await client.platform.general.nlp.getApp(projectID);

      const [projectPrototype, versionPrototype] = await Promise.all([
        client.api.project.getPrototype(projectID),
        client.api.version.getPrototype(versionID),
      ] as const);

      stateApi.update({
        diff: getModelsDiffs(projectPrototype?.trainedModel ?? { slots: [], intents: [] }, versionPrototype.model),
        fetching: false,
        trainedModel: projectPrototype?.trainedModel ?? null,
        lastTrainedTime: projectPrototype?.lastTrainedTime ?? Date.now(),
      });
    } catch {
      stateApi.update({ fetching: false });
    }
  };

  React.useEffect(() => {
    if (!isTraining) {
      getDiff();
    }
  }, [isTraining]);

  const isTrained = !isModelChanged(state.diff) && (!nlp.job || nlp.job.stage.type === NLPTrainStageType.SUCCESS);

  React.useEffect(() => {
    if (status === PrototypeStatus.IDLE && !isTrained) {
      onOpen();
    }
  }, [status]);

  React.useEffect(() => {
    if (nlp.job?.stage.type === NLPTrainStageType.ERROR) {
      logger.warn('Train error', nlp.job.stage.data);

      let message: string;
      const nlpMessage = nlp.job.stage.data?.error?.message;

      // eslint-disable-next-line sonarjs/no-small-switch
      switch (nlpMessage) {
        case 'Training failed with reason: FewLabels':
          message =
            'Your Assistant was unable to be trained because you have Slot(s) set as required, but you have not provided any Response Utterances. Please fix this and try training again.';
          break;

        default:
          message = `An error occurred while training the model. ${nlpMessage || ''}`;
      }

      toast.error(message);
    }
  }, [nlp.job?.stage.type]);

  return (
    <Section
      header={
        <TippyTooltip title={!isTrained ? 'Assistant needs training' : 'Assistant fully trained'} disabled={isOpen}>
          <Flex>
            <TrainingSectionTitle
              variant={
                // eslint-disable-next-line no-nested-ternary
                !state.trainedModel
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
            <Training onCancelTraining={onCancelTraining} />
          </TrainFadeDown>
        ) : (
          !state.fetching && (
            <TrainFadeDown key="trained">
              <Trained
                diff={state.diff}
                platform={platform}
                isTrained={isTrained}
                trainedModel={state.trainedModel}
                lastTrainedTime={state.lastTrainedTime}
                onStartTraining={onStartTraining}
              />
            </TrainFadeDown>
          )
        )}
      </TrainContainer>
    </Section>
  );
};

const mapStateToProps = {
  status: PrototypeDuck.prototypeStatusSelector,
  platform: Project.activePlatformSelector,
  versionID: Session.activeVersionIDSelector,
  diagramID: Session.activeDiagramIDSelector,
  projectID: Session.activeProjectIDSelector,
};

const mapDispatchToProps = {
  validateModel: PrototypeDuck.validateModel,
  goToInteractionModel: Router.goToInteractionModel,
};

type ConnectedTrainingSectionProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(TrainingSection) as React.FC<TrainingSectionProps>;

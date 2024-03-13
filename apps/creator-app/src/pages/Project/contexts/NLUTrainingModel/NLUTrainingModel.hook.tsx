import { logger, System, toast } from '@voiceflow/ui';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { NLPTrainStageType } from '@/constants/platforms';
import { TrainingContext } from '@/contexts/TrainingContext';
import { Designer, Router, Tracking } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks';

export interface NLUTrainingModelContextValue {
  isTrained: boolean;
  isTraining: boolean;
  startTraining: (origin: Tracking.AssistantOriginType) => void;
  cancelTraining: () => void | Promise<void>;
}

export const NLUTrainingModelContext = React.createContext<NLUTrainingModelContextValue>({
  isTrained: false,
  isTraining: false,
  startTraining: () => {},
  cancelTraining: () => {},
});

export const useNLUTrainingModelNotifications = () => {
  const training = React.useContext(TrainingContext);
  const getEntity = useSelector(Designer.Entity.selectors.getOneByID);

  const goToCMSResource = useDispatch(Router.goToCMSResource);

  React.useEffect(() => {
    const stage = training?.job?.stage;

    switch (stage?.type) {
      case NLPTrainStageType.SUCCESS:
        {
          const invalidSlotsIDs = stage.data?.validations?.invalid.slots.filter((key) => !getEntity({ id: key }));

          if (invalidSlotsIDs?.length) {
            const message = invalidSlotsIDs.map((key) => getEntity({ id: key })!.name).join(', ');

            toast.warn(
              <>
                Your slots <b>{message}</b> require custom values in order to be properly recognized during testing. Update the{' '}
                <System.Link.Button onClick={() => goToCMSResource(CMSRoute.ENTITY, invalidSlotsIDs[0])}>Interaction Model</System.Link.Button> and
                train your assistant again.
              </>,
              { autoClose: false }
            );
          }
        }
        break;

      case NLPTrainStageType.ERROR:
        {
          const error = stage.data?.error?.message || stage.data?.error;
          const nlpMessage = typeof error === 'string' ? error : JSON.stringify(error);

          let message = `An error occurred while training the model${nlpMessage ? `: ${nlpMessage}` : '.'}`;

          if (nlpMessage === 'Training failed with reason: FewLabels') {
            message =
              'Your Assistant was unable to be trained because you have Entities set as required, but you have not provided any Response Utterances. Please fix this and try training again.';
          }

          toast.error(message, { autoClose: false });
          logger.warn('Train error', stage.data);
        }
        break;

      default:
        break;
    }
  }, [training?.job?.stage.type]);
};

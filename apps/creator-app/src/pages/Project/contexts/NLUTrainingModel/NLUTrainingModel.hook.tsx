import { Link, notify } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { NLPTrainStageType } from '@/constants/platforms';
import { Designer, Router } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks';
import { TrainingContext } from '@/pages/Project/contexts/TrainingContext';
import { logger } from '@/utils/logger';

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

            notify.long.warning(
              <>
                Your slots <b>{message}</b> require custom values in order to be properly recognized during testing.
                Update the{' '}
                <Link label="Interaction Model" onClick={() => goToCMSResource(CMSRoute.ENTITY, invalidSlotsIDs[0])} />{' '}
                and train your agent again.
              </>,
              { pauseOnHover: true, bodyClassName: 'vfui' }
            );
          }
        }
        break;

      case NLPTrainStageType.ERROR:
        {
          const error = stage.data?.error?.message || stage.data?.error;
          const nlpMessage = typeof error === 'string' ? error : JSON.stringify(error);

          // eslint-disable-next-line sonarjs/no-nested-template-literals
          let message = `An error occurred while training the model${nlpMessage ? `: ${nlpMessage}` : '.'}`;

          if (nlpMessage === 'Training failed with reason: FewLabels') {
            message =
              'Your agent was unable to be trained because you have Entities set as required, but you have not provided any Response Utterances. Please fix this and try training again.';
          }

          notify.long.warning(message, { pauseOnHover: true, bodyClassName: 'vfui' });
          logger.warn('Train error', stage.data);
        }
        break;

      default:
        break;
    }
  }, [training?.job?.stage.type]);
};

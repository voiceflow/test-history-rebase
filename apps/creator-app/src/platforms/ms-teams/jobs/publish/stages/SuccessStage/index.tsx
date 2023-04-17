import React from 'react';

import { PublishContext } from '@/contexts/PublishContext';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

import { ConfigurationRequiredStage, PublishedStage } from './components';

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = (props) => {
  const { job } = React.useContext(PublishContext)!;

  const goToCurrentPublish = useDispatch(Router.goToActivePlatformPublish);
  const onLinkClick = () => {
    props.cancel();
    goToCurrentPublish();
  };

  return job!.stage.data.configurationRequired ? (
    <ConfigurationRequiredStage {...props} onClick={onLinkClick} />
  ) : (
    <PublishedStage {...props} onClick={onLinkClick} />
  );
};

export default SuccessStage;

import React from 'react';

import { AlexaJobSuccessType } from '@/constants/platforms';
import { AlexaJob, Job } from '@/models';
import { PublishContext } from '@/pages/Skill/contexts';

import { Submitted, Uploaded } from './components';

const SuccessStage: React.FC = () => {
  const { stage } = React.useContext(PublishContext)!.job as Job<AlexaJob.SuccessStage>;

  return stage.data.successType === AlexaJobSuccessType.SUBMIT ? <Submitted /> : <Uploaded />;
};

export default SuccessStage;

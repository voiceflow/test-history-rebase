import React from 'react';

import JobInterface from '@/components/JobInterface';
import { PublishContext } from '@/contexts/PublishContext';
import { useSimulatedProgress } from '@/hooks/job';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

import { useTeamsPublish } from './hooks';
import { useNLPTrainingStageContent } from './stages';

const MSTeamsPublishButton: React.FC = () => {
  const publishContext = React.useContext(PublishContext);
  const { job, active } = publishContext;

  const Content = useNLPTrainingStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  const { onPublish } = useTeamsPublish();

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default MSTeamsPublishButton;

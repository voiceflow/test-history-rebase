import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { JobStatus } from '@/constants';
import { NLPTrainStageType } from '@/constants/platforms';
import { PublishContext } from '@/contexts/PublishContext';
import { useSimulatedProgress } from '@/hooks/job';
import PublishButton from '@/pages/Project/components/Upload/components/PublishButton';

import { useWhatsAppStageContent } from './stages';

const WhatsApp: React.FC = () => {
  const publishContext = React.useContext(PublishContext);
  const { job, active } = publishContext;

  const onPublish = usePersistFunction(() =>
    publishContext?.setJob({ stage: { type: NLPTrainStageType.CONFIRM }, id: 'confirm', status: JobStatus.FINISHED })
  );

  const Content = useWhatsAppStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default WhatsApp;

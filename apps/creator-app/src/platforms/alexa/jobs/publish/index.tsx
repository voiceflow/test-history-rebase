import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotkey } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import { Hotkey } from '@/keymap';
import PublishButton from '@/pages/Project/components/Upload/components/PublishButton';

import { useAlexaPublishContext } from './hooks';
import { useAlexaPublishStageContent } from './stages';

const AlexaPublish: React.FC = () => {
  const publishContext = useAlexaPublishContext();

  const { job, active, onPublish } = publishContext;
  const Content = useAlexaPublishStageContent(job?.stage.type);

  useHotkey(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true });

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default AlexaPublish;

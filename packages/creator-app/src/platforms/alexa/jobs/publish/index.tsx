import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotKeys } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import { Hotkey } from '@/keymap';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';
import { isRunning } from '@/utils/job';

import { useAlexaPublishContext } from './hooks';
import { useAlexaPublishStageContent } from './stages';

const AlexaPublish: React.FC = () => {
  const publishContext = useAlexaPublishContext();

  const { job, onPublish } = publishContext;
  const Content = useAlexaPublishStageContent(job?.stage.type);

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true }, [onPublish]);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <PublishButton loading={isRunning(job)} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default AlexaPublish;

import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotKeys } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import { Hotkey } from '@/keymap';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

import { useGooglePublishContext } from './hooks';
import { useGooglePublishStageContent } from './stages';

const GooglePublish: React.OldFC = () => {
  const publishContext = useGooglePublishContext();

  const { job, active, onPublish } = publishContext;
  const Content = useGooglePublishStageContent(job?.stage.type);

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true }, [onPublish]);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default GooglePublish;

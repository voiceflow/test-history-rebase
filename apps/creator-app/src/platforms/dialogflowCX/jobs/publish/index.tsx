import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotkey } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import { Hotkey } from '@/keymap';
import General from '@/platforms/general/jobs/publish';

import DialogflowCXUploadButton from './components/DialogflowCXUploadButton';
import { useDialogflowCXPublishContext } from './hooks';
import { useDialogflowCXPublishStageContent } from './stages';

const DialogflowPublish: React.FC = () => {
  const { isEnabled } = useFeature(Realtime.FeatureFlag.PROJECT_API_IMPROVEMENTS);
  const publishContext = useDialogflowCXPublishContext();

  const { job, onPublish } = publishContext;
  const Content = useDialogflowCXPublishStageContent(job?.stage.type);

  useHotkey(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true });

  if (isEnabled) return <General />;

  return (
    <JobInterface Content={Content} context={publishContext}>
      <DialogflowCXUploadButton dialogflowPublishJob={job} onPublish={onPublish} />
    </JobInterface>
  );
};

export default DialogflowPublish;

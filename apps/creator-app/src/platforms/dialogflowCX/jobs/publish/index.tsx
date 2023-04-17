import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

import DialogflowCXUploadButton from './components/DialogflowCXUploadButton';
import { useDialogflowCXPublishContext } from './hooks';
import { useDialogflowCXPublishStageContent } from './stages';

const DialogflowPublish: React.FC = () => {
  const publishContext = useDialogflowCXPublishContext();

  const { job, onPublish } = publishContext;
  const Content = useDialogflowCXPublishStageContent(job?.stage.type);

  useHotkey(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true });

  return (
    <JobInterface Content={Content} context={publishContext}>
      <DialogflowCXUploadButton dialogflowPublishJob={job} onPublish={onPublish} />
    </JobInterface>
  );
};

export default DialogflowPublish;

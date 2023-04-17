import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

import DialogflowUploadButton from './components/DialogflowUploadButton';
import { useDialogflowPublishContext } from './hooks';
import { useDialogflowPublishStageContent } from './stages';

const DialogflowPublish: React.FC = () => {
  const publishContext = useDialogflowPublishContext();

  const { job, onPublish } = publishContext;
  const Content = useDialogflowPublishStageContent(job?.stage.type);

  useHotkey(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true });

  return (
    <JobInterface Content={Content} context={publishContext}>
      <DialogflowUploadButton DialogflowESPublishJob={job} onPublish={onPublish} />
    </JobInterface>
  );
};

export default DialogflowPublish;

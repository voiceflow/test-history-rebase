import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import DialogflowUploadButton from './components/DialogflowUploadButton';
import { useDialogflowPublishContext } from './hooks';
import { useDialogflowPublishStageContent } from './stages';

const DialogflowPublish: React.FC = () => {
  const publishContext = useDialogflowPublishContext();

  const { job, onPublish } = publishContext;
  const Content = useDialogflowPublishStageContent(job?.stage.type);

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true }, [onPublish]);

  return (
    <JobInterface Content={Content} context={publishContext}>
      <DialogflowUploadButton dialogflowPublishJob={job} onPublish={onPublish} />
    </JobInterface>
  );
};

export default DialogflowPublish;

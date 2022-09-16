import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import AlexaUploadButton from './components/AlexaUploadButton';
import { useAlexaPublishContext } from './hooks';
import { useAlexaPublishStageContent } from './stages';

const AlexaPublish: React.FC = () => {
  const publishContext = useAlexaPublishContext();

  const { job, onPublish } = publishContext;
  const Content = useAlexaPublishStageContent(job?.stage.type);

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true }, [onPublish]);

  return (
    <JobInterface Content={Content} context={publishContext}>
      <AlexaUploadButton alexaPublishJob={job} onPublish={onPublish} />
    </JobInterface>
  );
};

export default AlexaPublish;

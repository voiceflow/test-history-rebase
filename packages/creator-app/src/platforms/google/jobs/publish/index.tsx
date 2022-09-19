import React from 'react';

import JobInterface from '@/components/JobInterface';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import GoogleUploadButton from './components/GoogleUploadButton';
import { useGooglePublishContext } from './hooks';
import { useGooglePublishStageContent } from './stages';

const GooglePublish: React.FC = () => {
  const publishContext = useGooglePublishContext();

  const { job, onPublish } = publishContext;
  const Content = useGooglePublishStageContent(job?.stage.type);

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { preventDefault: true }, [onPublish]);

  return (
    <JobInterface Content={Content} context={publishContext}>
      <GoogleUploadButton googlePublishJob={job} onPublish={onPublish} />
    </JobInterface>
  );
};

export default GooglePublish;

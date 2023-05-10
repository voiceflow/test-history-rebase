import { Box, Portal } from '@voiceflow/ui';
import React from 'react';

import PageProgressBar from '@/components/PageProgressBar';
import { JobContextValue } from '@/hooks/job';
import { Job } from '@/models';
import { StageContent } from '@/platforms/types';
import { getProgress, isRunning } from '@/utils/job';

import Popup from './Popup';

export { default as DownloadStage } from './DownloadStage';
export { default as ErrorStage } from './ErrorStage';
export * from './hooks';

interface JobInterfaceProps<J extends Job<any>> {
  context: JobContextValue<J>;
  Content: StageContent<J> | null;
  progress?: number;
}

const JobInterface = <T extends Job<any>>({ context, Content, progress, children }: React.PropsWithChildren<JobInterfaceProps<T>>) => {
  const stage = context.job?.stage;

  return (
    <>
      {children}

      {Content?.Component && <Content.Component {...context} stage={stage} />}

      <Portal>
        {isRunning(context.job) && <PageProgressBar progress={progress || getProgress(context.job)} />}
        {Content?.Popup && (
          <Box position="fixed" top={78} right={22} zIndex={1000}>
            <Popup dismissable={Content.Popup.dismissable} closeable={Content.Popup.closeable} cancel={context.cancel}>
              <Content.Popup.Component {...context} stage={stage} />
            </Popup>
          </Box>
        )}
      </Portal>
    </>
  );
};

export default JobInterface;

import { Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { ProgressStage } from '@/components/PlatformUploadPopup/components';
import { JobContextValue } from '@/hooks/job';
import { Job } from '@/models';
import { StageContent } from '@/platforms/types';

import Popup from './Popup';
import { getProgress } from './utils';

export * from './hooks';

interface JobInterfaceProps<J extends Job<any>> {
  context: JobContextValue<J>;
  Content: StageContent<J> | null;
}

const JobInterface = <T extends Job<any>>({ context, Content, children }: React.PropsWithChildren<JobInterfaceProps<T>>) => {
  const stage = context.job?.stage;

  const progress = getProgress(stage);

  const popper = usePopper({
    placement: 'bottom-end',
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });

  return (
    <>
      <div ref={popper.setReferenceElement}>{children}</div>

      {Content?.Component && <Content.Component {...context} stage={stage} />}

      {Content?.Popup && (
        <div ref={popper.setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
          <Popup dismissable={Content.Popup.dismissable} closeable={Content.Popup.closeable} cancel={context.cancel}>
            <Content.Popup.Component {...context} stage={stage} />
          </Popup>
        </div>
      )}

      <Portal>
        <ProgressStage progress={progress} />
      </Portal>
    </>
  );
};

export default JobInterface;

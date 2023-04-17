import { Button, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { AlexaStageType } from '@/constants/platforms';

import { useAlexaPublishContext } from '../publish/hooks';
import { useAlexaSubmitStageContent } from './stages';

const AlexaSubmit: React.FC<{ disabled?: boolean; onClick: VoidFunction }> = ({ disabled, onClick }) => {
  const publishContext = useAlexaPublishContext({ submit: true });

  const stageType = publishContext?.job?.stage?.type;
  const Content = useAlexaSubmitStageContent(stageType);

  const AlexaSubmitButton = React.useMemo(() => {
    switch (stageType) {
      case AlexaStageType.IDLE:
      case AlexaStageType.PROGRESS:
        return (
          <Button squareRadius disabled>
            Submitting <SvgIcon icon="loader" spin inline mb={-2} ml={6} />
          </Button>
        );
      default:
        return (
          <Button disabled={disabled} onClick={onClick} squareRadius>
            Submit for Review
          </Button>
        );
    }
  }, [stageType, disabled, onClick]);

  return (
    <JobInterface Content={Content} context={publishContext}>
      {AlexaSubmitButton}
    </JobInterface>
  );
};

export default AlexaSubmit;

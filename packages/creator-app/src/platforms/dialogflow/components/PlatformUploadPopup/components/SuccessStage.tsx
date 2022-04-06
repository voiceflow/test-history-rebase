import React from 'react';

import { DownloadStage, SubmittedStage, UploadedStage } from '@/components/PlatformUploadPopup/components';
import { DialogflowExportJobSuccessType, DialogflowPublishJobSuccessType } from '@/constants/platforms';
import { DIALOGFLOW_LEARN_MORE, getDialogflowAgentUrl } from '@/constants/platforms/dialogflow';
import { DialogflowExportJob, DialogflowPublishJob, JobStageData } from '@/models';

interface SuccessStageProps {
  stage: DialogflowExportJob.SuccessStage | DialogflowPublishJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  const { googleProjectID: dialogflowProjectID } = stage.data as JobStageData<DialogflowPublishJob.SuccessStage>;

  switch (stage.data.successType) {
    case DialogflowPublishJobSuccessType.SUBMIT:
      return <SubmittedStage />;
    case DialogflowPublishJobSuccessType.UPLOAD:
      return (
        <UploadedStage
          buttonText="Test on Dialogflow"
          description="Your agent is now ready for use on the Dialogflow Console"
          learnMoreUrl={DIALOGFLOW_LEARN_MORE}
          redirectUrl={getDialogflowAgentUrl(dialogflowProjectID)}
        />
      );
    case DialogflowExportJobSuccessType.DOWNLOAD:
      return <DownloadStage cancel={cancel} stageData={stage.data} />;
    default:
      return null;
  }
};

export default SuccessStage;

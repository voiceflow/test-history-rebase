import React from 'react';

import { AlexaExportJobSuccessType, AlexaPublishJobSuccessType } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { AlexaExportJob, AlexaPublishJob, JobStageData } from '@/models';

import { DownloadStage, SubmittedStage, UploadedStage } from '../components';
import { ALEXA_LEARN_MORE_URL, ALEXA_SIMULATOR_URL } from './constants';

interface SuccessStageProps {
  stage: AlexaExportJob.SuccessStage | AlexaPublishJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  const locales = useSelector(VersionV2.active.localesSelector);
  const updateActiveVendor = useDispatch(Project.alexa.updateActiveVendor);
  const { succeededLocale, amazonID, selectedVendorID } = stage.data as JobStageData<AlexaPublishJob.SuccessStage>;

  React.useEffect(() => {
    if (!selectedVendorID) return;

    updateActiveVendor(selectedVendorID, amazonID);
  }, [amazonID]);

  const locale = (succeededLocale || locales[0] || 'en-US').replace('-', '_');

  switch (stage.data.successType) {
    case AlexaPublishJobSuccessType.SUBMIT:
      return <SubmittedStage />;
    case AlexaPublishJobSuccessType.UPLOAD:
      return (
        <UploadedStage
          buttonText="Test on Alexa"
          description="Your Skill is now ready for use on your personal Echo device, or on the Alexa developer console"
          learnMoreUrl={ALEXA_LEARN_MORE_URL}
          redirectUrl={ALEXA_SIMULATOR_URL(amazonID, locale)}
        />
      );
    case AlexaExportJobSuccessType.DOWNLOAD:
      return <DownloadStage cancel={cancel} stageData={stage.data} />;
    default:
      return null;
  }
};

export default SuccessStage;

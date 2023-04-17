import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Project from '@/ducks/project';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { AlexaPublishJob, JobStageData } from '@/models';
import { ALEXA_LEARN_MORE_URL, ALEXA_SIMULATOR_URL } from '@/platforms/alexa/constants';
import { StageComponentProps } from '@/platforms/types';

const SuccessStage: React.FC<StageComponentProps<AlexaPublishJob.SuccessStage>> = ({ stage }) => {
  const locales = useSelector(VersionV2.active.localesSelector);
  const updateActiveVendor = useDispatch(Project.alexa.updateActiveVendor);
  const { succeededLocale, amazonID, selectedVendorID } = stage.data as JobStageData<AlexaPublishJob.SuccessStage>;

  React.useEffect(() => {
    if (!selectedVendorID) return;

    updateActiveVendor(selectedVendorID, amazonID);
  }, [amazonID]);

  const locale = (succeededLocale || locales[0] || 'en-US').replace('-', '_');

  return (
    <UploadedStage
      buttonText="Test on Alexa"
      description="Your Skill is now ready for use on your Echo device, or on the Alexa developer console"
      learnMoreUrl={ALEXA_LEARN_MORE_URL}
      redirectUrl={ALEXA_SIMULATOR_URL(amazonID, locale)}
    />
  );
};

export default SuccessStage;

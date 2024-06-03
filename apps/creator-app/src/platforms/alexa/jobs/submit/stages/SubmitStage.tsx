import { Box, Link, Modal } from '@voiceflow/ui';
import React from 'react';

import { takeoffGraphic } from '@/assets';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import manager from '@/ModalsV2/manager';
import { AlexaPublishJob } from '@/models';
import { ALEXA_SUBMISSION_URL } from '@/platforms/alexa/constants';
import { StageComponentProps } from '@/platforms/types';

interface SubmitForReviewModalProps {
  skillID: string;
  locale: string;
}

const SubmitForReviewModal = manager.create<SubmitForReviewModalProps>(
  'SubmitForReview',
  () =>
    ({ skillID, locale, api, type, opened, hidden, animated }) => (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={392}>
        <Box.FlexCenter p={36} flexDirection="column" textAlign="center" color="#8da2b5">
          <img id="rocket" alt="submitted" height={120} src={takeoffGraphic} />

          <Box mt={24}>
            Your agent has been submitted for review. During this time, you will not be able to make any additional
            uploads.
          </Box>
          <Box mt={16}>
            <Link href={ALEXA_SUBMISSION_URL(skillID, locale)} target="_blank" rel="noopener noreferrer">
              Check the status of your submission.
            </Link>
          </Box>
        </Box.FlexCenter>
      </Modal>
    )
);

const SubmitForReview: React.FC<StageComponentProps<AlexaPublishJob.SuccessStage>> = ({ cancel, stage }) => {
  const submitForReviewModal = ModalsV2.useModal(SubmitForReviewModal);
  const locales = useSelector(VersionV2.active.localesSelector);

  const skillID = stage.data.amazonID;
  const locale = (stage.data.succeededLocale || locales[0] || 'en-US').replace('-', '_');

  React.useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    submitForReviewModal.openVoid({ skillID, locale }).then(() => cancel());

    return () => {
      submitForReviewModal.close();
    };
  }, []);

  return null;
};

export default SubmitForReview;

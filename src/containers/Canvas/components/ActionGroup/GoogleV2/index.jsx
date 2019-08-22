/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Button from '@/components/Button';
import UploadGoogle from '@/containers/Publish/Upload/Google';
import { checkGoogleAccount } from '@/ducks/account';
import { GOOGLE_STAGES, GOOGLE_STATES, resetGoogleUpload } from '@/ducks/publish/google';

import { PopupContainer, PopupTransition } from '../styled';
import UploadButton from './UploadButton';

const GoogleActionGroup = (props) => {
  const { stage, id, google, checkGoogleAccount, resetGoogleUpload } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (stage === GOOGLE_STAGES.IDLE) setOpen(false);
    else if (GOOGLE_STATES[stage].end) setOpen(true);
  }, [stage, id]);

  useEffect(() => {
    if (!google) {
      (async () => {
        await checkGoogleAccount();
      })();
    }
    // reset state on unmount
    return resetGoogleUpload;
  }, []);
  // transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-450px)')};
  // transition: transform 0.13s ease;
  return (
    <>
      <UploadButton setPopup={setOpen} />
      <PopupContainer open={open}>
        <Button className="close close-upload-success-popup" onClick={() => setOpen(false)} />
        <PopupTransition>
          <UploadGoogle />
        </PopupTransition>
      </PopupContainer>
    </>
  );
};

export default connect(
  (state) => ({
    stage: state.publish.google.stage,
    id: state.publish.google.id,
    google: state.account.google,
  }),
  {
    resetGoogleUpload,
    checkGoogleAccount,
  }
)(GoogleActionGroup);

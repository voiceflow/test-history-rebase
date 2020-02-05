/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import UploadAlexa from '@/containers/Publish/Upload/Alexa';
import { checkAmazonAccount, getVendors } from '@/ducks/account';
import { ALEXA_STAGES, ALEXA_STATES, resetAlexaUpload } from '@/ducks/publish/alexa';

import { Close, PopupContainer, PopupTransition } from '../styled';
import UploadButton from './UploadButton';

const AlexaActionGroup = (props) => {
  const { stage, id, amazon, checkAmazonAccount, getVendors, resetAlexaUpload } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (stage === ALEXA_STAGES.IDLE) setOpen(false);
    else if (ALEXA_STATES[stage].end) setOpen(true);
  }, [stage, id]);

  useEffect(() => {
    if (!amazon) {
      (async () => {
        await checkAmazonAccount();
        await getVendors();
      })();
    }
    // reset state on unmount
    return resetAlexaUpload;
  }, [amazon, checkAmazonAccount, getVendors, resetAlexaUpload]);

  return (
    <>
      <UploadButton setPopup={setOpen} />
      <PopupContainer open={open}>
        <Close onClick={() => setOpen(false)} />
        <PopupTransition>
          <UploadAlexa />
        </PopupTransition>
      </PopupContainer>
    </>
  );
};

export default connect(
  (state) => ({
    stage: state.publish.alexa.stage,
    id: state.publish.alexa.id,
    amazon: state.account.amazon,
  }),
  {
    resetAlexaUpload,
    checkAmazonAccount,
    getVendors,
  }
)(AlexaActionGroup);

import React from 'react';

import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import UploadAlexa from '@/pages/Publish/Upload/Alexa';

import UploadPopup from '../UploadPopup';
import Upload from './Upload';

const AlexaActionGroup = (props) => {
  const { alexaPublish, amazon, checkAmazonAccount, syncVendors, resetAlexaUpload } = props;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const stageState = AlexaPublish.ALEXA_STATES[alexaPublish.stage];

    if (alexaPublish.stage === AlexaPublish.ALEXA_STAGES.IDLE) {
      setOpen(false);
    } else if (stageState.end) {
      setOpen(true);
    }
  }, [alexaPublish.stage, alexaPublish.id]);

  React.useEffect(() => {
    if (!amazon) {
      (async () => {
        await checkAmazonAccount();
        await syncVendors();
      })();
    }
    // reset state on unmount
    return resetAlexaUpload;
  }, [amazon, checkAmazonAccount, syncVendors, resetAlexaUpload]);

  return (
    <>
      <Upload setPopup={setOpen} />

      <UploadPopup open={open} onClose={() => setOpen(false)}>
        <UploadAlexa />
      </UploadPopup>
    </>
  );
};

const mapStateToProps = {
  alexaPublish: AlexaPublish.publishStateSelector,
  amazon: Account.amazonAccountSelector,
};

const mapDispatchToProps = {
  resetAlexaUpload: AlexaPublish.resetAlexaUpload,
  checkAmazonAccount: Account.checkAmazonAccount,
  syncVendors: AlexaPublish.syncVendors,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlexaActionGroup);

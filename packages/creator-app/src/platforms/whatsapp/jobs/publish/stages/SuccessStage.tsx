import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import { WHATSAPP_DOCUMENTATION } from '@/constants/platforms';
import { PrototypeJobContext } from '@/contexts';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector, useSyncProjectLiveVersion } from '@/hooks';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';
import { openInternalURLInANewTab } from '@/utils/window';

import { createWidgetSessionKey } from '../utils';

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = ({ cancel }) => {
  useSyncProjectLiveVersion();

  const projectID = useSelector(Session.activeProjectIDSelector);

  const prototypeJob = React.useContext(PrototypeJobContext);

  const [firstTime, setFirstTime] = useLocalStorageState<boolean>(createWidgetSessionKey(projectID!), true);

  const goToConsole = useDispatch(Router.goToActivePlatformPublish);

  return firstTime ? (
    <UploadedStage
      title="Connect to WhatsApp"
      description="Connect your assistant to your WhatsApp Business account"
      imageProps={{
        src: linkGraphic,
        height: 67,
      }}
    >
      <Button squareRadius fullWidth onClick={goToConsole}>
        Connect to WhatsApp
      </Button>
      <Box mt={8} />
      <Button
        squareRadius
        fullWidth
        variant={ButtonVariant.QUATERNARY}
        onClick={() => {
          setFirstTime(false);
          cancel();
        }}
      >
        I've Already Done This
      </Button>
    </UploadedStage>
  ) : (
    <UploadedStage description="A new version of your assistant has been published to WhatsApp">
      <Button fullWidth onClick={Utils.functional.chainVoid(prototypeJob?.start, cancel)}>
        Test on WhatsApp
      </Button>
      <Box mt={8} />
      <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={() => openInternalURLInANewTab(WHATSAPP_DOCUMENTATION)}>
        See Documentation
      </Button>
    </UploadedStage>
  );
};

export default SuccessStage;

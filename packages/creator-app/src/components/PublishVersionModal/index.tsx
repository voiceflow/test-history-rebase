import * as Platform from '@voiceflow/platform-config';
import { Link } from '@voiceflow/ui';
import React from 'react';

import InputModal from '@/components/InputModal';
import { ModalType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { useModals } from '@/hooks/modals';
import { isPlatformWithThirdPartyUpload } from '@/utils/typeGuards';

export interface PublishVersionModalData {
  onConfirm: (versionName: string) => void;
}

const PublishVersionModal: React.FC = () => {
  const {
    close,
    isOpened,
    data: { onConfirm },
  } = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  const platform = useSelector(ProjectV2.active.platformSelector);

  const headerText = React.useMemo(() => (isPlatformWithThirdPartyUpload(platform) ? 'Upload new version' : 'Publish for production'), [platform]);

  const goToCurrentPublish = useDispatch(Router.goToActivePlatformPublish);

  const onLinkClick = () => {
    close();
    goToCurrentPublish();
  };

  const bodyText = React.useMemo(
    () =>
      isPlatformWithThirdPartyUpload(platform) ? (
        `This action will upload a new version to ${Platform.Config.get(platform).name}. Confirm you want to continue.`
      ) : (
        <>
          Publish this version to production and use it with our <Link onClick={onLinkClick}>Dialog Manager API</Link>.
        </>
      ),
    [platform]
  );

  const confirmText = React.useMemo(() => (isPlatformWithThirdPartyUpload(platform) ? 'Upload' : 'Publish'), [platform]);

  return (
    <InputModal
      modalType={ModalType.PUBLISH_VERSION_MODAL}
      data={{
        canCancel: true,
        header: headerText,
        body: <div style={{ marginBottom: 16 }}>{bodyText}</div>,
        style: {
          modalContainer: {
            maxWidth: 392,
            capitalizeText: false,
          },
        },
        confirm: {
          text: confirmText,
          onClick: onConfirm,
        },
        input: {
          placeholder: 'Enter version name (optional)',
        },
      }}
      close={close}
      isOpened={isOpened}
    />
  );
};

export default PublishVersionModal;

import React from 'react';

import InputModal from '@/components/InputModal';
import { ModalType } from '@/constants';
import { getPlatformName } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
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

  const headerText = React.useMemo(() => (isPlatformWithThirdPartyUpload(platform) ? 'Upload new version' : 'Publish new version'), [platform]);

  const bodyText = React.useMemo(
    () =>
      isPlatformWithThirdPartyUpload(platform)
        ? `This action will upload a new version to ${getPlatformName(platform)}. Confirm you want to continue.`
        : 'This action will publish a new version. Please confirm you want to continue.',
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

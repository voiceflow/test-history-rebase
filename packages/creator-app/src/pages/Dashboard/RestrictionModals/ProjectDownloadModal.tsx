import { ModalBoldText } from '@ui';
import React from 'react';

import { projectDownloadGraphic } from '@/assets';
import { ModalType } from '@/constants';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const ProjectDownloadModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.PROJECT_DOWNLOAD}
    header="Project Download"
    icon={projectDownloadGraphic}
    bodyContent={
      <>
        This is a <ModalBoldText>Pro</ModalBoldText> feature. Please upgrade your workspace to access downloadable link.
      </>
    }
  />
);

export default ProjectDownloadModal;

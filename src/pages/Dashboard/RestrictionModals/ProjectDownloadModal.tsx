import React from 'react';

import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const ProjectDownloadModal: React.FC = () => {
  return (
    <BaseModal
      modalType={ModalType.PROJECT_DOWNLOAD}
      header="Project Download"
      icon="/project-download.svg"
      bodyContent={
        <>
          This is a <BoldText>Pro</BoldText> feature. Please upgrade your workspace to access downloadable link.
        </>
      }
    />
  );
};

export default ProjectDownloadModal;

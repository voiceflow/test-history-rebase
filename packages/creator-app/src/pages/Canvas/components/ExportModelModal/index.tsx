import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { MODEL_EXPORT } from '@/config/documentation';
import { ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useModals } from '@/hooks';
import { ExportFooter } from '@/pages/Project/components/Header/components/SharePopper/components/Export';
import { Model } from '@/pages/Project/components/Header/components/SharePopper/components/Export/components';

const ExportModelModal: React.OldFC = () => {
  const { data } = useModals<{ checkedItems: string[] }>(ModalType.EXPORT_MODEL);

  return (
    <Modal id={ModalType.EXPORT_MODEL} title="NLU Export" headerBorder maxWidth={450}>
      <ModalBody>
        <Model selectedIntentsIds={data.checkedItems} />
      </ModalBody>
      <ModalFooter onClick={stopImmediatePropagation()}>
        <ExportFooter
          selectedItems={data.checkedItems}
          origin={Tracking.ModelExportOriginType.NLU_MANAGER}
          withoutLink={true}
          linkURL={MODEL_EXPORT}
        />
      </ModalFooter>
    </Modal>
  );
};

export default ExportModelModal;

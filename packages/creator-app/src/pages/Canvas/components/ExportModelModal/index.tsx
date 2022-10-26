import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { MODEL_EXPORT } from '@/config/documentation';
import { ModalType } from '@/constants';
import * as Export from '@/ducks/export';
import * as Tracking from '@/ducks/tracking';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { ExportFooter } from '@/pages/Project/components/Header/components/SharePopper/components/Export/';
import { Model } from '@/pages/Project/components/Header/components/SharePopper/components/Export/components';
import { ConnectedProps } from '@/types';

const ExportModelModal: React.FC<ConnectedExportModelModalProps> = () => {
  const { data } = useModals<{ checkedItems: string[] }>(ModalType.EXPORT_MODEL);

  return (
    <Modal id={ModalType.EXPORT_MODEL} title="NLU Export" headerBorder>
      <ModalBody>
        <Model selectedIntentsIds={data.checkedItems} />
      </ModalBody>
      <ModalFooter onClick={stopImmediatePropagation()}>
        <ExportFooter origin={Tracking.ModelExportOriginType.NLU_MANAGER} withoutLink={true} linkURL={MODEL_EXPORT} />
      </ModalFooter>
    </Modal>
  );
};

const mapDispatchToProps = {
  exportModel: Export.exportModel,
};

type ConnectedExportModelModalProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ExportModelModal);

import React from 'react';

import { InteractionModelTabType, ModalType } from '@/constants';
import { useDidUpdateEffect, useModals } from '@/hooks';

import UncontrolledInteractionModel from './UncontrolledInteractionModel';

const NonRouteImm: React.FC = () => {
  const { data }: { data: { initialSelectedID?: string; newUtterance?: string } } = useModals(ModalType.INTERACTION_MODEL);

  const [activeTab, setActiveTab] = React.useState(InteractionModelTabType.INTENTS);
  const { toggle: toggleExportModel } = useModals(ModalType.EXPORT_MODEL);
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const [selectedID, setSelectedID] = React.useState('');

  useDidUpdateEffect(() => {
    if (data.initialSelectedID) {
      setSelectedID(data.initialSelectedID);
    }
  }, [data.initialSelectedID]);

  const onSetSelectedTypeAndID = React.useCallback((type: InteractionModelTabType, id: string) => {
    setActiveTab(type);
    setSelectedID(id);
  }, []);

  return (
    <UncontrolledInteractionModel
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      openExportModal={toggleExportModel}
      setModalRef={setModalRef}
      modalRef={modalRef}
      selectedID={selectedID}
      onSetSelectedID={setSelectedID}
      onSetSelectedTypeAndID={onSetSelectedTypeAndID}
      newUtterance={data.newUtterance}
    />
  );
};

export default NonRouteImm;

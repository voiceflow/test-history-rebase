import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { matchPath, RouteComponentProps, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { ConnectedProps } from '@/types';

import UncontrolledInteractionModel from './UncontrolledInteractionModel';

const InteractionModelModal: React.FC<RouteComponentProps<{ modelType: InteractionModelTabType }> & InteractionModelModalConnectedProps> = ({
  compilePrototype,
  goToCurrentCanvas,
  goInteractionModel,
  goInteractionModelEntity,
}) => {
  const location = useLocation();
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const modelMatch = React.useMemo(
    () =>
      matchPath<{ modelType: InteractionModelTabType; modelEntityID?: string }>(location.pathname, {
        path: [Path.CANVAS_MODEL_ENTITY, Path.CANVAS_MODEL],
      }),
    [location.pathname]
  );

  const activeTab = modelMatch?.params.modelType ?? InteractionModelTabType.INTENTS;

  const { open, close, isInStack } = useModals(ModalType.INTERACTION_MODEL);
  const { toggle: toggleExportModel } = useModals(ModalType.EXPORT_MODEL);

  const onChangeTab = React.useCallback((nextTab: string) => {
    goInteractionModel(nextTab as InteractionModelTabType);
  }, []);

  const onSetSelectedID = React.useCallback(
    (id: string) => {
      goInteractionModelEntity(activeTab, id);
    },
    [activeTab]
  );

  const onSetSelectedTypeAndID = React.useCallback((type: InteractionModelTabType, id: string) => {
    goInteractionModelEntity(type, id);
  }, []);

  const openExportModal = async () => {
    toggleExportModel();
    await compilePrototype({ aborted: false });
  };

  React.useEffect(() => {
    if (!!modelMatch && !isInStack) {
      open();
    } else if (!modelMatch && isInStack) {
      close();
    }
  }, [!!modelMatch]);

  useDidUpdateEffect(() => {
    if (isInStack && !modelMatch) {
      goInteractionModel(InteractionModelTabType.INTENTS);
    } else if (!isInStack && modelMatch) {
      goToCurrentCanvas();
    }
  }, [isInStack]);

  return (
    <UncontrolledInteractionModel
      activeTab={activeTab}
      onChangeTab={onChangeTab}
      openExportModal={openExportModal}
      setModalRef={setModalRef}
      modalRef={modalRef}
      onSetSelectedID={onSetSelectedID}
      onSetSelectedTypeAndID={onSetSelectedTypeAndID}
      selectedID={modelMatch?.params.modelEntityID}
    />
  );
};

const mapDispatchToProps = {
  goToCurrentCanvas: Router.goToCurrentCanvas,
  goInteractionModel: Router.goToCurrentCanvasInteractionModel,
  goInteractionModelEntity: Router.goToCurrentCanvasInteractionModelEntity,
  compilePrototype: Prototype.compilePrototype,
};

export type InteractionModelModalConnectedProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(InteractionModelModal) as React.FC;

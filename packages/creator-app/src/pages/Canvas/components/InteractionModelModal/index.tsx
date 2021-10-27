import { useCachedValue, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { matchPath, RouteComponentProps, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/session';
import { connect } from '@/hocs';
import { useModals, useSelector, useSessionStorageState } from '@/hooks';
import { ConnectedProps } from '@/types';

import UncontrolledInteractionModel from './UncontrolledInteractionModel';

export const IMM_PERSISTED_STATE_KEY = 'IMM_PERSIST_KEY';

const InteractionModelModal: React.FC<RouteComponentProps<{ modelType: InteractionModelTabType }> & InteractionModelModalConnectedProps> = ({
  compilePrototype,
  goToCurrentCanvas,
  goInteractionModel,
  goInteractionModelEntity,
}) => {
  const location = useLocation();
  const activeProjectID = useSelector(activeProjectIDSelector)!;
  const [immPersistedState, setIMMPersistedState] = useSessionStorageState<{ tab: InteractionModelTabType; id: string | null }>(
    `${IMM_PERSISTED_STATE_KEY}-${activeProjectID}`,
    {
      tab: InteractionModelTabType.INTENTS,
      id: null,
    }
  );
  const persistedStateRef = useCachedValue(immPersistedState);
  const { open, close, isInStack } = useModals(ModalType.INTERACTION_MODEL);
  const { toggle: toggleExportModel } = useModals(ModalType.EXPORT_MODEL);
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const modelMatch = React.useMemo(() => {
    return matchPath<{ modelType: InteractionModelTabType; modelEntityID?: string }>(location.pathname, {
      path: [Path.CANVAS_MODEL_ENTITY, Path.CANVAS_MODEL],
    });
  }, [location.pathname]);

  const activeTab = modelMatch?.params.modelType ?? InteractionModelTabType.INTENTS;

  const handleSetPersistState = (tab: InteractionModelTabType, id: string | null) => {
    const persistedState = { tab, id };
    setIMMPersistedState(persistedState);
  };

  const onChangeTab = React.useCallback((nextTab: string) => {
    handleSetPersistState(nextTab as InteractionModelTabType, null);
    goInteractionModel(nextTab as InteractionModelTabType);
  }, []);

  const onSetSelectedID = React.useCallback(
    (id: string) => {
      handleSetPersistState(activeTab, id);
      goInteractionModelEntity(activeTab, id);
    },
    [activeTab]
  );

  const onSetSelectedTypeAndID = React.useCallback((type: InteractionModelTabType, id: string) => {
    handleSetPersistState(type, id);
    goInteractionModelEntity(type, id);
  }, []);

  const openExportModal = async () => {
    toggleExportModel();
    await compilePrototype({ aborted: false });
  };

  // When IMM gets opened with a variable click (with a target item)
  React.useEffect(() => {
    if (!!modelMatch && !isInStack) {
      open();
    } else if (!modelMatch && isInStack) {
      close();
    }
  }, [!!modelMatch]);

  // When IMM gets opened via hotkey / nav button
  useDidUpdateEffect(() => {
    if (isInStack && !modelMatch) {
      const persistedState = persistedStateRef.current;
      const { tab: persistedTab, id: persistedID } = persistedState;
      if (persistedTab && persistedID) {
        goInteractionModelEntity(persistedTab, persistedID);
      } else if (persistedTab) {
        goInteractionModel(persistedTab);
      } else {
        goInteractionModel(InteractionModelTabType.INTENTS);
      }
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

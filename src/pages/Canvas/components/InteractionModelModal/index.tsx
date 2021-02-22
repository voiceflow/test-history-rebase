import React from 'react';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
import Tabs from '@/components/Tabs';
import { Path } from '@/config/routes';
import { IconVariant, InteractionModelTabType, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import * as Router from '@/ducks/router';
import { compose, connect } from '@/hocs';
import { useDidUpdateEffect, useModals } from '@/hooks';
import { ConnectedProps } from '@/types';

import { IntentsManager, Modal, ModalContent, SlotsManager, VariablesManager } from './components';
import { TABS } from './constants';

const InteractionModelModal: React.FC<RouteComponentProps<{ modelType: InteractionModelTabType }> & InteractionModelModalConnectedProps> = ({
  match,
  history,
  location,
  goToCurrentCanvas,
  goInteractionModel,
  goInteractionModelEntity,
}) => {
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

  const onChangeTab = React.useCallback(
    (nextTab: string) => {
      goInteractionModel(nextTab as InteractionModelTabType);
    },
    [match, history]
  );

  const onSetSelectedID = React.useCallback(
    (id: string) => {
      goInteractionModelEntity(activeTab, id);
    },
    [activeTab]
  );

  React.useEffect(() => {
    if (!!modelMatch && !isInStack) {
      open();
    } else if (!modelMatch && isInStack) {
      close();
    }
  }, [!!modelMatch]);

  useDidUpdateEffect(() => {
    if (isInStack && !modelMatch) {
      goInteractionModel(match.params.modelType);
    } else if (!isInStack && modelMatch) {
      goToCurrentCanvas();
    }
  }, [isInStack]);

  return (
    <Modal
      id={ModalType.INTERACTION_MODEL}
      ref={setModalRef}
      title={<Tabs selected={activeTab} options={TABS} onChange={onChangeTab} />}
      icon={<SvgIcon icon="exportModel" variant={IconVariant.STANDARD} clickable size={16} onClick={() => toggleExportModel()} />}
      isSmall={false}
    >
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <ModalContent>
            {activeTab === InteractionModelTabType.SLOTS && (
              <SlotsManager selectedID={modelMatch?.params.modelEntityID} setSelectedID={onSetSelectedID} />
            )}
            {activeTab === InteractionModelTabType.INTENTS && (
              <IntentsManager selectedID={modelMatch?.params.modelEntityID} setSelectedID={onSetSelectedID} />
            )}
            {activeTab === InteractionModelTabType.VARIABLES && (
              <VariablesManager selectedID={modelMatch?.params.modelEntityID} setSelectedID={onSetSelectedID} />
            )}
          </ModalContent>
        </TextEditorVariablesPopoverProvider>
      )}
    </Modal>
  );
};

const mapDispatchToProps = {
  goToCurrentCanvas: Router.goToCurrentCanvas,
  goInteractionModel: Router.goToCurrentCanvasInteractionModel,
  goInteractionModelEntity: Router.goToCurrentCanvasInteractionModelEntity,
};

export type InteractionModelModalConnectedProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default compose(connect(null, mapDispatchToProps), withRouter as any)(InteractionModelModal) as React.FC;

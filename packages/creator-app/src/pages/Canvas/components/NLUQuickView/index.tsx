import { Utils } from '@voiceflow/common';
import { Box, withProvider } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { InteractionModelTabType, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import * as Tracking from '@/ducks/tracking';
import { useLinkedState } from '@/hooks';
import EditEntityForm from '@/pages/Canvas/components/EntityModalsV2/components/EntityForm/EditEntityForm';
import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';
import VariablesSection from '@/pages/Canvas/components/NLUQuickView/components/VariablesSection';

import { TitleInput } from './components';
import EmptyView from './components/EmptyView';
import Loading from './components/Loading';
import Sidebar from './components/Sidebar';
import { tabHeaderComponentsMap } from './constants';
import { NLUQuickViewContext, NLUQuickViewProvider } from './context';
import { useShowForms } from './hooks';

const NLUQuickView: React.FC = () => {
  const {
    title,
    activeTab,
    selectedID,
    isCreatingItem,
    triggerNewInlineIntent,
    triggerNewInlineEntity,
    canRenameItem,
    setIsActiveItemRename,
    onNameChange,
    nameChangeTransform,
  } = React.useContext(NLUQuickViewContext);

  const { showIntentForm, showEntityForm, showVariableForm, isEmpty } = useShowForms();

  const [modalTitle, setModalTitle] = useLinkedState(title);
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

  const emptyHeader = isCreatingItem || isEmpty;
  const EmptyBody = isCreatingItem ? Loading : EmptyView;

  const handleEmptyPageCreate = React.useCallback(() => {
    const tabHandlers: Record<InteractionModelTabType, () => void> = {
      [InteractionModelTabType.INTENTS]: triggerNewInlineIntent,
      [InteractionModelTabType.SLOTS]: triggerNewInlineEntity,
      [InteractionModelTabType.VARIABLES]: Utils.functional.noop,
    };
    tabHandlers[activeTab] && tabHandlers[activeTab]();
  }, [activeTab, triggerNewInlineEntity, triggerNewInlineEntity]);

  const HeaderOptionsComponent = tabHeaderComponentsMap[activeTab];

  return (
    <Modal
      ref={setModalRef}
      leftSidebar={() => <Sidebar />}
      maxWidth={740}
      id={ModalType.NLU_MODEL_QUICK_VIEW}
      title={
        <TitleInput
          value={emptyHeader ? '' : modalTitle}
          onBlur={() => onNameChange(modalTitle, selectedID)}
          onChangeText={(text) => setModalTitle(nameChangeTransform(text, activeTab))}
          placeholder={emptyHeader ? '' : 'Name'}
          onEnterPress={() => onNameChange(modalTitle, selectedID)}
          disabled={emptyHeader || !canRenameItem(selectedID, activeTab)}
        />
      }
      headerBorder
      headerActions={
        emptyHeader ? null : <HeaderOptionsComponent onRename={() => setIsActiveItemRename(true)} selectedID={selectedID} itemType={activeTab} />
      }
    >
      <Box width="100%" overflow="auto" height="calc(100vh - 120px)">
        {emptyHeader ? (
          <EmptyBody onCreate={handleEmptyPageCreate} pageType={activeTab} />
        ) : (
          !!modalRef && (
            <TextEditorVariablesPopoverProvider value={modalRef}>
              {showIntentForm && <EditIntentForm intentID={selectedID} />}
              {showEntityForm && (
                <EditEntityForm slotID={selectedID} withNameSection={false} withBottomDivider creationType={Tracking.NLUEntityCreationType.IMM} />
              )}
              {showVariableForm && <VariablesSection />}
            </TextEditorVariablesPopoverProvider>
          )
        )}
      </Box>
    </Modal>
  );
};

export default withProvider(NLUQuickViewProvider)(NLUQuickView);

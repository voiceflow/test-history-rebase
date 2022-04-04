import { Box, withProvider } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { useLinkedState } from '@/hooks';
import EditEntityForm from '@/pages/Canvas/components/EntityModalsV2/components/EntityForm/EditEntityForm';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';
import VariablesSection from '@/pages/Canvas/components/NLUQuickView/components/VariablesSection';

import { TitleInput } from './components';
import EmptyView from './components/EmptyView';
import HeaderOptions from './components/HeaderOptions';
import Loading from './components/Loading';
import Sidebar from './components/Sidebar';
import { NLUQuickViewContext, NLUQuickViewProvider } from './context';
import { useShowForms } from './hooks';

const NLUQuickView: React.FC = () => {
  const { title, activeTab, selectedID, isCreatingItem, canRenameItem, setIsActiveItemRename, onNameChange, nameChangeTransform } =
    React.useContext(NLUQuickViewContext);

  const { showIntentForm, showEntityForm, showVariableForm, isEmpty } = useShowForms();

  const [modalTitle, setModalTitle] = useLinkedState(title);

  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

  const emptyHeader = isCreatingItem || isEmpty;
  const EmptyBody = isCreatingItem ? Loading : EmptyView;

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
      headerActions={emptyHeader ? null : <HeaderOptions setIsActiveItemRename={setIsActiveItemRename} selectedID={selectedID} />}
    >
      <Box width="100%" overflow="auto" height="calc(100vh - 120px)">
        {emptyHeader ? (
          <EmptyBody />
        ) : (
          !!modalRef && (
            <TextEditorVariablesPopoverProvider value={modalRef}>
              {showIntentForm && <IntentForm intentID={selectedID} withNameSection={false} />}
              {showEntityForm && <EditEntityForm slotID={selectedID} withNameSection={false} />}
              {showVariableForm && <VariablesSection />}
            </TextEditorVariablesPopoverProvider>
          )
        )}
      </Box>
    </Modal>
  );
};

export default withProvider(NLUQuickViewProvider)(NLUQuickView);

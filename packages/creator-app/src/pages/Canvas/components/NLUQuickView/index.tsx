import { Utils } from '@voiceflow/common';
import { Box, SectionV2, System, withProvider } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { InteractionModelTabType, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts/TextEditorVariablesPopoverContext';
import * as Tracking from '@/ducks/tracking';
import { useLinkedState, useTrackingEvents } from '@/hooks';
import EditEntityForm from '@/pages/Canvas/components/EntityForm/EditEntityForm';
import EntityPromptForm from '@/pages/Canvas/components/EntityPromptForm';
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
    onNameChange,
    canRenameItem,
    isCreatingItem,
    onEnterEntityPrompt,
    nameChangeTransform,
    setIsActiveItemRename,
    triggerNewInlineIntent,
    triggerNewInlineEntity,
    onIntentEntityPromptBack,
    intentEntityPromptSlotID,
    intentEntityPromptAutogenerate,
  } = React.useContext(NLUQuickViewContext);

  const { showIntentForm, showEntityForm, showVariableForm, isEmpty } = useShowForms();

  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const [modalTitle, setModalTitle] = useLinkedState(title);
  const [trackingEvents] = useTrackingEvents();

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

  const onChangeName = (text: string) => {
    setModalTitle(nameChangeTransform(text, activeTab));

    if (activeTab === InteractionModelTabType.INTENTS) {
      trackingEvents.trackIntentEdit({ creationType: Tracking.IntentEditType.IMM });
    }
  };

  return (
    <Modal
      id={ModalType.NLU_MODEL_QUICK_VIEW}
      ref={setModalRef}
      maxWidth={740}
      leftSidebar={() => <Sidebar />}
      title={
        <>
          {showIntentForm && intentEntityPromptSlotID && (
            <System.IconButtonsGroup.Base mr={12}>
              <System.IconButton.Base icon="largeArrowLeft" onClick={() => onIntentEntityPromptBack()} />
            </System.IconButtonsGroup.Base>
          )}

          <TitleInput
            value={emptyHeader ? '' : modalTitle}
            onBlur={() => onNameChange(modalTitle, selectedID)}
            readOnly={!!showIntentForm && !!intentEntityPromptSlotID}
            disabled={emptyHeader || !canRenameItem(selectedID, activeTab)}
            placeholder={emptyHeader ? '' : 'Name'}
            onChangeText={onChangeName}
            onEnterPress={() => onNameChange(modalTitle, selectedID)}
          />
        </>
      }
      headerBorder
      headerActions={
        emptyHeader ? null : <HeaderOptionsComponent onRename={() => setIsActiveItemRename(true)} selectedID={selectedID} itemType={activeTab} />
      }
      contentStyle={{ maxWidth: 'calc(100vw - 280px)', overflowX: 'hidden' }}
    >
      <Box
        // should remount when selectedID changes, otherwise, it can use the wrong intentID to patch the intent
        key={selectedID}
        width="100%"
        overflowY="auto"
        height="calc(100vh - 120px)"
      >
        {emptyHeader ? (
          <EmptyBody onCreate={handleEmptyPageCreate} pageType={activeTab} />
        ) : (
          !!modalRef && (
            <TextEditorVariablesPopoverProvider value={modalRef}>
              {showIntentForm &&
                (intentEntityPromptSlotID ? (
                  <>
                    <EntityPromptForm intentID={selectedID} entityID={intentEntityPromptSlotID} autogenerate={intentEntityPromptAutogenerate} />
                    <SectionV2.Divider />
                  </>
                ) : (
                  <EditIntentForm
                    intentID={selectedID}
                    creationType={Tracking.IntentEditType.IMM}
                    onEnterEntityPrompt={onEnterEntityPrompt}
                    utteranceCreationType={Tracking.CanvasCreationType.IMM}
                  />
                ))}

              {showEntityForm && (
                <EditEntityForm
                  key={selectedID}
                  slotID={selectedID}
                  creationType={Tracking.NLUEntityCreationType.IMM}
                  withNameSection={false}
                  withBottomDivider
                />
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

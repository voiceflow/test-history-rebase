import { Utils } from '@voiceflow/common';
import { Box, compose, Modal, SectionV2, System, withProvider } from '@voiceflow/ui';
import React from 'react';

import EntityPromptForm from '@/components/LegacyNLU/EntityPromptForm';
import { InteractionModelTabType } from '@/constants';
import { NLUProvider } from '@/contexts/NLUContext';
import { TextEditorVariablesPopoverProvider } from '@/contexts/TextEditorVariablesPopoverContext';
import * as Tracking from '@/ducks/tracking';
import { useLinkedState, useTrackingEvents } from '@/hooks';
import EditEntityForm from '@/pages/Canvas/components/EntityForm/EditEntityForm';

import manager from '../../../manager';
import { VoidInternalProps } from '../../../types';
import EditIntentForm from '../Intent/components/EditIntentForm';
import { TitleInput } from './components';
import EmptyView from './components/EmptyView';
import Loading from './components/Loading';
import Sidebar from './components/Sidebar';
import VariablesSection from './components/VariablesSection';
import { tabHeaderComponentsMap } from './constants';
import { NLUQuickViewContext, NLUQuickViewProvider } from './context';
import { useShowForms } from './hooks';

const QuickView = manager.create('NLUQuickView', () =>
  compose(
    withProvider(NLUProvider),
    withProvider(NLUQuickViewProvider)
  )(({ api, type, opened, hidden, animated }: VoidInternalProps) => {
    const {
      title,
      activeTab,
      urlSynced,
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
        [InteractionModelTabType.SLOTS]: triggerNewInlineEntity,
        [InteractionModelTabType.INTENTS]: triggerNewInlineIntent,
        [InteractionModelTabType.VARIABLES]: Utils.functional.noop,
      };

      tabHandlers[activeTab]();
    }, [activeTab, triggerNewInlineEntity, triggerNewInlineEntity]);

    const HeaderOptionsComponent = tabHeaderComponentsMap[activeTab];

    const onChangeName = (text: string) => {
      setModalTitle(nameChangeTransform(text, activeTab));

      if (activeTab === InteractionModelTabType.INTENTS) {
        trackingEvents.trackIntentEdit({ creationType: Tracking.IntentEditType.IMM });
      }
    };

    return (
      <Modal ref={setModalRef} type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={740}>
        {urlSynced && (
          <Box.Flex alignItems="flex-start">
            <Sidebar onClose={api.onClose} />

            <Box flex={10} maxWidth="calc(100vw - 280px)" overflowX="hidden">
              <Modal.Header
                border
                actions={
                  activeTab !== InteractionModelTabType.VARIABLES &&
                  !emptyHeader && (
                    <System.IconButtonsGroup.Base>
                      <HeaderOptionsComponent onRename={() => setIsActiveItemRename(true)} selectedID={selectedID} itemType={activeTab} />
                    </System.IconButtonsGroup.Base>
                  )
                }
              >
                <Box.Flex py={2}>
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
                </Box.Flex>
              </Modal.Header>

              <Box
                // should remount when selectedID changes, otherwise, it can use the wrong intentID to patch the intent
                key={selectedID}
                flex={10}
                width="100%"
                height="calc(100vh - 120px)"
                overflowY="auto"
              >
                {emptyHeader ? (
                  <EmptyBody onCreate={handleEmptyPageCreate} pageType={activeTab} />
                ) : (
                  !!modalRef && (
                    <TextEditorVariablesPopoverProvider value={modalRef}>
                      {showIntentForm &&
                        (intentEntityPromptSlotID ? (
                          <>
                            <EntityPromptForm
                              intentID={selectedID}
                              entityID={intentEntityPromptSlotID}
                              autogenerate={intentEntityPromptAutogenerate}
                            />
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
            </Box>
          </Box.Flex>
        )}
      </Modal>
    );
  })
);

export default QuickView;

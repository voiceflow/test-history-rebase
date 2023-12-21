import { Utils } from '@voiceflow/common';
import { Box, compose, Modal, System, withProvider } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUProvider } from '@/contexts/NLUContext';
import { TextEditorVariablesPopoverProvider } from '@/contexts/TextEditorVariablesPopoverContext';
import { useLinkedState } from '@/hooks';

import manager from '../../../manager';
import { VoidInternalProps } from '../../../types';
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
      nameChangeTransform,
      setIsActiveItemRename,
      triggerNewInlineEntity,
    } = React.useContext(NLUQuickViewContext);

    const { showVariableForm, isEmpty } = useShowForms();

    const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
    const [modalTitle, setModalTitle] = useLinkedState(title);

    const emptyHeader = isCreatingItem || isEmpty;
    const EmptyBody = isCreatingItem ? Loading : EmptyView;

    const handleEmptyPageCreate = React.useCallback(() => {
      const tabHandlers: Record<InteractionModelTabType, () => void> = {
        [InteractionModelTabType.VARIABLES]: Utils.functional.noop,
      };

      tabHandlers[activeTab]();
    }, [activeTab, triggerNewInlineEntity, triggerNewInlineEntity]);

    const HeaderOptionsComponent = tabHeaderComponentsMap[activeTab];

    const onChangeName = (text: string) => {
      setModalTitle(nameChangeTransform(text, activeTab));
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
                  <TitleInput
                    value={emptyHeader ? '' : modalTitle}
                    onBlur={() => onNameChange(modalTitle, selectedID)}
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

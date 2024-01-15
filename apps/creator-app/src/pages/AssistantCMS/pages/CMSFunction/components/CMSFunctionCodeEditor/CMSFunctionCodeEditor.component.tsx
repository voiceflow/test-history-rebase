import { Box, CodeEditor, CodeEditorWrapper } from '@voiceflow/ui-next';
import { TCodeData } from '@voiceflow/ui-next/build/cjs/components/Inputs/CodeEditor/CodeEditorInput/types';
import { useSetAtom } from 'jotai/react';
import React from 'react';
import { useHistory } from 'react-router';

import * as Documentation from '@/config/documentation';
import * as Designer from '@/ducks/designer';
import { useHotkey } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { Hotkey } from '@/keymap';
import { Modals, useModal } from '@/ModalsV2';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import { useCMSRouteFolders } from '@/pages/AssistantCMS/contexts/CMSRouteFolders';
import { isEditorMenuOpen as isEditorMenuOpenAtom } from '@/pages/AssistantCMS/pages/CMSFunction/CMSFunction.atoms';
import { openURLInANewTab } from '@/utils/window';

import { cmsFunctionCodeEditorStyle } from './CMSFunctionCodeEditor.css';

export const CMSFunctionCodeEditor: React.FC<{ functionID: string }> = ({ functionID }) => {
  const functionData = useSelector(Designer.Function.selectors.getOneByID)({ id: functionID })!;
  const patchFunction = useDispatch(Designer.Function.effect.patchOne);
  const testModal = useModal(Modals.Function.Test);
  const cmsManager = useCMSManager();
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();
  const navigate = useHistory();
  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);
  const setIsEditorMenuOpen = useSetAtom(isEditorMenuOpenAtom);

  const onCodeChange = ([newCode]: TCodeData) => {
    if (typeof newCode === 'string' && functionData?.code !== newCode) {
      patchFunction(functionID, { code: newCode });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsEditorMenuOpen(false);
  };

  useHotkey(Hotkey.ESC_CLOSE, () => navigate.push(getFolderPath()));

  return (
    <Box width="calc(100% - 350px)" height="calc(100% - 110px)" px={12} py={12} onClick={handleClick}>
      <CodeEditorWrapper
        title="Function editor"
        showExpandButton={false}
        headerButtonProps={{ iconName: 'Question', onClick: () => openURLInANewTab(Documentation.FUNCTION) }}
        codeEditor={
          <CodeEditor
            className={cmsFunctionCodeEditorStyle}
            language="javascript"
            theme="dark"
            value={[functionData?.code]}
            onChange={onCodeChange}
            isFunctionEditor
            autofocus
            autoFocusLineNumber={3}
          />
        }
        bottomButtonProps={{ label: 'Run', onClick: () => testModal.open({ functionID }) }}
      />
    </Box>
  );
};

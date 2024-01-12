import { Box, CodeEditor, CodeEditorWrapper } from '@voiceflow/ui-next';
import { TCodeData } from '@voiceflow/ui-next/build/cjs/components/Inputs/CodeEditor/CodeEditorInput/types';
import React from 'react';
import { useHistory } from 'react-router';

import * as Designer from '@/ducks/designer';
import { useHotkey } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { Hotkey } from '@/keymap';
import { Modals, useModal } from '@/ModalsV2';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import { useCMSRouteFolders } from '@/pages/AssistantCMS/contexts/CMSRouteFolders';

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

  const onCodeChange = ([newCode]: TCodeData) => {
    if (typeof newCode === 'string' && functionData?.code !== newCode) {
      patchFunction(functionID, { code: newCode });
    }
  };

  useHotkey(Hotkey.ESC_CLOSE, () => navigate.push(getFolderPath()));

  return (
    <Box width="calc(100% - 350px)" height="calc(100% - 110px)" px={12} py={12} onClick={(event) => event.stopPropagation()}>
      <CodeEditorWrapper
        title="Function editor"
        width="100%"
        showExpandButton={false}
        codeEditor={
          <CodeEditor
            className={cmsFunctionCodeEditorStyle}
            language="javascript"
            theme="dark"
            value={[functionData?.code]}
            onChange={onCodeChange}
            isFunctionEditor
            autofocus
            autoFocusLineNumber={2}
          />
        }
        bottomButtonProps={{ label: 'Run', onClick: () => testModal.open({ functionID }) }}
      />
    </Box>
  );
};

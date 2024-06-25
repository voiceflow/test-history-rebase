import { tid } from '@voiceflow/style';
import { Box, CodeEditor, CodeEditorWrapper } from '@voiceflow/ui-next';
import type { TCodeData } from '@voiceflow/ui-next/build/cjs/components/Inputs/CodeEditor/CodeEditorInput/types';
import React, { useContext } from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';
import { useHistory } from 'react-router';

import * as Documentation from '@/config/documentation';
import * as Designer from '@/ducks/designer';
import { useHotkey } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { Hotkey } from '@/keymap';
import { Modals, useModal } from '@/ModalsV2';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import { openURLInANewTab } from '@/utils/window';

import { cmsFunctionCodeEditorStyle } from './CMSFunctionCodeEditor.css';

export const CMSFunctionCodeEditor: React.FC<{ functionID: string }> = ({ functionID }) => {
  const TEST_ID = tid('function', 'code');

  const navigate = useHistory();
  const testModal = useModal(Modals.Function.Test);
  const cmsManager = useCMSManager();
  const getAtomValue = useGetAtomValue();
  const dismissableLayer = useContext(DismissableLayerContext);

  const functionData = useSelector(Designer.Function.selectors.getOneByID)({ id: functionID })!;
  const patchFunction = useDispatch(Designer.Function.effect.patchOne);

  const getFolderURL = () => getAtomValue(cmsManager.url);

  const onCodeChange = ([newCode]: TCodeData) => {
    if (typeof newCode === 'string' && functionData?.code !== newCode) {
      patchFunction(functionID, { code: newCode });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    dismissableLayer.dismissAllGlobally();
    event.stopPropagation();
  };

  useHotkey(Hotkey.ESC_CLOSE, () => navigate.push(getFolderURL()));

  return (
    <Box width="calc(100% - 350px)" height="calc(100% - 112px)" px={12} py={12} onClick={handleClick}>
      <CodeEditorWrapper
        title="Function editor"
        showExpandButton={true}
        headerButtonProps={{ iconName: 'Question', onClick: () => openURLInANewTab(Documentation.FUNCTION) }}
        testID={tid(TEST_ID, 'editor')}
        codeEditor={
          <CodeEditor
            className={cmsFunctionCodeEditorStyle}
            language="javascript"
            theme="dark"
            value={[functionData?.code]}
            onChange={onCodeChange}
            isFunctionEditor
            testID={TEST_ID}
          />
        }
        bottomButtonProps={{ label: 'Run', onClick: () => testModal.open({ functionID }), testID: tid(TEST_ID, 'run') }}
      />
    </Box>
  );
};

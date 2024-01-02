import { Box, CodeEditor, CodeEditorWrapper } from '@voiceflow/ui-next';
import { TCodeData } from '@voiceflow/ui-next/build/cjs/components/Inputs/CodeEditor/CodeEditorInput/types';
import React from 'react';

import * as Designer from '@/ducks/designer';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { cmsFunctionCodeEditorStyle } from './CMSFunctionCodeEditor.css';

export const CMSFunctionCodeEditor: React.FC<{ functionID: string }> = ({ functionID }) => {
  const { code } = useSelector(Designer.Function.selectors.getOneByID)({ id: functionID })!;
  const patchFunction = useDispatch(Designer.Function.effect.patchOne);

  const onCodeChange = ([newCode]: TCodeData) => {
    if (typeof newCode === 'string' && code !== newCode) {
      patchFunction(functionID, { code: newCode });
    }
  };

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
            value={[code]}
            onChange={onCodeChange}
            isFunctionEditor
          />
        }
        bottomButtonProps={{ label: 'Run', onClick: () => {} }}
      />
    </Box>
  );
};

import { Box, CodeEditor, CodeEditorWrapper } from '@voiceflow/ui-next';
import { TCodeData } from '@voiceflow/ui-next/build/cjs/components/Inputs/CodeEditor/CodeEditorInput/types';
import React from 'react';

import { CMS_FUNCTION_DEFAULT_CODE } from '@/constants/cms/function.constant';
import * as Designer from '@/ducks/designer';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { cmsFunctionCodeEditorStyle } from './CMSFunctionCodeEditor.css';

export const CMSFunctionCodeEditor: React.FC<{ functionID: string }> = ({ functionID }) => {
  const functionData = useSelector(Designer.Function.selectors.getOneByID)({ id: functionID });
  const patchFunction = useDispatch(Designer.Function.effect.patchOne);

  const onCodeChange = (code: TCodeData) => patchFunction(functionID, { code: code[0] as string });

  return (
    <Box width="calc(100% - 350px)" height="100%" px={12} py={12} onClick={(event) => event.stopPropagation()}>
      <CodeEditorWrapper
        title="Function editor"
        width="100%"
        showExpandButton
        codeEditor={
          <CodeEditor
            className={cmsFunctionCodeEditorStyle}
            language="javascript"
            theme="dark"
            value={[functionData?.code.length ? functionData.code : CMS_FUNCTION_DEFAULT_CODE]}
            onChange={onCodeChange}
            isFunctionEditor
          />
        }
        bottomButtonProps={{ label: 'Run', onClick: () => {} }}
      />
    </Box>
  );
};

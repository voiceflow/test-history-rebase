import { tid } from '@voiceflow/style';
import { CodeEditor, CodeEditorWrapper, CodePreview } from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import { ICodePreviewWithFullScreenEditor } from './CodePreviewWithFullScreenEditor.interface';

export const CodePreviewWithFullScreenEditor: React.FC<ICodePreviewWithFullScreenEditor> = ({
  code,
  testID,
  disabled,
  onCodeChange,
  headerButtonProps,
  ...props
}) => {
  const [codeEditorOpened, setCodeEditorOpened] = useState(false);

  const codeContent = useMemo(() => [code], [code]);

  return (
    <>
      <CodePreview
        style={{ pointerEvents: disabled ? 'none' : 'all' }}
        testID={tid(testID, 'code-preview')}
        codePreview={codeContent}
        onActionButtonClick={() => setCodeEditorOpened(true)}
      />

      {codeEditorOpened && (
        <CodeEditorWrapper
          title="Prompt"
          testID={tid(testID, 'code-container')}
          isFullscreen
          showExpandButton
          headerButtonProps={headerButtonProps}
          onFullscreenChange={setCodeEditorOpened}
          codeEditor={
            <CodeEditor
              {...props}
              theme="dark"
              value={codeContent}
              testID={tid(testID, 'code-editor')}
              language="javascript"
              onChange={(value) => onCodeChange(value.join('\n'))}
              autofocus
            />
          }
        />
      )}
    </>
  );
};

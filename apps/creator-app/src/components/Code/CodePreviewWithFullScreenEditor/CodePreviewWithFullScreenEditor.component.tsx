import { tid } from '@voiceflow/style';
import { CodeEditor, CodeEditorWrapper, CodePreview, PopperContext, Portal } from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import type { ICodePreviewWithFullScreenEditor } from './CodePreviewWithFullScreenEditor.interface';

export const CodePreviewWithFullScreenEditor: React.FC<ICodePreviewWithFullScreenEditor> = ({
  code,
  testID,
  disabled,
  onCodeChange,
  headerButtonProps,
  onCodeEditorToggle,
  ...props
}) => {
  const popperContext = React.useContext(PopperContext);
  const [codeEditorOpened, setCodeEditorOpened] = useState(false);

  const codeContent = useMemo(() => [code], [code]);

  const toggleCodeEditorOpen = (value: boolean) => {
    setCodeEditorOpened(value);
    onCodeEditorToggle?.(value);
  };

  const onKeyDownCapture = (event: React.KeyboardEvent) => {
    if (event.code !== 'Escape') return;

    event.preventDefault();
    event.stopPropagation();

    toggleCodeEditorOpen(false);
  };

  useHotkey(Hotkey.MODAL_CLOSE, () => toggleCodeEditorOpen(false), {
    disable: !codeEditorOpened,
    preventDefault: true,
  });

  return (
    <>
      <CodePreview
        style={{ pointerEvents: disabled ? 'none' : 'all' }}
        testID={tid(testID, 'code-preview')}
        codePreview={codeContent}
        onActionButtonClick={() => toggleCodeEditorOpen(true)}
      />

      {codeEditorOpened && (
        <Portal portalNode={popperContext.portalNode}>
          <div
            style={{ zIndex: popperContext.zIndex, position: 'absolute', inset: 0 }}
            onKeyDownCapture={onKeyDownCapture}
          >
            <CodeEditorWrapper
              title="Prompt"
              testID={tid(testID, 'code-container')}
              isFullscreen
              showExpandButton
              headerButtonProps={headerButtonProps}
              onFullscreenChange={toggleCodeEditorOpen}
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
          </div>
        </Portal>
      )}
    </>
  );
};

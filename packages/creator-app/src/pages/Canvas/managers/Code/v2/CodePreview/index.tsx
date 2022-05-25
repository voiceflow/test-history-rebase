import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { copy } from '@/utils/clipboard';

interface CodePreviewProps {
  codeData: string;
  onOpenEditor: () => void;
  onClose: () => void;
}

const CodePreview: React.FC<CodePreviewProps> = ({ codeData, onOpenEditor, onClose }) => {
  return (
    <Preview onClick={stopPropagation(() => {})} id="canvas-preview">
      <Preview.Header>
        <Preview.Title>Javascript</Preview.Title>
      </Preview.Header>
      <Preview.Content>
        <Preview.Code code={codeData} />
      </Preview.Content>
      <Preview.Footer>
        <Preview.ButtonIcon
          icon="editorEdit"
          mr={12}
          onClick={() => {
            onOpenEditor();
            onClose();
          }}
        />
        <Preview.ButtonIcon
          icon="copy"
          onClick={() => {
            copy(codeData);
            toast.success('Copied to clipboard');
            onClose();
          }}
        />
      </Preview.Footer>
    </Preview>
  );
};

export default CodePreview;

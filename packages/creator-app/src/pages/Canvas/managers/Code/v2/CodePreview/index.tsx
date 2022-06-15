import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks/permission';
import { copy } from '@/utils/clipboard';

interface CodePreviewProps {
  onClose: VoidFunction;
  codeData: string;
  onOpenEditor: VoidFunction;
}

const CodePreview: React.FC<CodePreviewProps> = ({ codeData, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.OPEN_EDITOR);

  return (
    <Preview onClick={stopPropagation()} id="canvas-preview">
      <Preview.Header>
        <Preview.Title>Javascript</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        <Preview.Code code={codeData} />
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && (
          <Preview.ButtonIcon
            icon="editorEdit"
            mr={12}
            onClick={() => {
              onOpenEditor();
              onClose();
            }}
          />
        )}
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

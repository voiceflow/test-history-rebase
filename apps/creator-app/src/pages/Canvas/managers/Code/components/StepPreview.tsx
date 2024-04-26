import { Utils } from '@voiceflow/common';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import { copyWithToast } from '@/utils/clipboard';

interface CodePreviewProps {
  onClose: VoidFunction;
  codeData: string;
  onOpenEditor: VoidFunction;
}

const CodePreview: React.FC<CodePreviewProps> = ({ codeData, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);

  return (
    <Preview onClick={stopPropagation()} id="canvas-preview">
      <Preview.Header>
        <Preview.Title>Javascript</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {codeData ? <Preview.Code code={codeData} /> : <Preview.Text>Add code</Preview.Text>}
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && (
          <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onClose, onOpenEditor)} />
        )}

        {!!codeData && (
          <Preview.ButtonIcon
            icon="copy"
            ml={8}
            onClick={Utils.functional.chainVoid(onClose, copyWithToast(codeData))}
          />
        )}
      </Preview.Footer>
    </Preview>
  );
};

export default CodePreview;

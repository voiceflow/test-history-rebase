import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import { copyWithToast } from '@/utils/clipboard';

interface CodePreviewProps {
  onClose: VoidFunction;
  data: Realtime.NodeData.Trace;
  onOpenEditor: VoidFunction;
}

const CodePreview: React.FC<CodePreviewProps> = ({ data: { name, body }, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);

  return (
    <Preview onClick={stopPropagation()} id="canvas-preview">
      <Preview.Header>
        <Preview.Title>{name}</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        <Preview.Text>{body}</Preview.Text>
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onClose, onOpenEditor)} />}

        {!!body && <Preview.ButtonIcon icon="copy" ml={8} onClick={Utils.functional.chainVoid(onClose, copyWithToast(body))} />}
      </Preview.Footer>
    </Preview>
  );
};

export default CodePreview;

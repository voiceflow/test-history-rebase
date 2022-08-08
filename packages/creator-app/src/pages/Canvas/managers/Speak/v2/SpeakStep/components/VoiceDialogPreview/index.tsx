import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks/permission';
import { copy } from '@/utils/clipboard';

import { SpeakStepItem } from '../../types';

interface VoiceDialogPreviewProps {
  speakVariants: SpeakStepItem[];
  onOpenEditor: () => void;
  onClose: () => void;
}

const VoiceDialogPreview: React.FC<VoiceDialogPreviewProps> = ({ speakVariants, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.OPEN_EDITOR);

  const copyTextToClipboard = (value: string) => {
    copy(value);
    toast.success('Copied to clipboard');
    onClose();
  };

  const copyAllToClipboard = () => {
    const allVariants = speakVariants.reduce((acc, variant) => (acc || !variant.content ? `${acc} | ${variant.content}` : variant.content), '');
    copyTextToClipboard(allVariants);
  };

  const handleEditorClick = () => {
    onOpenEditor();
    onClose();
  };

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>All variants</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {speakVariants
          .filter((speakVariant) => speakVariant.content)
          .map((speakVariant) => (
            <Preview.ContentItem key={speakVariant.id}>
              <Preview.Text>{speakVariant.content}</Preview.Text>
              <Preview.ContentIcon>
                <Preview.ButtonIcon icon="copy" onClick={() => speakVariant.content && copyTextToClipboard(speakVariant.content)} />
              </Preview.ContentIcon>
            </Preview.ContentItem>
          ))}
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && <Preview.ButtonIcon icon="edit" onClick={handleEditorClick} />}
        <Preview.ButtonIcon icon="copy" ml={8} onClick={copyAllToClipboard} />
      </Preview.Footer>
    </Preview>
  );
};

export default VoiceDialogPreview;

import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks/permission';
import { copy } from '@/utils/clipboard';

import { AudioItem } from '../../types';

interface AudioPreviewProps {
  audioVariants: AudioItem[];
  onOpenEditor: () => void;
  onClose: () => void;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioVariants, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.OPEN_EDITOR);

  const copyTextToClipboard = (value: string) => {
    copy(value);
    toast.success('Copied to clipboard');
    onClose();
  };

  const copyAllToClipboard = () => {
    const allVariants = audioVariants.reduce((acc, variant) => (acc || !variant?.url ? `${acc} | ${variant.url}` : variant.url), '');
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
        {audioVariants.map((audioVariant) => (
          <Preview.ContentItem key={audioVariant.id}>
            <Preview.Text>{audioVariant.url}</Preview.Text>
            <Preview.ContentIcon>
              <Preview.ButtonIcon icon="copy" onClick={() => copyTextToClipboard(audioVariant?.url as string)} />
            </Preview.ContentIcon>
          </Preview.ContentItem>
        ))}
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && <Preview.ButtonIcon icon="edit" onClick={handleEditorClick} />}
        <Preview.ButtonIcon ml={8} icon="copy" onClick={copyAllToClipboard} />
      </Preview.Footer>
    </Preview>
  );
};

export default AudioPreview;

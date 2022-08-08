import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks/permission';
import { copy } from '@/utils/clipboard';

import { TextStepItem } from '../types';

interface TextPreviewProps {
  textVariants: TextStepItem[];
  onOpenEditor: () => void;
  onClose: () => void;
}

const TextPreview: React.FC<TextPreviewProps> = ({ textVariants, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.OPEN_EDITOR);

  const copyTextToClipboard = (value: string, message?: string) => {
    copy(value);
    toast.success(message || 'Copied to clipboard');
    onClose();
  };

  const copyAllToClipboard = () => {
    const allVariants = textVariants.reduce((acc, variant) => (acc ? `${acc} | ${variant.text}` : variant.text), '');
    copyTextToClipboard(allVariants, 'All variants copied to clipboard');
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
        {textVariants.map((textVariant) => (
          <Preview.ContentItem key={textVariant.id}>
            <Preview.Text>{textVariant.content}</Preview.Text>
            <Preview.ContentIcon>
              <Preview.ButtonIcon icon="copy" onClick={() => copyTextToClipboard(textVariant.text)} />
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

export default TextPreview;

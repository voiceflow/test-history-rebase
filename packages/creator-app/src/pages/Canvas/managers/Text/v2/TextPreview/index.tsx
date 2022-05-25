import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { copy } from '@/utils/clipboard';

import { TextStepItem } from '../types';

interface TextPreviewProps {
  textVariants: TextStepItem[];
  onOpenEditor: () => void;
  onClose: () => void;
}

const TextPreview: React.FC<TextPreviewProps> = ({ textVariants, onOpenEditor, onClose }) => {
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
        <Preview.ButtonIcon icon="editorEdit" mr={8} onClick={handleEditorClick} />
        <Preview.ButtonIcon icon="copy" onClick={copyAllToClipboard} />
      </Preview.Footer>
    </Preview>
  );
};

export default TextPreview;

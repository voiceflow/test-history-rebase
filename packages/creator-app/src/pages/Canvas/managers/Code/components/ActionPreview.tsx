import React from 'react';

import { useHotKeys } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import StepPreview from './StepPreview';

interface ActionPreviewProps {
  content: string;
  onClose: VoidFunction;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ content, onClose, onRemove, onOpenEditor }) => {
  useHotKeys(Hotkey.DELETE, onRemove);

  return <StepPreview onClose={onClose} codeData={content} onOpenEditor={onOpenEditor} />;
};
export default ActionPreview;

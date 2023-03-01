import React from 'react';

import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import StepPreview from './StepPreview';

interface ActionPreviewProps {
  content: string;
  onClose: VoidFunction;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ content, onClose, onRemove, onOpenEditor }) => {
  useHotkey(Hotkey.DELETE, onRemove);

  return <StepPreview onClose={onClose} codeData={content} onOpenEditor={onOpenEditor} />;
};
export default ActionPreview;

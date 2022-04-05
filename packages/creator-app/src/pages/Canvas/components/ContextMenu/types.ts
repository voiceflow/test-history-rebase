import { MenuItemMultilevel } from '@voiceflow/ui';

import { BlockVariant } from '@/constants/canvas';
import { ModalActions } from '@/hooks';
import { ContextMenuValue } from '@/pages/Canvas/contexts';
import { ClipboardContextValue } from '@/pages/Canvas/contexts/ClipboardContext';
import type Engine from '@/pages/Canvas/engine';
import { MarkupContextType } from '@/pages/Project/contexts';

export interface OptionProps {
  engine: Engine;
  markup: MarkupContextType;
  clipboard: ClipboardContextValue;
  blockColor?: BlockVariant;
  isTemplate?: boolean;
  upgradeModal: ModalActions;
  toggleCanvasOnly: () => void;
  showHintFeatures: boolean;
  canUseCommenting: boolean;
}

export interface ContextMenuOption<T extends string = string> extends MenuItemMultilevel<ContextMenuOption> {
  value: T;
  label: string;
  hotkey?: string;

  shouldRender?: (contextMenu: ContextMenuValue, props: OptionProps) => boolean;
}

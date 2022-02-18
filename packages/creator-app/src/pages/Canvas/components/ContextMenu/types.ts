import { SelectMenuItemOptions } from '@voiceflow/ui';

import { BlockVariant } from '@/constants/canvas';
import { ModalActions } from '@/hooks';
import { ContextMenuValue } from '@/pages/Canvas/contexts';
import { ClipboardContextValue } from '@/pages/Canvas/contexts/ClipboardContext';
import type { Engine } from '@/pages/Canvas/engine';
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

export interface ContextMenuOption<T> {
  value: T;
  label: string;
  hotkey?: string;
  options?: ContextMenuOption<any>[];
  menuItemProps?: SelectMenuItemOptions['menuItemProps'];

  shouldRender?: (contextMenu: ContextMenuValue, props: OptionProps) => boolean;
}

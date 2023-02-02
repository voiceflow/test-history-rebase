import { MenuItemMultilevel } from '@voiceflow/ui';

import { ModalActions } from '@/hooks';
import { ContextMenuValue } from '@/pages/Canvas/contexts';
import { ClipboardContextValue } from '@/pages/Canvas/contexts/ClipboardContext';
import type Engine from '@/pages/Canvas/engine';
import { LastCreatedComponentContextType, MarkupContextType } from '@/pages/Project/contexts';

export interface OptionProps {
  engine: Engine;
  markup: MarkupContextType;
  lastCreatedComponent: LastCreatedComponentContextType;
  clipboard: ClipboardContextValue;
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

  render?: (contextMenu: ContextMenuValue, props: OptionProps) => React.ReactElement;
  shouldRender?: (contextMenu: ContextMenuValue, props: OptionProps) => boolean;
}

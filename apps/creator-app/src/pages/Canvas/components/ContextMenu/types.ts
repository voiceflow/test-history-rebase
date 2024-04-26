import type { MenuItemMultilevel } from '@voiceflow/ui';

import type { usePaymentModal } from '@/hooks/modal.hook';
import type { ContextMenuValue } from '@/pages/Canvas/contexts';
import type { ClipboardContextValue } from '@/pages/Canvas/contexts/ClipboardContext';
import type Engine from '@/pages/Canvas/engine';
import type { MarkupContextType } from '@/pages/Project/contexts';

export interface OptionProps {
  engine: Engine;
  markup: MarkupContextType;
  clipboard: ClipboardContextValue;
  isTemplate?: boolean;
  paymentModal: ReturnType<typeof usePaymentModal>;
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

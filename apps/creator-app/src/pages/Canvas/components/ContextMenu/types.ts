import { MenuItemMultilevel } from '@voiceflow/ui';

import { usePaymentModal } from '@/ModalsV2/hooks';
import { ContextMenuValue } from '@/pages/Canvas/contexts';
import { ClipboardContextValue } from '@/pages/Canvas/contexts/ClipboardContext';
import type Engine from '@/pages/Canvas/engine';
import { MarkupContextType } from '@/pages/Project/contexts';

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

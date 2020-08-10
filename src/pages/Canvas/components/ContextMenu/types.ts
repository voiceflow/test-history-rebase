import { ContextMenuValue } from '@/pages/Canvas/contexts';
import { ClipboardContextValue } from '@/pages/Canvas/contexts/ClipboardContext';
import type { Engine } from '@/pages/Canvas/engine';

export type ContextMenuOption<T> = {
  value: T;
  label: string;

  shouldRender?: (
    contextMenu: ContextMenuValue,
    props: {
      engine: Engine;
      clipboard: ClipboardContextValue;
      isMarkupFeatureEnabled: boolean;
      isTemplate: boolean;
    }
  ) => boolean;

  options?: ContextMenuOption<any>[];
};

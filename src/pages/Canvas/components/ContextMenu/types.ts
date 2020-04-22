import { ContextMenuValue } from '@/pages/Canvas/contexts';
import type { Engine } from '@/pages/Canvas/engine';

export type ContextMenuOption<T> = {
  value: T;
  label: string;

  shouldRender?: (contextMenu: ContextMenuValue, props: { engine: Engine }) => boolean;
  options?: ContextMenuOption<any>[];
};

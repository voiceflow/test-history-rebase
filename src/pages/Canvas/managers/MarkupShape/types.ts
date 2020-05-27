import { Markup } from '@/models';

export type EditorProps<D extends Markup.ShapeNodeData> = {
  data: D;
  onChange: (data: D) => void;
};

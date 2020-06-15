import { Markup } from '@/models';

export type EditorProps<D extends Markup.NodeData.Shape> = {
  data: D;
  onChange: (data: D) => void;
};

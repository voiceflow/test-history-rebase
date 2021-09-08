import { Descendant } from 'slate';

export namespace Markup {
  export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
  }

  export namespace NodeData {
    export interface Text {
      backgroundColor: Color | null;
      scale: number;
      rotate: number;
      content: Descendant[];
      overrideWidth: number | null /* Used to implement horizontal + vertical resizing of Markup Text */;
    }

    export interface Image {
      url: string;
      width: number;
      height: number;
      rotate: number;
    }
  }

  export type AnyNodeData = NodeData.Text | NodeData.Image;
}

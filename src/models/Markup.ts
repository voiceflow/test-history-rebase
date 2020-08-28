import { RawDraftContentState } from 'draft-js';

import { TextAlignment } from '@/constants';

export namespace Markup {
  export type Color = { r: number; g: number; b: number; a: number };

  export namespace NodeData {
    export type Text = {
      content: RawDraftContentState;
      textAlignment: TextAlignment;
      scale: number;
      rotate: number;
      overrideWidth: number | null /* Used to implement horizontal + vertical resizing of Markup Text */;
    };

    export type Image = {
      url: string;
      width: number;
      height: number;
      rotate: number;
    };
  }

  export type AnyNodeData = NodeData.Text | NodeData.Image;
}

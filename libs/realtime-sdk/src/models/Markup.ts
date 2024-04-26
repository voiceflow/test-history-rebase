/* eslint-disable @typescript-eslint/no-namespace */
import type { BaseText } from '@voiceflow/base-types';

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
      content: BaseText.SlateTextValue;
      overrideWidth: number | null /* Used to implement horizontal + vertical resizing of Markup Text */;
    }

    export interface Media {
      url: string;
      width: number;
      height: number;
      rotate: number;
    }

    export interface Image extends Media {}

    export interface Video extends Media {}
  }

  export type AnyNodeData = NodeData.Text | NodeData.Image;
}

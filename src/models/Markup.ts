import { RawDraftContentState } from 'draft-js';
import { Diff, Intersection } from 'utility-types';

import { MarkupShapeType, TextAlignment } from '@/constants';

export namespace Markup {
  export type Color = { r: number; g: number; b: number; a: number };

  export namespace NodeData {
    export type Text = {
      content: RawDraftContentState;
      textAlignment: TextAlignment;
      scale: number;
    };

    export type Image = {
      url: string;
      width: number;
      height: number;
      rotate: number;
    };

    export type Line = {
      shapeType: MarkupShapeType.LINE;

      offsetX: number;
      offsetY: number;
      strokeColor: Color;
    };

    export type Arrow = {
      shapeType: MarkupShapeType.ARROW;

      offsetX: number;
      offsetY: number;
      strokeColor: Color;
    };

    export type Circle = {
      shapeType: MarkupShapeType.CIRCLE;

      width: number;
      height: number;
      rotate: number;
      borderColor: Color | null;
      backgroundColor: Color | null;
    };

    export type Rectangle = {
      shapeType: MarkupShapeType.RECTANGLE;

      width: number;
      height: number;
      rotate: number;
      borderColor: Color | null;
      backgroundColor: Color | null;
      borderRadius: number;
    };

    export type Shape = {
      shapeType: MarkupShapeType;
    } & Omit<Intersection<Intersection<Intersection<Line, Arrow>, Circle>, Rectangle>, 'shapeType'> &
      Partial<Diff<Diff<Diff<Line, Arrow>, Circle>, Rectangle>>;
  }

  export type AnyNodeData = NodeData.Text | NodeData.Image | NodeData.Shape;
}

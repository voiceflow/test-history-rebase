import { RawDraftContentState } from 'draft-js';

import { ShapeType, TextAlignment } from '@/constants';

export namespace Markup {
  export type Color = { r: number; g: number; b: number; a: number };

  export type TextNodeData = {
    content: RawDraftContentState;
    textAlignment: TextAlignment;
    scale: number;
  };

  export type ImageNodeData = {
    url: string;
    width: number;
    height: number;
    rotate: number;
  };

  export type LineShapeNodeData = {
    width: number;
    color: Color;
    rotate: number;
    shapeType: ShapeType.LINE;
  };

  export type ArrowShapeNodeData = {
    width: number;
    color: Color;
    rotate: number;
    shapeType: ShapeType.ARROW;
  };

  export type CircleShapeNodeData = {
    width: number;
    height: number;
    shapeType: ShapeType.CIRCLE;
    borderColor: Color | null;
    backgroundColor: Color | null;
  };

  export type RectangleShapeNodeData = {
    width: number;
    height: number;
    rotate: number;
    shapeType: ShapeType.RECTANGLE;
    borderColor: Color | null;
    borderRadius: number;
    backgroundColor: Color | null;
  };

  export type ShapeNodeData = ArrowShapeNodeData | LineShapeNodeData | CircleShapeNodeData | RectangleShapeNodeData;

  export type NodeData = TextNodeData | ImageNodeData | ShapeNodeData;
}

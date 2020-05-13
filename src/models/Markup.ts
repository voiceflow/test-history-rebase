export namespace Markup {
  export type Color = {
    hex: string;
    opacity: number;
  };

  export enum ShapeType {
    LINE = 'line',
    ARROW = 'arrow',
    CIRCLE = 'circle',
    RECTANGLE = 'rectangle',
  }

  export type TextNodeData = {
    text: string;
    color: Color;
  };

  export type ImageNodeData = {
    url: string;
    width: number;
    height: number;
  };

  export type LineShapeNodeData = {
    type: ShapeType.LINE;
    width: number;
    color: Color;
    rotate: number;
  };

  export type ArrowShapeNodeData = {
    type: ShapeType.ARROW;
    width: number;
    color: Color;
    rotate: number;
  };

  export type CircleShapeNodeData = {
    type: ShapeType.CIRCLE;
    width: number;
    height: number;
    borderColor: Color;
    backgroundColor: Color;
  };

  export type RectangleShapeNodeData = {
    type: ShapeType.RECTANGLE;
    width: number;
    height: number;
    borderColor: Color;
    borderRadius: number;
    backgroundColor: Color;
  };

  export type ShapeNodeData = ArrowShapeNodeData | LineShapeNodeData | CircleShapeNodeData | RectangleShapeNodeData;

  export type NodeData = TextNodeData | ImageNodeData | ShapeNodeData;
}

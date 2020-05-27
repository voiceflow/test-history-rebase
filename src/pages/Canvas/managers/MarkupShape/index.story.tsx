import React from 'react';

import { composeDecorators } from '@/../.storybook';
import { ShapeType } from '@/constants';
import { Markup } from '@/models';

import { MarkupShapeEditor } from './MarkupShapeEditor';

const withDecorators = composeDecorators((Component: React.FC) => (
  <div style={{ width: '360px', maxHeight: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
    <Component />
  </div>
));

export default {
  title: 'Creator/Editors/MarkupShape',
  component: MarkupShapeEditor,
  includeStories: [],
};

export const circle = withDecorators(() => {
  const [data, setData] = React.useState<Markup.CircleShapeNodeData>({
    width: 100,
    height: 100,
    shapeType: ShapeType.CIRCLE,
    borderColor: { r: 0, g: 0, b: 50, a: 0.7 },
    backgroundColor: null,
  });

  return <MarkupShapeEditor data={data} onChange={setData} />;
});

export const rectangle = withDecorators(() => {
  const [data, setData] = React.useState<Markup.RectangleShapeNodeData>({
    width: 100,
    height: 100,
    shapeType: ShapeType.RECTANGLE,
    borderColor: null,
    borderRadius: 0,
    backgroundColor: { r: 0, g: 0, b: 50, a: 0.7 },
  });

  return <MarkupShapeEditor data={data} onChange={setData} />;
});

export const arrow = withDecorators(() => {
  const [data, setData] = React.useState<Markup.ArrowShapeNodeData>({
    width: 100,
    color: { r: 0, g: 0, b: 50, a: 0.7 },
    rotate: 0,
    shapeType: ShapeType.ARROW,
  });

  return <MarkupShapeEditor data={data} onChange={setData} />;
});

export const line = withDecorators(() => {
  const [data, setData] = React.useState<Markup.LineShapeNodeData>({
    width: 100,
    color: { r: 0, g: 0, b: 50, a: 0.7 },
    rotate: 0,
    shapeType: ShapeType.LINE,
  });

  return <MarkupShapeEditor data={data} onChange={setData} />;
});

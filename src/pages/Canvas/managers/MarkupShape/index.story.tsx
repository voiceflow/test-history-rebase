import React from 'react';

import { composeDecorators } from '@/../.storybook';
import { MarkupShapeType } from '@/constants';
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
  const [data, setData] = React.useState<Markup.NodeData.Circle>({
    width: 100,
    height: 100,
    rotate: 0,
    shapeType: MarkupShapeType.CIRCLE,
    borderColor: { r: 0, g: 0, b: 50, a: 0.7 },
    backgroundColor: { r: 0, g: 0, b: 50, a: 0.7 },
  });

  return <MarkupShapeEditor data={data} onChange={setData as any} />;
});

export const rectangle = withDecorators(() => {
  const [data, setData] = React.useState<Markup.NodeData.Rectangle>({
    width: 100,
    height: 100,
    shapeType: MarkupShapeType.RECTANGLE,
    borderColor: { r: 0, g: 0, b: 50, a: 0.7 },
    borderRadius: 0,
    rotate: 0,
    backgroundColor: { r: 0, g: 0, b: 50, a: 0.7 },
  });

  return <MarkupShapeEditor data={data} onChange={setData as any} />;
});

export const arrow = withDecorators(() => {
  const [data, setData] = React.useState<Markup.NodeData.Arrow>({
    offsetX: 100,
    offsetY: 0,
    strokeColor: { r: 0, g: 0, b: 50, a: 0.7 },
    shapeType: MarkupShapeType.ARROW,
  });

  return <MarkupShapeEditor data={data} onChange={setData as any} />;
});

export const line = withDecorators(() => {
  const [data, setData] = React.useState<Markup.NodeData.Line>({
    offsetX: 100,
    offsetY: 0,
    strokeColor: { r: 0, g: 0, b: 50, a: 0.7 },
    shapeType: MarkupShapeType.LINE,
  });

  return <MarkupShapeEditor data={data} onChange={setData as any} />;
});

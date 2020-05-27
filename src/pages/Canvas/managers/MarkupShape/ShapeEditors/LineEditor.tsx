import React from 'react';

import { Markup } from '@/models';

import { EditorProps } from '../types';
import { ColorSection } from './components';

const LineEditor: React.FC<EditorProps<Markup.LineShapeNodeData>> = ({ onChange, data }) => (
  <ColorSection title="Style" isLast color={data.color} onChange={(color) => onChange({ ...data, color: color! })} removable={false} />
);

export default LineEditor;

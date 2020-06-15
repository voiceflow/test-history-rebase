import React from 'react';

import { Markup } from '@/models';

import { EditorProps } from '../types';
import { ColorSection } from './components';

const LineEditor: React.FC<EditorProps<Markup.NodeData.Line>> = ({ onChange, data }) => (
  <ColorSection title="Style" isLast color={data.strokeColor} onChange={(color) => onChange({ ...data, strokeColor: color! })} removable={false} />
);

export default LineEditor;

import React from 'react';

import { Markup } from '@/models';

import { EditorProps } from '../types';
import { ColorSection } from './components';

const ArrowEditor: React.FC<EditorProps<Markup.NodeData.Arrow>> = ({ onChange, data }) => (
  <ColorSection title="Style" isLast color={data.strokeColor} onChange={(color) => onChange({ ...data, strokeColor: color! })} removable={false} />
);

export default ArrowEditor;

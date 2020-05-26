import React from 'react';

import { Markup } from '@/models';

import { EditorProps } from '../types';
import { ColorSection } from './components';

const CircleEditor: React.FC<EditorProps<Markup.CircleShapeNodeData>> = ({ data, onChange }) => {
  const { borderColor, backgroundColor } = data;

  return (
    <>
      <ColorSection title="Border" color={borderColor} onChange={(color) => onChange({ ...data, borderColor: color })} />
      <ColorSection title="Fill" isLast color={backgroundColor} onChange={(color) => onChange({ ...data, backgroundColor: color })} />
    </>
  );
};

export default CircleEditor;

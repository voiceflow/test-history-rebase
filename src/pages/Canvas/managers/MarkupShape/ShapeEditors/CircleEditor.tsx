import React from 'react';

import { Markup } from '@/models';
import { DEFAULT_MARKUP_BACKGROUND_COLOR, DEFAULT_MARKUP_BORDER_COLOR } from '@/pages/Canvas/constants';

import { EditorProps } from '../types';
import { ColorSection } from './components';

const CircleEditor: React.FC<EditorProps<Markup.NodeData.Circle>> = ({ data, onChange }) => {
  const { borderColor, backgroundColor } = data;

  return (
    <>
      <ColorSection
        title="Border"
        color={borderColor}
        initialColor={DEFAULT_MARKUP_BORDER_COLOR}
        onChange={(color) => onChange({ ...data, borderColor: color })}
      />
      <ColorSection
        title="Fill"
        isLast
        color={backgroundColor}
        initialColor={DEFAULT_MARKUP_BACKGROUND_COLOR}
        onChange={(color) => onChange({ ...data, backgroundColor: color })}
      />
    </>
  );
};

export default CircleEditor;

import '../DisplayRenderer.css';

import React from 'react';

import APLRenderer, { APLRendererProps } from '@/components/APLRenderer';

interface BaseRendererProps {
  apl: string;
  data: string;
  commands: string;
  scale: number;
  viewport: APLRendererProps['viewport'];
  onFail: (error: Error) => void;
}

const BaseRenderer: React.FC<BaseRendererProps> = ({ onFail, scale, apl, data, commands, viewport }) => (
  <APLRenderer
    content={apl}
    data={data}
    commands={commands}
    onCommandFail={onFail}
    viewport={viewport}
    style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}
  />
);

export default BaseRenderer;

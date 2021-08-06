import { VisualType } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import { NodeData } from '@/models';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step';

import { APLStep, ImageStep } from './components';

export interface ImageStepProps {
  image: string | null;
  label: string | null;
  portID?: string;
  aspectRatio: number | null;
}

const ConnectedImageStep: React.FC<ConnectedStepProps<NodeData.Visual>> = ({ data, ...props }) => (
  <>
    {data.visualType === VisualType.APL && <APLStep data={data} {...props} />}
    {data.visualType === VisualType.IMAGE && <ImageStep data={data} {...props} />}
  </>
);

export default ConnectedImageStep;

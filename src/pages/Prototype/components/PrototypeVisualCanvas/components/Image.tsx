import { ImageStepData } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import { getLabel } from '@/pages/Canvas/managers/Visual/VisualStep/components/ImageStep/utils';

import Frame from './Frame';
import { VisualRenderProps } from './types';

type ImageProps = VisualRenderProps<ImageStepData>;

const Image: React.FC<ImageProps> = ({ zoom, data, dimensions }) => (
  <Frame zoom={zoom} title={data?.image ? getLabel(data) : null} width={dimensions[0]} height={dimensions[1]} placeholderImage={data?.image} />
);

export default Image;

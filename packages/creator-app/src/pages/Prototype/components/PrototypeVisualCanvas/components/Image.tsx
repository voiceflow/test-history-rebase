import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import { getLabel } from '@/pages/Canvas/managers/Visual/VisualStep/components/ImageStep/utils';
import { ClassName } from '@/styles/constants';

import Frame from './Frame';
import { VisualRenderProps } from './types';

type ImageProps = VisualRenderProps<BaseNode.Visual.ImageStepData>;

const Image: React.FC<ImageProps> = ({ zoom, data, dimensions }) => (
  <Frame
    className={ClassName.VISUAL_IMAGE}
    zoom={zoom}
    title={data?.image ? getLabel(data) : null}
    width={dimensions[0]}
    height={dimensions[1]}
    placeholderImage={data?.image}
  />
);

export default Image;

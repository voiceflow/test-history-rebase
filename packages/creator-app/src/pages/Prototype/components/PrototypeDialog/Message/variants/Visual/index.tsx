import { BaseNode } from '@voiceflow/base-types';
import { Link } from '@voiceflow/ui';
import React from 'react';

import StepImage from '@/pages/Canvas/components/Step/components/StepImage';
import { VisualMessage } from '@/pages/Prototype/types';

import BaseMessage, { BaseMessageProps } from '../../Base';
import * as S from './styles';

interface VisualProps extends BaseMessageProps {
  visual: VisualMessage;
  isTranscript?: boolean;
}

const Visual: React.FC<VisualProps> = ({ visual, isTranscript, ...props }) => {
  const isImageType = visual.visualType === BaseNode.Visual.VisualType.IMAGE;
  const imageURL = isImageType ? visual.image : visual.imageURL;
  const { width = 0, height = 0 } = (isImageType && visual.dimensions) || {};
  const ratio = width / height || 1.65;

  return (
    <S.VisualContainer>
      <BaseMessage bubble={false} {...props}>
        <Link href={imageURL!} style={{ pointerEvents: 'none' }}>
          <S.ImageContainer ratio={ratio} isFirstInSeries={props.isFirstInSeries}>
            <StepImage image={imageURL!} position="top center" borderRadius={12} aspectRatio={ratio} noContainer />
          </S.ImageContainer>
        </Link>
      </BaseMessage>
    </S.VisualContainer>
  );
};

export default Visual;

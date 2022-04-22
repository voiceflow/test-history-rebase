import { BaseNode } from '@voiceflow/base-types';
import { Link } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import StepImage from '@/pages/Canvas/components/Step/components/StepImage';
import { VisualMessage } from '@/pages/Prototype/types';

import { Message } from '../components';
import { MessageProps } from '../components/Message';
import Container from '../components/MessageContainer';

type VisualProps = MessageProps & {
  visual: VisualMessage;
  isTranscript?: boolean;
};

const VisualContainer = styled.div`
  ${Container} {
    display: block;
  }
`;

const ImageContainer = styled.div<{ ratio: number; isFirstInSeries?: boolean }>`
  max-width: 306px;
  width: 100%;
`;

const Visual: React.FC<VisualProps> = ({ visual, isTranscript, ...props }) => {
  const isImageType = visual.visualType === BaseNode.Visual.VisualType.IMAGE;
  const imageURL = isImageType ? visual.image : visual.imageURL;
  const { width = 0, height = 0 } = (isImageType && visual.dimensions) || {};
  const ratio = width / height || 1.65;

  return (
    <VisualContainer onClick={(e) => isTranscript && e.preventDefault()}>
      <Message bubble={false} {...props}>
        <Link href={imageURL!}>
          <ImageContainer ratio={ratio} isFirstInSeries={props.isFirstInSeries}>
            <StepImage image={imageURL!} position="top center" borderRadius={12} aspectRatio={ratio} noContainer />
          </ImageContainer>
        </Link>
      </Message>
    </VisualContainer>
  );
};

export default Visual;

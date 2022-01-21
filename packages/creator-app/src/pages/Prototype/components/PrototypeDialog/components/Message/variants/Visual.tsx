import { Node } from '@voiceflow/base-types';
import { Link } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { Image } from '@/pages/Canvas/components/Step/components';
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

  ${Image} {
    border-radius: 15px;
    padding-bottom: ${({ ratio }) => ratio}%;
  }
`;

const Visual: React.FC<VisualProps> = ({ visual, isTranscript, ...props }) => {
  const isImageType = visual.visualType === Node.Visual.VisualType.IMAGE;
  const imageURL = isImageType ? visual.image : visual.imageURL;
  const { width = 0, height = 0 } = (isImageType && visual.dimensions) || {};
  const ratio = (height / width) * 100 || 60;

  return (
    <VisualContainer onClick={(e) => isTranscript && e.preventDefault()}>
      <Message bubble={false} {...props}>
        <Link href={imageURL!}>
          <ImageContainer ratio={ratio} isFirstInSeries={props.isFirstInSeries}>
            <Image image={imageURL!} position="top center" />
          </ImageContainer>
        </Link>
      </Message>
    </VisualContainer>
  );
};

export default Visual;

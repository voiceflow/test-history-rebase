import { Link } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs';
import { Image } from '@/pages/Canvas/components/Step/components';
import { VisualMessage } from '@/pages/Prototype/types';
import { FadeDownContainer } from '@/styles/animations';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type VisualProps = MessageProps & {
  visual: VisualMessage;
};

const VisualContainer = styled.div`
  ${FadeDownContainer} {
    width: 100%;
  }
`;

const ImageContainer = styled.div<{ ratio: number; isFirstInSeries?: boolean }>`
  max-width: 306px;
  width: 100%;

  ${Image} {
    border-radius: 15px;
    padding-bottom: ${({ ratio }) => ratio}%;

    ${({ isFirstInSeries = false }) =>
      isFirstInSeries
        ? css`
            border-bottom-left-radius: 5px;
          `
        : css`
            border-top-left-radius: 5px;
          `}
  }
`;

const Visual: React.FC<VisualProps> = ({ visual: { image, dimensions }, ...props }) => {
  const { width = 0, height = 0 } = dimensions || {};
  const ratio = (height / width) * 100 || 60;

  return (
    <VisualContainer>
      <Message bubble={false} {...props} withAnimation>
        <Link href={image!}>
          <ImageContainer ratio={ratio} isFirstInSeries={props.isFirstInSeries}>
            <Image image={image!} position="top center" />
          </ImageContainer>
        </Link>
      </Message>
    </VisualContainer>
  );
};

export default Visual;

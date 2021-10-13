import { VisualType } from '@voiceflow/base-types/build/node/visual';
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
  isTranscript?: boolean;
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

const Visual: React.FC<VisualProps> = ({ visual, isTranscript, ...props }) => {
  const isImageType = visual.visualType === VisualType.IMAGE;
  const imageURL = isImageType ? visual.image : visual.imageURL;
  const { width = 0, height = 0 } = (isImageType && visual.dimensions) || {};
  const ratio = (height / width) * 100 || 60;

  return (
    <VisualContainer onClick={(e) => isTranscript && e.preventDefault()}>
      <Message bubble={false} {...props} withAnimation>
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

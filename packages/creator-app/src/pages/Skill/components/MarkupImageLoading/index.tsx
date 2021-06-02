import React from 'react';

import { BlockType } from '@/constants';
import { MarkupContext } from '@/pages/Skill/contexts';

import { Container, Loader, LoadingContainer } from './components';

const ImageLoading: React.FC = () => {
  const markup = React.useContext(MarkupContext)!;

  return markup.creatingType !== BlockType.MARKUP_IMAGE ? null : (
    <Container>
      <LoadingContainer>
        <Loader borderLess />
      </LoadingContainer>
    </Container>
  );
};

export default ImageLoading;

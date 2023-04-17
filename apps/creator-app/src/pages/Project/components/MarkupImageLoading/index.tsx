import React from 'react';

import { MarkupContext } from '@/pages/Project/contexts';

import { Container, Loader, LoadingContainer } from './components';

const ImageLoading: React.FC = () => {
  const markup = React.useContext(MarkupContext)!;

  return !markup.uploadingMedia ? null : (
    <Container>
      <LoadingContainer>
        <Loader borderLess />
      </LoadingContainer>
    </Container>
  );
};

export default ImageLoading;

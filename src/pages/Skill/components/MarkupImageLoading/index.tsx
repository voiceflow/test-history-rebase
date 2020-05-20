import React from 'react';

import { MarkupModeContext } from '@/pages/Skill/contexts';

import { Container, Loader, LoadingContainer } from './components';

const ImageLoading: React.FC = () => {
  const { isUploadingImage } = React.useContext(MarkupModeContext)!;

  return !isUploadingImage ? null : (
    <Container>
      <LoadingContainer>
        <Loader borderLess />
      </LoadingContainer>
    </Container>
  );
};

export default ImageLoading;

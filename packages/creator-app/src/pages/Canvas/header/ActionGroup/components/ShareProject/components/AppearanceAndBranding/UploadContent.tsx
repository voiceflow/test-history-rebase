import React from 'react';

import { UploadIconVariant, UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';

import Header from '../Header';
import Container from './Container';

interface UploadContentProps {
  id?: string;
  title: string;
  isAllowed: boolean;
  initialState: string;
  isSquare: boolean;
  hasBorderRight: boolean;
  updateSettings: (image: string) => void;
}

const UploadContent: React.FC<UploadContentProps> = ({ id, title, isAllowed, initialState, isSquare, hasBorderRight, updateSettings }) => {
  const [image, setImage] = React.useState<string>(initialState);

  const updateImage = async (image: string | null) => {
    await updateSettings(image ?? '');
    setImage(image ?? '');
  };

  return (
    <Container id={id} hasBorderRight={hasBorderRight}>
      <Header marginBottom={16} secondary={true} disabled={!isAllowed}>
        {title}
      </Header>
      <UploadJustIcon image={image} update={updateImage} size={UploadIconVariant.SMALL} isSquare={isSquare} disabled={!isAllowed} />
    </Container>
  );
};

export default UploadContent;

import React from 'react';

import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';

import Header from '../Header';
import Container from './Container';

const IconUpload: React.FC<any> = UploadJustIcon;

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

  const updateImage = async (image: string | string[] | null) => {
    if (typeof image === 'string') {
      await updateSettings(image);
      setImage(image);
    }
  };

  return (
    <Container id={id} hasBorderRight={hasBorderRight}>
      <Header marginBottom={16} secondary={true} disabled={!isAllowed}>
        {title}
      </Header>
      <IconUpload image={image} update={updateImage} size="small" isSquare={isSquare} disabled={!isAllowed} />
    </Container>
  );
};

export default UploadContent;

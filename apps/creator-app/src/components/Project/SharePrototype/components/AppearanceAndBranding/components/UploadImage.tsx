import { Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import { useLinkedState } from '@/hooks';

import Title from '../../Title';
import UploadImageContainer from './UploadImageContainer';

interface UploadImageProps {
  id?: string;
  title: string;
  image: string;
  onUpdate: (image: string) => void;
  isSquare: boolean;
  hasBorderRight: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({ id, image: propImage, title, isSquare, hasBorderRight, onUpdate }) => {
  const [image, setImage] = useLinkedState(propImage);

  const updateImage = async (image: string | null) => {
    setImage(image ?? '');

    await onUpdate(image ?? '');
  };

  return (
    <UploadImageContainer id={id} hasBorderRight={hasBorderRight}>
      <Title marginBottom={16} secondary={true}>
        {title}
      </Title>

      <Upload.IconUpload image={image} update={updateImage} size={UploadIconVariant.SMALL} isSquare={isSquare} />
    </UploadImageContainer>
  );
};

export default UploadImage;

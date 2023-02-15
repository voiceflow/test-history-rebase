import React from 'react';

import Button, { ButtonVariant } from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';

interface GeneralUploadButtonProps {
  loading: boolean;
  progress: number;
  onClick: () => any;
}

const iconSize = 18;

const GeneralUploadButton: React.FC<GeneralUploadButtonProps> = ({ loading, progress, onClick }) =>
  loading ? (
    <Button
      variant={ButtonVariant.LOADING}
      progress={progress}
      customProps={{
        iconProps: {
          size: iconSize,
        },
      }}
    />
  ) : (
    <Button
      onClick={onClick}
      variant={ButtonVariant.ACTIVE}
      customProps={{
        tooltip: { content: 'Publish' },
        iconProps: {
          size: iconSize,
        },
      }}
    />
  );

export default GeneralUploadButton;

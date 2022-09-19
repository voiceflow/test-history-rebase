import React from 'react';

import Button, { ButtonVariant } from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';

interface GeneralUploadButtonProps {
  isTraining: boolean;
  progress: number;
  onClick: () => any;
}

const iconSize = 18;

const GeneralUploadButton: React.FC<GeneralUploadButtonProps> = ({ isTraining, progress, onClick }) =>
  isTraining ? (
    <Button
      variant={ButtonVariant.LOADING}
      customProps={{
        tooltip: {
          title: `Updating: ${progress} % `,
        },
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
        tooltip: { title: 'Publish' },
        iconProps: {
          size: iconSize,
        },
      }}
    />
  );

export default GeneralUploadButton;

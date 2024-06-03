import React from 'react';

import PublishButton from '@/pages/Project/components/Upload/components/PublishButton';

interface GeneralUploadButtonProps {
  onClick: VoidFunction;
  loading: boolean;
  progress: number;
}

const GeneralUploadButton: React.FC<GeneralUploadButtonProps> = ({ loading, progress, onClick }) => {
  return <PublishButton loading={loading} progress={progress} onClick={onClick} />;
};

export default GeneralUploadButton;

import { FeatureFlag } from '@voiceflow/realtime-sdk';
import React from 'react';

import { useFeature } from '@/hooks/feature';
import Button, {
  ButtonVariant,
} from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

interface GeneralUploadButtonProps {
  onClick: VoidFunction;
  loading: boolean;
  progress: number;
}

const GeneralUploadButton: React.FC<GeneralUploadButtonProps> = ({ loading, progress, onClick }) => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  if (cmsWorkflows.isEnabled) {
    return <PublishButton loading={loading} progress={progress} onClick={onClick} />;
  }

  return loading ? (
    <Button variant={ButtonVariant.LOADING} progress={progress} customProps={{ iconProps: { size: 18 } }} />
  ) : (
    <Button
      onClick={onClick}
      variant={ButtonVariant.ACTIVE}
      customProps={{
        tooltip: { content: 'Publish' },
        iconProps: { size: 18 },
      }}
    />
  );
};

export default GeneralUploadButton;

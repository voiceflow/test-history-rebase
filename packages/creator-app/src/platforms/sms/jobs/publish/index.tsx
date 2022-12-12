import { toast } from '@voiceflow/ui';
import React from 'react';

import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

// placeholder until publish job is done
const SMSPlaceholder = () => {
  const onClick = () => {
    toast.error('Publishing is still under development. This is a placeholder');
  };

  return <PublishButton loading={false} progress={0} onClick={onClick} />;
};

export default SMSPlaceholder;

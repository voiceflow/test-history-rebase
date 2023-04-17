import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useActiveProjectPlatformConfig, useActiveProjectTypeConfig } from '@/hooks';

const PlatformLogo: React.FC = () => {
  const platformConfig = useActiveProjectPlatformConfig();
  const platformTypeConfig = useActiveProjectTypeConfig();

  if (!platformConfig.oneClickPublish) {
    return null;
  }

  return (
    <TippyTooltip style={{ marginRight: 10 }} content={platformTypeConfig.name}>
      <SvgIcon icon={platformTypeConfig.logo ?? platformTypeConfig.icon.name} color={platformTypeConfig.icon.color} />
    </TippyTooltip>
  );
};

export default PlatformLogo;

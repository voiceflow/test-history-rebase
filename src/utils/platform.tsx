import React from 'react';

import { IS_DEVELOPMENT } from '@/config';
import { PlatformType } from '@/constants';
import { activePlatformSelector } from '@/ducks/skill/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import log from '@/utils/logger';

const getPlatformComponentSwitcher = (
  components: Partial<Record<PlatformType, React.FC>>,
  defaultComponent: React.FC
  // eslint-disable-next-line react/display-name
): React.FC<UploadProjectButtonType> => ({ platform }) => {
  const Component = React.useMemo(() => {
    if (platform in components) {
      return components[platform]!;
    }

    return defaultComponent;
  }, [platform]);

  return <Component />;
};

const mapStateToProps = {
  platform: activePlatformSelector,
};

type UploadProjectButtonType = ConnectedProps<typeof mapStateToProps>;

export const platformMissingValuesWarn = <T extends any>(valuesMap: Partial<Record<PlatformType, T>>, message: string, skipWarning?: boolean) => {
  if (!skipWarning && IS_DEVELOPMENT) {
    const missingPlatforms = Object.values(PlatformType).filter((key: PlatformType) => !valuesMap[key]);

    if (missingPlatforms.length) {
      log.warn(message, missingPlatforms.join(', '), valuesMap);
    }
  }
};

export const createPlatformComponent = (
  name: string,
  components: Partial<Record<PlatformType, React.FC>>,
  defaultComponent: React.FC = () => <div>Platform Component is not found!</div>,
  skipWarning?: boolean
) => {
  platformMissingValuesWarn(components, `${name} component has missing components for platforms:`, skipWarning);

  return connect(mapStateToProps)(getPlatformComponentSwitcher(components, defaultComponent));
};

export const getPlatformValue = <T extends any>(
  platform: PlatformType,
  platformValues: Partial<Record<PlatformType, T>>,
  defaultValue?: T,
  skipWarning?: boolean
) => {
  platformMissingValuesWarn(platformValues, "couldn't find platform values:", skipWarning);

  const value = platform in platformValues ? platformValues[platform] : defaultValue;
  if (!value) throw new Error('no value for platform');

  return value;
};

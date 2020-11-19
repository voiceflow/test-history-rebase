import React from 'react';

import { IS_DEVELOPMENT } from '@/config';
import { PlatformType } from '@/constants';
import { activePlatformSelector } from '@/ducks/skill/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import log from '@/utils/logger';

const PLATFORMS = Object.values(PlatformType);

const getPlatformComponentSwitcher = <T,>(
  components: Partial<Record<PlatformType, React.FC<T>>>,
  defaultComponent: React.FC<T>
  // eslint-disable-next-line react/display-name
): React.FC<PlatformComponentSwitcherProps & T> => ({ platform, ...props }) => {
  const Component = React.useMemo(() => {
    if (platform in components) {
      return components[platform]!;
    }

    return defaultComponent;
  }, [platform]);

  return <Component {...(props as T)} />;
};

const mapStateToProps = {
  platform: activePlatformSelector,
};

type PlatformComponentSwitcherProps = ConnectedProps<typeof mapStateToProps>;

export const platformMissingValuesWarn = <T extends any>(valuesMap: Partial<Record<PlatformType, T>>, message: string, skipWarning?: boolean) => {
  if (!skipWarning && IS_DEVELOPMENT) {
    const missingPlatforms = Object.values(PlatformType).filter((key: PlatformType) => !valuesMap[key]);

    if (missingPlatforms.length) {
      log.warn(message, missingPlatforms.join(', '), valuesMap);
    }
  }
};

export const createPlatformComponent = <T extends any>(
  name: string,
  components: Partial<Record<PlatformType, React.FC<T>>>,
  defaultComponent: React.FC<T> = () => <div>Platform Component is not found!</div>,
  skipWarning?: boolean
) => {
  platformMissingValuesWarn(components, `${name} component has missing components for platforms:`, skipWarning);

  return connect(mapStateToProps)(getPlatformComponentSwitcher(components, defaultComponent)) as React.FC<T>;
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

export const defaultPlatformsData = <T,>(data: T) =>
  PLATFORMS.reduce<Record<PlatformType, T>>((acc, platform) => Object.assign(acc, { [platform]: data }), {} as Record<PlatformType, T>);

import React from 'react';

import { PlatformType } from '@/constants';
import { activePlatformSelector } from '@/ducks/project/selectors';
import { ConnectedProps } from '@/types';

import { connect } from './connect';

const getPlatformComponentSwitcher = <T,>(
  components: Partial<Record<PlatformType, React.FC<T>>>,
  defaultComponent: React.FC<T>
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

// eslint-disable-next-line import/prefer-default-export
export const platformAware: {
  <T extends any>(components: Record<PlatformType, React.FC<T>>, defaultComponent?: React.FC<T>, skipWarning?: boolean): React.FC<T>;
  <T extends any>(components: Partial<Record<PlatformType, React.FC<T>>>, defaultComponent: React.FC<T>, skipWarning?: boolean): React.FC<T>;
} = <T extends any>(
  components: Partial<Record<PlatformType, React.FC<T>>>,
  defaultComponent: React.FC<T> = () => <div>Platform Component is not found!</div>
) => connect(mapStateToProps)(getPlatformComponentSwitcher(components, defaultComponent)) as React.FC<T>;

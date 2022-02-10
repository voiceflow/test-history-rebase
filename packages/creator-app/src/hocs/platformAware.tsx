import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { ConnectedProps } from '@/types';

import { connect } from './connect';

const getPlatformComponentSwitcher =
  <T,>(
    components: Partial<Record<VoiceflowConstants.PlatformType, React.FC<T>>>,
    defaultComponent: React.FC<T>
  ): React.FC<PlatformComponentSwitcherProps & T> =>
  ({ platform, ...props }) => {
    const Component = React.useMemo(() => {
      if (platform in components) {
        return components[platform]!;
      }

      return defaultComponent;
    }, [platform]);

    return <Component {...(props as T)} />;
  };

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
};

type PlatformComponentSwitcherProps = ConnectedProps<typeof mapStateToProps>;

// eslint-disable-next-line import/prefer-default-export
export const platformAware: {
  <T extends any>(
    components: Record<VoiceflowConstants.PlatformType, React.FC<T>>,
    defaultComponent?: React.FC<T>,
    skipWarning?: boolean
  ): React.FC<T>;
  <T extends any>(
    components: Partial<Record<VoiceflowConstants.PlatformType, React.FC<T>>>,
    defaultComponent: React.FC<T>,
    skipWarning?: boolean
  ): React.FC<T>;
} = <T extends any>(
  components: Partial<Record<VoiceflowConstants.PlatformType, React.FC<T>>>,
  defaultComponent: React.FC<T> = () => <div>Platform Component is not found!</div>
) => connect(mapStateToProps)(getPlatformComponentSwitcher(components, defaultComponent) as React.FC<PlatformComponentSwitcherProps>) as React.FC<T>;

import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks/redux';

export const platformAware: {
  <T>(components: Record<Platform.Constants.PlatformType, React.FC<T>>, defaultComponent?: React.FC<T>): React.FC<T>;
  <T>(components: Partial<Record<Platform.Constants.PlatformType, React.FC<T>>>, defaultComponent: React.FC<T>): React.FC<T>;
} =
  <T,>(
    components: Partial<Record<Platform.Constants.PlatformType, React.FC<T>>>,
    defaultComponent: React.FC<T> = () => <div>Platform Component is not found!</div>
  ) =>
  (props) => {
    const platform = useSelector(ProjectV2.active.platformSelector);
    const Component = components[platform]! || defaultComponent;

    return <Component {...(props as unknown as T & React.Attributes)} />;
  };

export const projectTypeAware: {
  <T>(components: Record<Platform.Constants.ProjectType, React.FC<T>>, defaultComponent?: React.FC<T>): React.FC<T>;
  <T>(components: Partial<Record<Platform.Constants.ProjectType, React.FC<T>>>, defaultComponent: React.FC<T>): React.FC<T>;
} =
  <T,>(
    components: Partial<Record<Platform.Constants.ProjectType, React.FC<T>>>,
    defaultComponent: React.FC<T> = () => <div>Platform Component is not found!</div>
  ) =>
  (props) => {
    const projectType = useSelector(ProjectV2.active.projectTypeSelector);
    const Component = components[projectType]! || defaultComponent;

    return <Component {...(props as unknown as T & React.Attributes)} />;
  };

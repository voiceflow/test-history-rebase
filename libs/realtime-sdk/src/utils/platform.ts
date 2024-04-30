import type { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';

import { PrototypeLayout } from '@/models';

import type { PlatformProjectType } from '../constants/platform';
import { legacyPlatformToProjectType } from '../constants/platform';

export const createProjectTypeSelector =
  <T>(values: Record<Platform.Constants.ProjectType, T>) =>
  (type?: Platform.Constants.ProjectType | null): T => {
    const value = values[type || Platform.Constants.ProjectType.VOICE];
    if (value == null) throw new Error('no value for project type');

    return value;
  };

export const createAdvancedProjectTypeSelector =
  <T extends Record<Platform.Constants.ProjectType, any>>(values: T) =>
  <P extends Platform.Constants.ProjectType>(platform: P): T[P] =>
    createProjectTypeSelector(values)(platform);

export const createPlatformAndProjectTypeSelector =
  <T>(
    values: Partial<Record<Platform.Constants.ProjectType | Platform.Constants.PlatformType | PlatformProjectType, T>>,
    defaultValue?: T
  ) =>
  (_platform: Nullish<Platform.Constants.PlatformType>, _type: Nullish<Platform.Constants.ProjectType>): T => {
    const mapping = _platform ? legacyPlatformToProjectType(_platform, _type) : null;

    // order of priority for checking in the selector:
    // 1. compound platform + type
    // 2. platform
    // 3. type
    const value =
      (mapping &&
        (values[`${mapping.platform}:${mapping.type}`] ?? values[mapping.platform] ?? values[mapping.type])) ??
      defaultValue;
    if (value == null) throw new Error('no value for platform');

    return value;
  };

export const createPlatformSelector =
  <T>(platformValues: Partial<Record<Platform.Constants.PlatformType, T>>, defaultValue?: T) =>
  (_platform?: Nullish<Platform.Constants.PlatformType | string>): T => {
    const platform = _platform ? legacyPlatformToProjectType(_platform).platform : _platform;

    const value =
      platform && platform in platformValues
        ? platformValues[platform as Platform.Constants.PlatformType]
        : defaultValue;

    if (value == null) throw new Error(`no value for platform ${platform}`);

    return value;
  };

export const createAdvancedPlatformSelector =
  <T extends Partial<Record<Platform.Constants.PlatformType, any>>, D = undefined>(
    platformValues: T,
    defaultValue?: D
  ) =>
  <P extends Platform.Constants.PlatformType>(platform: P): P extends keyof T ? T[P] : D =>
    createPlatformSelector(platformValues, defaultValue)(platform);

export const getPlatformValue: {
  <T>(
    platform: Platform.Constants.PlatformType,
    platformValues: Record<Platform.Constants.PlatformType, T>,
    defaultValue?: T
  ): T;
  <T>(
    platform: Platform.Constants.PlatformType,
    platformValues: Partial<Record<Platform.Constants.PlatformType, T>>,
    defaultValue: T
  ): T;
} = <T>(
  platform: Platform.Constants.PlatformType,
  platformValues: Partial<Record<Platform.Constants.PlatformType, T>>,
  defaultValue: T | undefined
) => createPlatformSelector(platformValues, defaultValue)(platform);

export const getDefaultPrototypeLayout = createProjectTypeSelector({
  [Platform.Constants.ProjectType.CHAT]: PrototypeLayout.TEXT_DIALOG,
  [Platform.Constants.ProjectType.VOICE]: PrototypeLayout.VOICE_DIALOG,
});

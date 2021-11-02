import { Models as BaseModels } from '@voiceflow/base-types';

export type { AnyDBVersion, AnyVersion, Version } from '@voiceflow/realtime-sdk';

export type DBVersion<
  P extends BaseModels.VersionPlatformData,
  C extends BaseModels.BaseCommand = BaseModels.BaseCommand,
  L extends string = string
> = BaseModels.Version<P, C, L>;

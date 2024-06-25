import type * as Realtime from '@voiceflow/realtime-sdk/backend';

export type CMSOnlyMigrationData = Omit<Realtime.Migrate.MigrationData['cms'], 'assistant'>;

export type InternalMigrationData = {
  [K in keyof CMSOnlyMigrationData]?: Record<number, CMSOnlyMigrationData[K]>;
};

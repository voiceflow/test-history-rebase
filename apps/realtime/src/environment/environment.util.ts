import { Injectable } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Patch } from 'immer';

type CMSOnlyMigrationData = Omit<Realtime.Migrate.MigrationData['cms'], 'assistant'>;
type InternalMigrationData = {
  [K in keyof CMSOnlyMigrationData]?: Record<number, CMSOnlyMigrationData[K]>;
};

@Injectable()
export class EnvironmentUtil {
  getUpdatedCMSData({ cms }: Realtime.Migrate.MigrationData, patches: Patch[]) {
    const data: InternalMigrationData = {};

    const isSupportedPath = (
      path: Array<string | number>
    ): path is ['cms', keyof InternalMigrationData] | ['cms', keyof InternalMigrationData, number] =>
      path[0] === 'cms' && (typeof path[2] === 'number' || path.length === 2);

    patches.forEach(({ path }) => {
      if (!isSupportedPath(path)) return;

      const [, resource, index] = path;

      // entire array is replaced
      if (index === undefined) {
        Object.assign(data!, { [resource]: cms[resource] });
      } else {
        // single item is replaced
        data[resource] ??= {};
        Object.assign(data[resource]!, { [index]: cms[resource][index] });
      }
    });

    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, Object.values(value)])) as Partial<CMSOnlyMigrationData>;
  }
}

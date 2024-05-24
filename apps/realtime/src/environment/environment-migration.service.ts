import { Inject, Injectable } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Patch } from 'immer';

import { EntityService } from '@/entity/entity.service';
import { FlowService } from '@/flow/flow.service';
import { FolderService } from '@/folder/folder.service';
import { IntentService } from '@/intent/intent.service';
import { ResponseService } from '@/response/response.service';
import { VariableService } from '@/variable/variable.service';
import { WorkflowService } from '@/workflow/workflow.service';

import { CMSOnlyMigrationData, InternalMigrationData } from './environment-migration.interface';

@Injectable()
export class EnvironmentMigrationService {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(FlowService)
    private readonly flow: FlowService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(FolderService)
    private readonly folder: FolderService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(VariableService)
    private readonly variable: VariableService,
    @Inject(WorkflowService)
    private readonly workflow: WorkflowService
  ) {}

  private getUpdatedCMSData({ cms }: Realtime.Migrate.MigrationData, patches: Patch[]) {
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

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, Object.values(value)])
    ) as Partial<CMSOnlyMigrationData>;
  }

  async migrateCMSData(
    data: Realtime.Migrate.MigrationData,
    patches: Patch[],
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const {
      flows = [],
      folders = [],
      intents = [],
      entities = [],
      responses = [],
      variables = [],
      workflows = [],
      utterances = [],
      entityVariants = [],
      requiredEntities = [],
      responseVariants = [],
      responseDiscriminators = [],
    } = this.getUpdatedCMSData(data, patches);

    // ORDER MATTERS
    await this.flow.upsertManyWithSubResources({ flows }, meta);
    await this.folder.upsertManyWithSubResources({ folders }, meta);
    await this.workflow.upsertManyWithSubResources({ workflows }, meta);
    await this.variable.upsertManyWithSubResources({ variables }, meta);
    await this.entity.upsertManyWithSubResources({ entities, entityVariants }, meta);
    await this.response.upsertManyWithSubResources(
      { responses, responseVariants, responseAttachments: [], responseDiscriminators },
      meta
    );
    await this.intent.upsertManyWithSubResources({ intents, utterances, requiredEntities }, meta);
  }
}

import type { Context, ServerMeta } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceActionControl } from '../utils';

class ImportProjectFromFile extends AbstractWorkspaceActionControl<Realtime.project.ImportProjectFromFile, Realtime.DBProject> {
  actionCreator = Realtime.project.importProjectFromFile;

  process = async (ctx: Context<Realtime.DBProject>, { payload }: Action<Realtime.project.ImportProjectFromFile>): Promise<void> => {
    const dbProject = await this.services.project.importFromFile(payload.workspaceID, Number(ctx.userId), payload.data);

    const [dbProjects, dbProjectLists] = await this.services.projectList.getAllWithNormalizedProjects(payload.workspaceID, Number(ctx.userId));

    await this.server.process(
      Realtime.project.crudActions.replace({ values: Realtime.Adapters.projectAdapter.mapFromDB(dbProjects), workspaceID: payload.workspaceID })
    );

    await this.server.process(
      Realtime.projectList.crudActions.replace({
        values: Realtime.Adapters.projectListAdapter.mapFromDB(dbProjectLists),
        workspaceID: payload.workspaceID,
      })
    );

    ctx.data = dbProject;
  };

  finally = (ctx: Context<Realtime.DBProject>, _action: Action<Realtime.project.ImportProjectFromFile>, meta: ServerMeta): void => {
    ctx.sendBack(Realtime.creator.actionProcessed({ actionID: meta.id, data: Realtime.Adapters.projectAdapter.fromDB(ctx.data) }));
  };
}

export default ImportProjectFromFile;

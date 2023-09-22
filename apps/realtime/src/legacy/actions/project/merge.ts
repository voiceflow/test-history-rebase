import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';
import ProjectsMerge from '@/utils/projectsMerge';

import { AbstractProjectResourceControl } from './utils';

interface ContextData extends WorkspaceContextData {
  dbDiagrams: BaseModels.Diagram.Model<BaseModels.BaseDiagramNode>[];
  targetVersionID: string;
}

class MergeProjects extends AbstractProjectResourceControl<Realtime.project.MergeProjectsPayload, ContextData> {
  protected actionCreator = Realtime.project.merge.started;

  protected resend = terminateResend;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  protected process = this.reply(Realtime.project.merge, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { workspaceID, sourceProjectID, targetProjectID } = payload;

    // eslint-disable-next-line no-console
    console.log('MERGE', { ctx, payload });

    const [sourceProject, targetProject] = await Promise.all([
      this.services.project.get(creatorID, sourceProjectID),
      this.services.project.get(creatorID, targetProjectID),
    ]);

    if (!sourceProject.devVersion || !targetProject.devVersion) throw new Error('no dev version found');

    // migrating projects to the latest version before merging
    await Promise.all([
      this.server.processAs(
        creatorID,
        Realtime.version.schema.negotiate.started({ versionID: sourceProject.devVersion, proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION })
      ),
      this.server.processAs(
        creatorID,
        Realtime.version.schema.negotiate.started({ versionID: targetProject.devVersion, proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION })
      ),
    ]);

    const [sourceVersion, targetVersion, sourceDiagrams] = await Promise.all([
      this.services.version.get(sourceProject.devVersion),
      this.services.version.get(targetProject.devVersion),
      this.services.diagram.getAll(sourceProject.devVersion),
    ]);

    const {
      nlu: targetNLU,
      type: targetProjectType,
      platform: targetProjectPlatform,
    } = Realtime.Adapters.projectAdapter.fromDB(targetProject, { members: [] });

    const targetProjectConfig = Platform.Config.getTypeConfig({ type: targetProjectType, platform: targetProjectPlatform });

    const projectsMerge = new ProjectsMerge({
      creatorID,
      targetProject,
      targetVersion,
      sourceProject,
      sourceVersion,
      sourceDiagrams,
    });

    const { newNotes, newFolders, newDomains, newProducts, newDiagrams, mergedSlots, newVariables, mergedIntents, newComponents, newCustomThemes } =
      projectsMerge.perform();

    const hasNewNotes = !!Object.keys(newNotes).length;
    const hasNewDomains = !!newDomains.length;
    const hasNewFolders = !!Object.keys(newFolders).length;
    const hasNewProducts = !!Object.keys(newProducts).length;
    const hasMergedSlots = !!mergedSlots.length;
    const hasNewDiagrams = !!newDiagrams.length;
    const hasNewVariables = !!newVariables.length;
    const hasNewComponents = !!newComponents.length;
    const hasMergedIntents = !!mergedIntents.length;
    const hasNewCustomThemes = !!newCustomThemes.length;

    // creating a new version before save merged data
    await this.services.version.snapshot(creatorID, targetVersion._id, { name: `Transferred "${sourceProject.name}" domain` });

    // storing merged data into the DB
    await Promise.all<unknown>([
      hasNewCustomThemes &&
        this.services.project.patch(creatorID, targetProjectID, {
          customThemes: [...(targetProject.customThemes ?? []), ...newCustomThemes],
          updatedAt: new Date().toJSON(),
          updatedBy: creatorID,
        }),

      hasNewProducts &&
        this.services.project.patchPlatformData(creatorID, targetProjectID, { products: { ...targetProject.platformData.products, ...newProducts } }),

      (hasNewNotes || hasNewDomains || hasNewFolders || hasNewComponents) &&
        this.services.version.patch(targetVersion._id, {
          ...(hasNewNotes && { notes: { ...targetVersion.notes, ...newNotes } }),
          ...(hasNewDomains && {
            domains: [
              ...(targetVersion.domains ?? []),
              ...newDomains.map((domain) => ({ ...domain, updatedAt: new Date().toJSON(), updatedBy: creatorID })),
            ],
          }),
          ...(hasNewFolders && { folders: { ...targetVersion.folders, ...newFolders } }),
          ...(hasNewVariables && { variables: [...(targetVersion.variables ?? []), ...newVariables] }),
          ...(hasNewComponents && { components: [...(targetVersion.components ?? []), ...newComponents] }),
        }),

      (hasMergedSlots || hasMergedIntents) &&
        this.services.version.patchPlatformData(targetVersion._id, {
          ...(hasMergedSlots && { slots: mergedSlots }),
          ...(hasMergedIntents && { intents: mergedIntents }),
        }),

      hasNewDiagrams && this.services.diagram.createMany(newDiagrams),
    ]);

    const actionContext = {
      projectID: targetProjectID,
      versionID: targetVersion._id,
      workspaceID,
    };

    const sharedNodes = this.services.diagram.getSharedNodes(newDiagrams);

    await Promise.all<unknown>([
      this.server.processAs(creatorID, Realtime.diagram.sharedNodes.reload({ ...actionContext, sharedNodes })),

      hasNewCustomThemes &&
        this.server.processAs(
          creatorID,
          Realtime.project.addManyCustomThemes({ ...actionContext, values: [...(targetProject.customThemes ?? []), ...newCustomThemes] })
        ),

      hasNewProducts &&
        this.server.processAs(
          creatorID,
          Realtime.product.crud.addMany({ ...actionContext, values: Realtime.Adapters.productAdapter.mapFromDB(Object.values(newProducts)) })
        ),

      hasNewNotes &&
        this.server.processAs(
          creatorID,
          Realtime.note.addMany({ ...actionContext, values: Realtime.Adapters.noteAdapter.mapFromDB(Object.values(newNotes)) })
        ),

      hasNewVariables &&
        this.server.processAs(
          creatorID,
          Realtime.version.variable.reloadGlobal({ ...actionContext, variables: [...(targetVersion.variables ?? []), ...newVariables] })
        ),

      hasMergedSlots &&
        this.server.processAs(creatorID, Realtime.slot.reload({ ...actionContext, slots: Realtime.Adapters.slotAdapter.mapFromDB(mergedSlots) })),

      hasMergedIntents &&
        this.server.processAs(
          creatorID,
          Realtime.intent.reload({
            ...actionContext,
            intents: targetProjectConfig.adapters.intent.smart.mapFromDB(mergedIntents),
            projectMeta: { nlu: targetNLU, type: targetProjectType, platform: targetProjectPlatform },
          })
        ),

      hasNewDiagrams &&
        this.server.processAs(
          creatorID,
          Realtime.diagram.crud.addMany({
            ...actionContext,
            values: Realtime.Adapters.diagramAdapter.mapFromDB(newDiagrams, { rootDiagramID: targetVersion.rootDiagramID }),
          })
        ),

      hasNewFolders &&
        this.server.processAs(creatorID, Realtime.version.reloadFolders({ ...actionContext, folders: { ...targetVersion.folders, ...newFolders } })),

      hasNewComponents && this.server.processAs(creatorID, Realtime.version.addManyComponents({ ...actionContext, components: newComponents })),

      hasNewDomains &&
        this.server.processAs(
          creatorID,
          Realtime.domain.crud.addMany({ ...actionContext, values: Realtime.Adapters.domainAdapter.mapFromDB(newDomains) })
        ),
    ]);
  });
}

export default MergeProjects;

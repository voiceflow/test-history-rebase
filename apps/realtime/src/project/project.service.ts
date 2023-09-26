import { Inject, Injectable } from '@nestjs/common';
import { Context, LoguxService } from '@voiceflow/nestjs-logux';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { LegacyService } from '@/legacy/legacy.service';
import ProjectsMerge from '@/utils/projectsMerge';

@Injectable()
export class ProjectService {
  constructor(@Inject(LoguxService) private readonly logux: LoguxService, @Inject(LegacyService) private readonly legacyService: LegacyService) {}

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async merge(creatorID: number, { payload }: { payload: Realtime.project.MergeProjectsPayload; ctx: Context.Action }) {
    const { workspaceID, sourceProjectID, targetProjectID } = payload;

    const [sourceProject, targetProject] = await Promise.all([
      this.legacyService.services.project.get(creatorID, sourceProjectID),
      this.legacyService.services.project.get(creatorID, targetProjectID),
    ]);

    if (!sourceProject.devVersion || !targetProject.devVersion) throw new Error('no dev version found');

    // migrating projects to the latest version before merging
    await Promise.all([
      this.logux.process({
        ...Realtime.version.schema.negotiate.started({ versionID: sourceProject.devVersion, proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION }),
        meta: { creatorID },
      }),
      this.logux.process({
        ...Realtime.version.schema.negotiate.started({ versionID: targetProject.devVersion, proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION }),
        meta: { creatorID },
      }),
    ]);

    const [sourceVersion, targetVersion, sourceDiagrams] = await Promise.all([
      this.legacyService.services.version.get(sourceProject.devVersion),
      this.legacyService.services.version.get(targetProject.devVersion),
      this.legacyService.services.diagram.getAll(sourceProject.devVersion),
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
    await this.legacyService.services.version.snapshot(creatorID, targetVersion._id, { name: `Transferred "${sourceProject.name}" domain` });

    // storing merged data into the DB
    await Promise.all<unknown>([
      hasNewCustomThemes &&
        this.legacyService.services.project.patch(creatorID, targetProjectID, {
          customThemes: [...(targetProject.customThemes ?? []), ...newCustomThemes],
          updatedAt: new Date().toJSON(),
          updatedBy: creatorID,
        }),

      hasNewProducts &&
        this.legacyService.services.project.patchPlatformData(creatorID, targetProjectID, {
          products: { ...targetProject.platformData.products, ...newProducts },
        }),

      (hasNewNotes || hasNewDomains || hasNewFolders || hasNewComponents) &&
        this.legacyService.services.version.patch(targetVersion._id, {
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
        this.legacyService.services.version.patchPlatformData(targetVersion._id, {
          ...(hasMergedSlots && { slots: mergedSlots }),
          ...(hasMergedIntents && { intents: mergedIntents }),
        }),

      hasNewDiagrams && this.legacyService.services.diagram.createMany(newDiagrams),
    ]);

    const actionContext = {
      projectID: targetProjectID,
      versionID: targetVersion._id,
      workspaceID,
    };

    const sharedNodes = this.legacyService.services.diagram.getSharedNodes(newDiagrams);

    await Promise.all<unknown>([
      this.logux.process({ ...Realtime.diagram.sharedNodes.reload({ ...actionContext, sharedNodes }), meta: { creatorID } }),

      hasNewCustomThemes &&
        this.logux.process({
          ...Realtime.project.addManyCustomThemes({ ...actionContext, values: [...(targetProject.customThemes ?? []), ...newCustomThemes] }),
          meta: { creatorID },
        }),

      hasNewProducts &&
        this.logux.process({
          ...Realtime.product.crud.addMany({ ...actionContext, values: Realtime.Adapters.productAdapter.mapFromDB(Object.values(newProducts)) }),
          meta: { creatorID },
        }),

      hasNewNotes &&
        this.logux.process({
          ...Realtime.note.addMany({ ...actionContext, values: Realtime.Adapters.noteAdapter.mapFromDB(Object.values(newNotes)) }),
          meta: { creatorID },
        }),

      hasNewVariables &&
        this.logux.process({
          ...Realtime.version.variable.reloadGlobal({ ...actionContext, variables: [...(targetVersion.variables ?? []), ...newVariables] }),
          meta: { creatorID },
        }),

      hasMergedSlots &&
        this.logux.process({
          ...Realtime.slot.reload({ ...actionContext, slots: Realtime.Adapters.slotAdapter.mapFromDB(mergedSlots) }),
          meta: { creatorID },
        }),

      hasMergedIntents &&
        this.logux.process({
          ...Realtime.intent.reload({
            ...actionContext,
            intents: targetProjectConfig.adapters.intent.smart.mapFromDB(mergedIntents),
            projectMeta: { nlu: targetNLU, type: targetProjectType, platform: targetProjectPlatform },
          }),
          meta: { creatorID },
        }),

      hasNewDiagrams &&
        this.logux.process({
          ...Realtime.diagram.crud.addMany({
            ...actionContext,
            values: Realtime.Adapters.diagramAdapter.mapFromDB(newDiagrams, { rootDiagramID: targetVersion.rootDiagramID }),
          }),
          meta: { creatorID },
        }),

      hasNewFolders &&
        this.logux.process({
          ...Realtime.version.reloadFolders({ ...actionContext, folders: { ...targetVersion.folders, ...newFolders } }),
          meta: { creatorID },
        }),

      hasNewComponents &&
        this.logux.process({ ...Realtime.version.addManyComponents({ ...actionContext, components: newComponents }), meta: { creatorID } }),

      hasNewDomains &&
        this.logux.process({
          ...Realtime.domain.crud.addMany({ ...actionContext, values: Realtime.Adapters.domainAdapter.mapFromDB(newDomains) }),
          meta: { creatorID },
        }),
    ]);
  }
}

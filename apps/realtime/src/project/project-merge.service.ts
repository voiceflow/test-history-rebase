/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { ProjectORM, VersionIntentORM, VersionJSONAdapter, VersionSlotORM } from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { MutableService } from '@/common';
import { CreatorService } from '@/creator/creator.service';
import { DiagramService } from '@/diagram/diagram.service';
import { ProjectsMerge } from '@/utils/projects-merge.util';
import { VersionService } from '@/version/version.service';

@Injectable()
export class ProjectMergeService extends MutableService<ProjectORM> {
  constructor(
    @Inject(ProjectORM)
    protected readonly orm: ProjectORM,
    @Inject(VersionSlotORM)
    private readonly versionSlotORM: VersionSlotORM,
    @Inject(VersionIntentORM)
    private readonly versionIntentORM: VersionIntentORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(CreatorService)
    private readonly creator: CreatorService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService
  ) {
    super();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async merge({ payload, authMeta }: { payload: Realtime.project.MergeProjectsPayload; authMeta: AuthMetaPayload }) {
    const { workspaceID, sourceProjectID, targetProjectID } = payload;

    const [sourceProject, targetProject] = await Promise.all([this.findOneOrFail(sourceProjectID), this.findOneOrFail(targetProjectID)]);

    if (!sourceProject.devVersion || !targetProject.devVersion) throw new Error('no dev version found');

    // migrating projects to the latest version before merging
    await Promise.all([
      this.logux.processAs(
        Realtime.version.schema.negotiate.started({
          versionID: sourceProject.devVersion.toJSON(),
          proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION,
        }),
        authMeta
      ),
      this.logux.processAs(
        Realtime.version.schema.negotiate.started({
          versionID: targetProject.devVersion.toJSON(),
          proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION,
        }),
        authMeta
      ),
    ]);

    const [sourceVersion, targetVersion, sourceDiagrams] = await Promise.all([
      this.version.findOneOrFail(sourceProject.devVersion.toJSON()),
      this.version.findOneOrFail(targetProject.devVersion.toJSON()),
      this.diagram.findManyByVersionID(sourceProject.devVersion.toJSON()),
    ]);

    const {
      nlu: targetNLU,
      type: targetProjectType,
      platform: targetProjectPlatform,
    } = Realtime.Adapters.projectAdapter.fromDB(targetProject as any, { members: [] });

    const targetProjectConfig = Platform.Config.getTypeConfig({ type: targetProjectType, platform: targetProjectPlatform });

    const projectsMerge = new ProjectsMerge({
      creatorID: authMeta.userID,
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
    const client = await this.creator.client.getByUserID(authMeta.userID);
    await client.version.snapshot(targetVersion.id, {
      name: `merge [${sourceProject.name}] into [${targetProject.name}] backup`,
      manualSave: true,
    });

    // storing merged data into the DB
    await Promise.all<unknown>([
      hasNewCustomThemes &&
        this.patchOne(targetProjectID, {
          customThemes: [...(targetProject.customThemes ?? []), ...newCustomThemes],
          updatedAt: new Date().toJSON(),
          updatedBy: authMeta.userID,
        }),

      hasNewProducts &&
        this.orm.patchOnePlatformData(targetProjectID, {
          products: { ...targetProject.platformData.products, ...newProducts },
        }),

      (hasNewNotes || hasNewDomains || hasNewFolders || hasNewComponents) &&
        this.version.patchOne(
          targetVersion._id,
          VersionJSONAdapter.fromDB({
            ...(hasNewNotes && { notes: { ...targetVersion.notes, ...newNotes } }),
            ...(hasNewDomains && { domains: [...(targetVersion.domains ?? []), ...newDomains] }),
            ...(hasNewFolders && { folders: { ...targetVersion.folders, ...newFolders } }),
            ...(hasNewVariables && { variables: [...(targetVersion.variables ?? []), ...newVariables] }),
            ...(hasNewComponents && { components: [...(targetVersion.components ?? []), ...newComponents] }),
          })
        ),

      hasMergedSlots && this.versionSlotORM.setAll(targetVersion.id, mergedSlots),

      hasMergedIntents && this.versionIntentORM.setAll(targetVersion.id, mergedIntents),

      hasNewDiagrams && this.diagram.createMany(newDiagrams),
    ]);

    const actionContext = {
      projectID: targetProjectID,
      versionID: targetVersion.id,
      workspaceID,
    };

    const sharedNodes = DiagramService.getAllSharedNodes(newDiagrams);

    await Promise.all<unknown>([
      this.logux.processAs(Realtime.diagram.sharedNodes.reload({ ...actionContext, sharedNodes }), authMeta),

      hasNewCustomThemes &&
        this.logux.processAs(
          Realtime.project.addManyCustomThemes({ ...actionContext, values: [...(targetProject.customThemes ?? []), ...newCustomThemes] }),
          authMeta
        ),

      hasNewProducts &&
        this.logux.processAs(
          Realtime.product.crud.addMany({ ...actionContext, values: Realtime.Adapters.productAdapter.mapFromDB(Object.values(newProducts)) }),
          authMeta
        ),

      hasNewNotes &&
        this.logux.processAs(
          Realtime.note.addMany({
            ...actionContext,
            values: Realtime.Adapters.noteAdapter.mapFromDB(Object.values(newNotes) as BaseModels.AnyNote[]),
          }),
          authMeta
        ),

      hasNewVariables &&
        this.logux.processAs(
          Realtime.version.variable.reloadGlobal({ ...actionContext, variables: [...(targetVersion.variables ?? []), ...newVariables] }),
          authMeta
        ),

      hasMergedSlots &&
        this.logux.processAs(Realtime.slot.reload({ ...actionContext, slots: Realtime.Adapters.slotAdapter.mapFromDB(mergedSlots) }), authMeta),

      hasMergedIntents &&
        this.logux.processAs(
          Realtime.intent.reload({
            ...actionContext,
            intents: targetProjectConfig.adapters.intent.smart.mapFromDB(mergedIntents),
            projectMeta: { nlu: targetNLU, type: targetProjectType, platform: targetProjectPlatform },
          }),
          authMeta
        ),

      hasNewDiagrams &&
        this.logux.processAs(
          Realtime.diagram.crud.addMany({
            ...actionContext,
            values: Realtime.Adapters.diagramAdapter.mapFromDB(newDiagrams, { rootDiagramID: targetVersion.rootDiagramID.toJSON() }),
          }),
          authMeta
        ),

      hasNewFolders &&
        this.logux.processAs(
          Realtime.version.reloadFolders({
            ...actionContext,
            folders: { ...targetVersion.folders, ...newFolders } as Record<string, BaseModels.Version.Folder>,
          }),
          authMeta
        ),

      hasNewComponents &&
        this.logux.processAs(
          Realtime.version.addManyComponents({ ...actionContext, components: newComponents as BaseModels.Version.FolderItem[] }),
          authMeta
        ),

      hasNewDomains &&
        this.logux.processAs(
          Realtime.domain.crud.addMany({
            ...actionContext,
            values: Realtime.Adapters.domainAdapter.mapFromDB(newDomains as BaseModels.Version.Domain[]),
          }),
          authMeta
        ),
    ]);
  }
}

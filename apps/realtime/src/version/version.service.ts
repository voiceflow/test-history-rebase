import { Inject, Injectable } from '@nestjs/common';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { ObjectId } from 'bson';
import _keyBy from 'lodash/keyBy';
import _mapValues from 'lodash/mapValues';
import { Optional } from 'utility-types';

import { DiagramService } from '@/diagram/diagram.service';
import { ProgramModelType } from '@/legacy/models/program';
import { ProjectORM } from '@/orm/project.orm';
import { VersionORM } from '@/orm/version.orm';
import { ProgramService } from '@/program/program.service';
import { PrototypeProgramService } from '@/prototype-program/prototype-program.service';
import { VariableStateService } from '@/variable-state/variable-state.service';

export interface VFFile {
  _version?: string;
  diagrams?: Record<string, BaseModels.Diagram.Model>;
  version?: BaseVersion.Version;
  project?: BaseModels.Project.Model<any, any> & { createdAt: Date };
  variableStates?: BaseModels.VariableState.Model[];
}

@Injectable()
export class VersionService {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(VersionORM) private readonly orm: VersionORM,
    @Inject(ProjectORM) private readonly projectORM: ProjectORM,
    @Inject(VariableStateService) private readonly variableStateService: VariableStateService,
    @Inject(ProgramService) private readonly programService: ProgramService,
    @Inject(PrototypeProgramService) private readonly prototypeProgramService: PrototypeProgramService,
    @Inject(DiagramService) private readonly diagramService: DiagramService
  ) {}

  async create({ manualSave = false, autoSaveFromRestore = false, ...version }: Optional<BaseVersion.Version>) {
    return this.orm.insertOne({ ...version, manualSave, autoSaveFromRestore });
  }

  async export(versionID: string, options: { centerDiagrams?: boolean; programs?: boolean; prototype?: boolean } = {}): Promise<VFFile> {
    const version = await this.orm.findByID(versionID);
    const project = await this.projectORM.findByID(version.projectID);

    project.members = [];

    const centerDiagrams = options.centerDiagrams === undefined || options.centerDiagrams;
    let diagrams = await this.diagramService.findManyByVersionID(versionID);

    if (centerDiagrams) {
      diagrams = this.diagramService.centerDiagrams(diagrams);
    }

    const diagramsByID = _keyBy(diagrams, '_id');

    const variableStates = await this.variableStateService.findManyByProjectID(version.projectID);
    const programModel = (options.programs && this.programService) || (options.prototype && this.prototypeProgramService);
    const programIDs = [...Object.keys(diagramsByID), versionID];
    const programs =
      programModel &&
      (await Promise.all(programIDs.map((diagramID) => programModel.findByID(diagramID).catch(() => null)))).reduce((acc, p) => {
        if (p) acc[p._id] = p;
        return acc;
      }, {} as Record<string, ProgramModelType>);

    // Remove stored `variableStateID` to avoid referencing the state from another user
    delete version?.prototype?.settings?.variableStateID;

    const mappedDiagrams = _mapValues(diagramsByID, (value) => ({
      ...value,
      nodes: this.diagramService.cleanupDiagramNodes(value.nodes),
    }));

    return {
      _version: String(project._version),
      project: {
        ...project,
        createdAt: new ObjectId(project._id).getTimestamp(),
      },
      version,
      diagrams: mappedDiagrams,
      ...(programs && { programs }),
      variableStates,

      // temporary for JPMC, remove after they have migrated
      ...(Object.keys(version.customBlocks || {}).length > 0 && {
        customBlocks: Object.values(version.customBlocks!).map(({ key, ...block }: any) => ({ ...block, _id: key, projectID: version.projectID })),
      }),
    };
  }

  public async patchPlatformData(versionID: string, platformData: Partial<BaseVersion.PlatformData>): Promise<void> {
    await this.orm.updatePlatformData(versionID, platformData);
  }

  public async get(versionID: string): Promise<BaseVersion.Version> {
    return this.orm.findByID(versionID);
  }

  async patch(versionID: string, data: Partial<BaseVersion.Version>): Promise<void> {
    await this.orm.updateByID(versionID, data);
  }

  public async replaceResources(
    versionID: string,
    version: BaseVersion.Version,
    diagrams: [diagramID: string, diagramPatch: BaseModels.Diagram.Model][]
  ): Promise<void> {
    await Promise.all(diagrams.map(([diagramID, diagramPatch]) => this.diagramService.patch(diagramID, diagramPatch)));

    await this.patch(versionID, version);
  }
}

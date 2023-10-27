import { Inject } from '@nestjs/common';
import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { ObjectId } from 'bson';

import { LegacyService } from '@/legacy/legacy.service';
import DiagramModel from '@/legacy/models/diagram';

import { PrimitiveDiagram } from '../diagram/diagram.interface';

export class DiagramORM {
  private readonly model: DiagramModel;

  constructor(@Inject(LegacyService) private legacyService: LegacyService) {
    this.model = this.legacyService.models.diagram;
  }

  private insertToDB = (data: PrimitiveDiagram): BaseModels.Diagram.Model => {
    const _id = data._id ?? new ObjectId().toHexString();
    const diagramID = data.diagramID ?? _id;

    return {
      ...data,
      _id,
      diagramID,
    };
  };

  public async findByID(id: string) {
    return this.model.findByID(id).then(this.model.adapter.fromDB);
  }

  public async updateByID(id: string, data: Partial<BaseModels.Diagram.Model>): Promise<void> {
    await this.model.updateByID(id, this.model.adapter.toDB(data));
  }

  public async findManyIdsByVersionID(versionID: string) {
    return this.model.findManyByVersionID(versionID, ['_id']).then((diagrams) => diagrams.map((diagram) => this.model.adapter.fromDB(diagram)._id));
  }

  public async findManyByVersionID(versionID: string) {
    return this.model.findManyByVersionID(versionID).then(this.model.adapter.mapFromDB);
  }

  public async findManyByIDs(ids: string[]) {
    return this.model.findManyByIDs(ids).then(this.model.adapter.mapFromDB);
  }

  public async insertMany(diagrams: BaseModels.Diagram.Model<BaseModels.BaseDiagramNode<AnyRecord>>[]) {
    return this.model.insertMany(this.model.adapter.mapToDB(diagrams)).then(this.model.adapter.mapFromDB);
  }

  public async create(data: PrimitiveDiagram): Promise<BaseModels.Diagram.Model> {
    return this.model.insertOne(this.model.adapter.toDB(this.insertToDB(data))).then(this.model.adapter.fromDB);
  }

  public async createMany(data: PrimitiveDiagram[]): Promise<BaseModels.Diagram.Model[]> {
    return this.model.insertMany(this.model.adapter.mapToDB(data.map(this.insertToDB))).then(this.model.adapter.mapFromDB);
  }
}

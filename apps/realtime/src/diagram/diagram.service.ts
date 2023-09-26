import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';

import { DiagramORM } from './diagram.orm';

@Injectable()
export class DiagramService {
  constructor(@Inject(DiagramORM) private readonly orm: DiagramORM) {}

  public async get(diagramID: string): Promise<BaseModels.Diagram.Model> {
    return this.orm.findByID(diagramID);
  }

  public async patch(diagramID: string, data: BaseModels.Diagram.Model): Promise<void> {
    await this.orm.updateByID(diagramID, data);
  }

  public async cloneMany(creatorID: number, newVersionID: string, oldDiagramIDs: string[]) {
    return { creatorID, newVersionID, oldDiagramIDs } as any;
  }

  public async create(data: any) {
    return { ...data } as any;
  }

  public async getAll(data: any) {
    return { ...data } as any;
  }

  public async createMany(data: any) {
    return { ...data } as any;
  }

  public async getSharedNodes(data: any) {
    return { ...data } as any;
  }

  public async findManyByVersionID(versionID: string): Promise<string[]> {
    return this.findManyByVersionID(versionID);
  }
}

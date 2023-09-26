import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';

import { LegacyService } from '@/legacy/legacy.service';
import DiagramModel from '@/legacy/models/diagram';

@Injectable()
export class DiagramORM {
  private readonly model: DiagramModel;

  constructor(@Inject(LegacyService) private readonly legacyService: LegacyService) {
    this.model = this.legacyService.models.diagram;
  }

  public async findByID(diagramID: string) {
    return this.model.findByID(diagramID).then(this.model.adapter.fromDB);
  }

  public async updateByID(diagramID: string, data: BaseModels.Diagram.Model): Promise<void> {
    await this.model.updateByID(diagramID, this.model.adapter.toDB(data));
  }

  public async findManyByVersionID(versionID: string) {
    return this.model.findManyByVersionID(versionID, ['_id']).then((diagrams) => diagrams.map((diagram) => this.model.adapter.fromDB(diagram)._id));
  }
}

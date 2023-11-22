import { MongoORM } from '../common';
import { ProjectTemplateEntity } from './project-template.entity';

export class ProjectTemplateORM extends MongoORM(ProjectTemplateEntity) {
  async findOneByPlatformAndTag(platform: string, tag = 'default'): Promise<ProjectTemplateEntity | null> {
    const result = await this.find({ platform, tag }, { limit: 1 });

    return result[0] ?? null;
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { BackupService } from '@/backup/backup.service';
import { EnvironmentService } from '@/environment/environment.service';
import { ProjectService } from '@/project/project.service';

@Injectable()
export class AssistantPublishService {
  constructor(
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(BackupService)
    private readonly backup: BackupService,
    @Inject(EnvironmentService)
    private readonly environment: EnvironmentService
  ) {}

  public async publish(assistantID: string, userID: number, name?: string) {
    const project = await this.project.findOneOrFail(assistantID);

    if (!project.devVersion) {
      throw new Error('Project does not have a development version');
    }

    const devVersionID = project.devVersion.toString();

    await this.backup.createOneForUser(userID, devVersionID, name ?? 'Automatic before publishing');

    const liveVersionID = project.liveVersion?.toString();

    const { version } = await this.environment.cloneOne({
      sourceEnvironmentID: devVersionID,
      targetEnvironmentID: liveVersionID,
      targetVersionOverride: { name: name ?? 'Production', creatorID: userID },
    });

    if (!liveVersionID) {
      project.liveVersion = version._id;

      await this.project.patchOne(assistantID, { liveVersion: version._id });
    }

    return project;
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { DiagramService } from '@/diagram/diagram.service';
import { BackupService } from '@/project/backup/backup.service';
import { ProjectService } from '@/project/project.service';
import { VersionService } from '@/version/version.service';

@Injectable()
export class AssistantPublishService {
  constructor(
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(BackupService)
    private readonly backup: BackupService
  ) {}

  public async publish(assistantID: string, userID: number) {
    const project = await this.project.findOneOrFail(assistantID);

    if (!project.devVersion) {
      throw new Error('Project does not have a development version');
    }

    const versionID = project.liveVersion?.toString();

    if (versionID) {
      await this.backup.createOneForUser(userID, versionID, 'Automatic before publishing');
      await Promise.all([this.version.deleteOne(versionID), this.diagram.deleteManyByVersionID(versionID)]);
    }

    const { version } = await this.version.cloneOne({
      sourceVersionID: project.devVersion.toString(),
      sourceVersionOverride: versionID ? { _id: versionID, name: 'Production', creatorID: userID } : undefined,
    });

    if (!versionID) {
      await this.project.patchOne(assistantID, { liveVersion: version.id });
    }

    project.liveVersion = version._id;

    return project;
  }
}

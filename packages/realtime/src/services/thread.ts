import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '@/control';

class ThreadService extends AbstractControl {
  public async getAll(creatorID: number, projectID: string): Promise<Realtime.Thread[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.thread.find(projectID);
  }

  public async get(creatorID: number, projectID: string, threadID: string): Promise<Realtime.Thread> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.thread.get(projectID, threadID);
  }

  public async create(creatorID: number, projectID: string, thread: Realtime.NewThread): Promise<Realtime.Thread> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.thread.create(projectID, thread);
  }

  public async update(creatorID: number, projectID: string, threadID: string, data: Partial<Realtime.Thread>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    await client.thread.update(projectID, threadID, data);
  }

  public async removeManyByDiagramIDs(creatorID: number, projectID: string, diagramIDs: string[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.thread.removeMany(projectID, { diagramIDs });
  }

  public async createComment(creatorID: number, projectID: string, threadID: string, comment: Realtime.NewComment): Promise<Realtime.Comment> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.thread.comment.create(projectID, threadID, comment);
  }

  public async updateComment(creatorID: number, projectID: string, commentID: string, comment: Realtime.NewComment): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    await client.thread.comment.update(projectID, commentID, comment);
  }

  public async deleteComment(creatorID: number, projectID: string, commentID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    await client.thread.comment.delete(projectID, commentID);
  }
}

export default ThreadService;

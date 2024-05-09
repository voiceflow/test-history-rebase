import { ObjectId } from '@mikro-orm/mongodb';
import type { RefreshJob } from '@voiceflow/dtos';

import { Atomic, MongoAtomicORM } from '../common';
import { RefreshJobsEntity } from './refresh-jobs.entity';
import { RefreshJobsJsonAdapter } from './refresh-jobs-json.adapter';

export class RefreshJobsOrm extends MongoAtomicORM<RefreshJobsEntity> {
  Entity = RefreshJobsEntity;

  jsonAdapter = RefreshJobsJsonAdapter;

  async findManyByDocumentIDs(projectID: string, documentIDs: string[]) {
    return this.find({
      projectID: new ObjectId(projectID),
      documentID: documentIDs.map((id) => new ObjectId(id)),
    });
  }

  async bulkUpsert(jobs: Partial<RefreshJob>[]) {
    const bulkOperations = jobs.map((job) => {
      const { projectID, documentID, ...updateFields } = job;
      const filter = { projectID: new ObjectId(projectID), documentID: new ObjectId(documentID) };

      const updateEntries = Object.entries(updateFields)
        .filter(([_, value]) => value !== undefined) // Filter out entries with undefined values
        .map(([key, value]) => ({ path: key, value }));

      return {
        filter,
        updateEntries,
      };
    });

    const bulkUpdates = bulkOperations.map(({ filter, updateEntries }) => {
      return this.atomicUpdate(filter, [Atomic.Set(updateEntries)], { upsert: true });
    });

    await Promise.all(bulkUpdates);
  }

  async deleteManyByDocumentIDs(projectID: string, documentIDs: string[]) {
    if (documentIDs.length === 0) {
      return;
    }

    await this.delete({
      projectID: new ObjectId(projectID),
      documentID: { $in: documentIDs.map((id) => new ObjectId(id)) },
    });
  }

  async updateChecksum(projectID: string, documentID: string, checksum: string) {
    try {
      await this.atomicUpdate({ projectID: new ObjectId(projectID), documentID: new ObjectId(documentID) }, [
        Atomic.Set([{ path: [checksum], value: checksum }]),
      ]);
    } catch {
      /* empty */
    }
  }

  async attachManyTags(projectID: string, documentID: string, tagIDs: string[]) {
    try {
      await this.atomicUpdate({ projectID: new ObjectId(projectID), documentID: new ObjectId(documentID) }, [
        Atomic.AddToSet([{ path: 'tags', value: tagIDs }]),
      ]);
    } catch {
      /* empty */
    }
  }

  async detachManyTags(projectID: string, documentID: string, tagIDs: string[]) {
    try {
      await this.atomicUpdate({ projectID: new ObjectId(projectID), documentID: new ObjectId(documentID) }, [
        Atomic.PullAll([{ path: 'tags', match: tagIDs }]),
      ]);
    } catch {
      /* empty */
    }
  }
}

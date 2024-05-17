import { Inject, Injectable } from '@nestjs/common';
import { AmqpQueueMessagePriority, KBDocumentUrlData, KnowledgeBaseDocumentRefreshRate, RefreshJob } from '@voiceflow/dtos';
import { IntegrationOauthTokenORM, RefreshJobsOrm, VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
import { Topic } from '@voiceflow/sdk-message-queue';
import { MessageQueueService } from '@voiceflow/sdk-message-queue/nestjs';
import dayjs from 'dayjs';

import { MutableService } from '@/common';
import { AesEncryptionClient } from '@/common/clients/aes-encryption/aes-encryption.client';

@Injectable()
export class RefreshJobService extends MutableService<RefreshJobsOrm> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(RefreshJobsOrm)
    protected readonly orm: RefreshJobsOrm,

    @Inject(MessageQueueService)
    private readonly messageQueueService: MessageQueueService,
    @Inject(IntegrationOauthTokenORM)
    protected readonly integrationOauthTokenORM: IntegrationOauthTokenORM,
    @Inject(AesEncryptionClient)
    protected readonly aesEncryptionClient: AesEncryptionClient
  ) {
    super();
  }

  calculateExecuteAt(refreshRate: KnowledgeBaseDocumentRefreshRate | undefined): Date {
    switch (refreshRate) {
      case KnowledgeBaseDocumentRefreshRate.DAILY:
        return dayjs().add(1, 'day').toDate();
      case KnowledgeBaseDocumentRefreshRate.WEEKLY:
        return dayjs().add(1, 'week').toDate();
      case KnowledgeBaseDocumentRefreshRate.MONTHLY:
        return dayjs().add(1, 'month').toDate();
      default:
        throw new Error('Invalid refresh rate');
    }
  }

  async getIntegrationTokensMapping(integrationTokenIDSet: Set<number>): Promise<Record<number, string>> {
    const integrationTokensArray = await this.integrationOauthTokenORM.find({ id: [...integrationTokenIDSet] });

    return integrationTokensArray.reduce<Record<number, string>>((acc, obj) => {
      const { id, accessToken } = obj;
      acc[id] = this.aesEncryptionClient.decrypt(accessToken.toString());
      return acc;
    }, {});
  }

  async getExistingJobsMapping(
    projectID: string,
    documentIDs: string[]
  ): Promise<Record<string, Pick<RefreshJob, 'checksum' | 'executeAt' | 'refreshRate'>>> {
    const existingRefreshJobs = await this.orm.findManyByDocumentIDs(projectID, documentIDs);

    return existingRefreshJobs.reduce((result, obj) => {
      const { documentID, checksum, executeAt, refreshRate } = obj;
      const tmp = { ...result };
      tmp[documentID.toJSON()] = {
        checksum: checksum ?? undefined,
        executeAt,
        refreshRate,
      };
      return tmp;
    }, {} as Record<string, Pick<RefreshJob, 'checksum' | 'executeAt' | 'refreshRate'>>);
  }

  async sendRefreshJobsToQueue(
    refreshJobsToSend: (Pick<RefreshJob, 'projectID' | 'documentID' | 'workspaceID' | 'url' | 'checksum'> & {
      source?: string;
      accessToken?: string | null;
    })[],
    messagePriority: AmqpQueueMessagePriority = AmqpQueueMessagePriority.HIGH
  ) {
    await Promise.all(
      refreshJobsToSend.map(async (job) => {
        this.messageQueueService.publish(
          Topic.KBParserDocumentRefreshV1,
          {
            projectID: job.projectID,
            documentID: job.documentID,
            workspaceID: job.workspaceID.toString(),
            url: job.url,
            checksum: job.checksum,
            source: job.source,
            accessToken: job.accessToken ?? undefined,
          },
          { priority: messagePriority }
        );
      })
    );
  }

  async sendRefreshJobs(
    projectID: string,
    documents: Pick<VersionKnowledgeBaseDocument, 'documentID' | 'data' | 'tags'>[],
    workspaceID: number,
    messagePriority: AmqpQueueMessagePriority = AmqpQueueMessagePriority.HIGH
  ) {
    const documentIDs: string[] = [];
    const integrationTokenIDSet: Set<number> = new Set();

    documents.forEach((doc) => {
      const data = doc.data as KBDocumentUrlData;

      documentIDs.push(doc.documentID);
      if (data?.accessTokenID) {
        integrationTokenIDSet.add(data?.accessTokenID);
      }
    });

    const integrationTokensMapping: Record<number, string> = await this.getIntegrationTokensMapping(integrationTokenIDSet);

    const existingJobsMapping: Record<string, Pick<RefreshJob, 'checksum' | 'executeAt' | 'refreshRate'>> = await this.getExistingJobsMapping(
      projectID,
      documentIDs
    );

    const refreshJobsToSend: (Pick<RefreshJob, 'projectID' | 'documentID' | 'workspaceID' | 'url' | 'checksum'> & {
      source?: string;
      accessToken?: string | null;
    })[] = documents.map((doc) => {
      let checksum: string | undefined;
      let integrationSource: string | undefined;
      let integrationAccessToken: string | undefined | null;
      const data = doc.data as KBDocumentUrlData;

      if (doc.documentID && doc.documentID.toString() in existingJobsMapping) {
        checksum = existingJobsMapping[doc.documentID.toString()].checksum;
      }

      if (data?.integrationExternalID) {
        integrationSource = data?.source;
        integrationAccessToken = data?.accessTokenID ? integrationTokensMapping[data?.accessTokenID] : null;
      }

      return {
        projectID,
        documentID: doc.documentID,
        workspaceID,
        url: data?.url,
        checksum,
        tags: doc.tags,
        // integrations use fields
        source: integrationSource,
        accessToken: integrationAccessToken,
      };
    });

    await this.sendRefreshJobsToQueue(refreshJobsToSend, messagePriority);
  }

  async updateMany(updateRefreshJobs: Partial<RefreshJob>[]) {
    if (updateRefreshJobs.length === 0) {
      return;
    }

    const jobsWithExecuteAt = updateRefreshJobs.map((job) => {
      return {
        ...job,
        executeAt: this.calculateExecuteAt(job?.refreshRate),
      };
    });

    await this.orm.bulkUpsert(jobsWithExecuteAt);
  }

  async updateChecksum(projectID: string, documentID: string, checksum: string) {
    await this.orm.updateChecksum(projectID, documentID, checksum);
  }
}

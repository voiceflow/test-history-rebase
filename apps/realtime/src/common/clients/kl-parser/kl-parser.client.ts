import { Inject, Injectable } from '@nestjs/common';
import type { BaseModels } from '@voiceflow/base-types';
import type { KnowledgeBaseSettings } from '@voiceflow/dtos';
import { BadRequestException } from '@voiceflow/exception';
import * as fetch from '@voiceflow/fetch';
import type { VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
import undici from 'undici';

import type { FetchClient } from '@/common/fetch';

import type { KlParserModuleOptions } from './kl-parser.interface';
import { KL_PARSER_MODULE_OPTIONS_TOKEN } from './kl-parser.module-definition';

@Injectable()
export class KlParserClient {
  private readonly client: FetchClient;

  constructor(
    @Inject(KL_PARSER_MODULE_OPTIONS_TOKEN)
    private options: KlParserModuleOptions
  ) {
    const { host, port, nodeEnv } = this.options;

    const scheme = nodeEnv === 'e2e' ? 'https' : 'http';

    const baseURL = host && port ? new URL(`${scheme}://${host}:${port}`).href : '';

    this.client = new fetch.FetchClient(undici.fetch, { baseURL });
  }

  public async deleteMany(projectID: string, documentIDs: string[], workspaceID: string) {
    return this.client
      .post(`api/v1/projects/${projectID}/documents/delete-many`, {
        json: {
          documentIDs,
          workspaceID,
          bucket: this.options.bucket,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error during vector removal process');
      });
  }

  public async updateDocument(
    projectID: string,
    document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date },
    workspaceID: string,
    settings: Pick<BaseModels.Project.KnowledgeBaseSettings, 'chunkStrategy'>
  ) {
    return this.client
      .patch(`api/v1/projects/${projectID}/documents/${document.documentID}`, {
        json: {
          projectID,
          workspaceID,
          document,
          settings,
          bucket: this.options.bucket,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error during update document metadata fields');
      });
  }

  public async parse(
    projectID: string,
    document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date },
    workspaceID: string,
    settings: Pick<KnowledgeBaseSettings, 'chunkStrategy' | 'embeddingModel'>,
    metadata?: object // no strict structure of metadata field
  ) {
    return this.client
      .post('parse', {
        json: {
          projectID,
          document,
          workspaceID,
          bucket: this.options.bucket,
          settings,
          metadata,
        },
      })
      .catch(() => null);
  }

  // eslint-disable-next-line max-params
  public async uploadTable(
    workspaceID: string,
    projectID: string,
    document: Omit<VersionKnowledgeBaseDocument, 's3ObjectRef'>,
    searchableFields: string[],
    items: object[],
    metadataFields?: string[]
  ) {
    return this.client
      .post(`api/v1/projects/${projectID}/documents/table`, {
        json: {
          workspaceID,
          document,
          searchableFields,
          items,
          metadataFields,
          bucket: this.options.bucket,
        },
      })
      .catch(() => null);
  }
}

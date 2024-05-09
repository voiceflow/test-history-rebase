import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import * as fetch from '@voiceflow/fetch';
import { VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
import undici from 'undici';

import { FetchClient } from '@/common/fetch';

import { KlParserModuleOptions } from './kl-parser.interface';
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
    return this.client.post(`api/v1/projects/${projectID}/documents/delete-many`, {
      json: {
        documentIDs,
        workspaceID,
        bucket: this.options.bucket,
      },
    });
  }

  public async parse(
    projectID: string,
    document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date },
    workspaceID: string,
    settings: Pick<BaseModels.Project.KnowledgeBaseSettings, 'chunkStrategy'>
  ) {
    return this.client.post('parse', {
      json: {
        projectID,
        document,
        workspaceID,
        bucket: this.options.bucket,
        settings,
      },
    });
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
    return this.client.post(`api/v1/projects/${projectID}/documents/table`, {
      json: {
        workspaceID,
        document,
        searchableFields,
        items,
        metadataFields,
        bucket: this.options.bucket,
      },
    });
  }
}

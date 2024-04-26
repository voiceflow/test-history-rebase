import { Inject, Injectable } from '@nestjs/common';
import type { KBDocumentChunk } from '@voiceflow/dtos';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';
import { z } from 'zod';

import { MutableService } from '@/common';
import { FileService } from '@/file/file.service';
import { UploadType } from '@/file/types';

import { knowledgeBaseDocumentAdapter } from './document.adapter';
import { KBDocumentInsertChunkDTO } from './dtos/document-chunk.dto';

@Injectable()
export class KnowledgeBaseDocumentService extends MutableService<KnowledgeBaseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,

    @Inject(FileService)
    private readonly file: FileService
  ) {
    super();
  }

  /* Find */

  async findOneDocument(assistantID: string, documentID: string) {
    const [document, chunks] = await Promise.all([
      this.orm.findOneDocument(assistantID, documentID),
      this.findDocumentChunks(assistantID, documentID),
    ]);

    return document ? { ...knowledgeBaseDocumentAdapter.fromDB(document), chunks } : undefined;
  }

  async findManyDocuments(assistantID: string, documentIDs?: string[]) {
    const documents = documentIDs
      ? await this.orm.findManyDocuments(assistantID, documentIDs)
      : await this.orm.findAllDocuments(assistantID);
    return documents.map((document) => knowledgeBaseDocumentAdapter.fromDB(document));
  }

  async findDocumentChunks(assistantID: string, documentID: string): Promise<KBDocumentChunk[]> {
    const file = await this.file.downloadFile(UploadType.KB_DOCUMENT, `${assistantID}/embeddings/${documentID}.json`);

    const rawChunks = file ? z.array(KBDocumentInsertChunkDTO).parse(JSON.parse(await file.transformToString())) : [];

    return rawChunks
      ? rawChunks.map(({ id, metadata }) => ({
          chunkID: id,
          content: metadata.content,
        }))
      : [];
  }

  /* Delete */

  async deleteManyDocuments(ids: string[], assistantID: string) {
    await this.orm.deleteManyDocuments(assistantID, ids);
  }
}

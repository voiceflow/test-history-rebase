import { Inject, Injectable } from '@nestjs/common';
import type {
  KBDocumentChunk,
  KBDocumentDocxData,
  KBDocumentPDFData,
  KBDocumentTableData,
  KBDocumentTextData,
  KBDocumentUrlData,
  KnowledgeBaseDocument,
} from '@voiceflow/dtos';
import { KnowledgeBaseDocumentType } from '@voiceflow/dtos';
import { KnowledgeBaseORM, VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
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

  async findManyDocuments(assistantID: string, documentIDs?: string[]): Promise<KnowledgeBaseDocument[]> {
    const documents = documentIDs ? await this.orm.findManyDocuments(assistantID, documentIDs) : await this.orm.findAllDocuments(assistantID);
    return documents.map((document: VersionKnowledgeBaseDocument) => knowledgeBaseDocumentAdapter.fromDB(document));
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

  /* Patch */

  async patchOneDocument(
    assistantID: string,
    documentID: string,
    document: Omit<Partial<KnowledgeBaseDocument>, 'documentID' | 'status' | 'updatedAt'>
  ) {
    const doc = await this.findOneDocument(assistantID, documentID);
    if (doc?.data?.type === KnowledgeBaseDocumentType.URL) {
      const urlData = doc?.data as KBDocumentUrlData;

      // check that integration doc type and integration did not remove
      if (urlData?.source && !urlData?.accessTokenID) {
        return;
      }
    }

    await this.orm.patchOneDocument(assistantID, documentID, document);
  }

  async patchManyDocuments(
    assistantID: string,
    documentIDs: string[],
    patch: Omit<Partial<KnowledgeBaseDocument>, 'documentID' | 'status' | 'updatedAt' | 'data'> & {
      data:
        | Partial<KBDocumentUrlData>
        | Partial<KBDocumentDocxData>
        | Partial<KBDocumentPDFData>
        | Partial<KBDocumentTableData>
        | Partial<KBDocumentTextData>;
    }
  ) {
    const documents = await this.findManyDocuments(assistantID, documentIDs);
    const validDocumentIDs = documentIDs.filter(async (documentID) => {
      const document = documents.find((doc) => doc.documentID === documentID);

      if (document?.data?.type === KnowledgeBaseDocumentType.URL) {
        const urlData = document?.data as KBDocumentUrlData;

        // check that integration doc type and integration did not remove
        if (urlData?.source && !urlData?.accessTokenID) {
          return null;
        }
      }

      return documentID;
    });

    await this.orm.patchManyDocuments(assistantID, validDocumentIDs, patch);
  }

  /* Delete */

  async deleteManyDocuments(ids: string[], assistantID: string) {
    await this.orm.deleteManyDocuments(assistantID, ids);
  }
}

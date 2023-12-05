import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { logger, useContextApi } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import useFilter from '@/pages/NLUManager/hooks/useFilter';
import useTable from '@/pages/NLUManager/hooks/useTable';

import { downloadFileType, MIME_FILE_TYPE } from '../pages/CMSKnowledgeBase/CMSKnowledgeBase.constant';

export type KnowledgeBaseTableItem = BaseModels.Project.KnowledgeBaseDocument & { id: string };

export interface CMSKnowledgeBaseContextState {
  updatedAt: Date | null;
  documents: KnowledgeBaseTableItem[];
  processingDocumentIds: string[];
  finishedProcessingDocumentIds: (string | KnowledgeBaseTableItem)[];
  activeDocumentID: string | null;
  editorOpen: boolean;
}

export interface KnowledgeBaseChunks {
  chunkID: string;
  content: string;
}

export interface KnowledgeBaseEditorItem extends BaseModels.Project.KnowledgeBaseDocument {
  chunks: KnowledgeBaseChunks[];
}

export interface CMSKnowledgeBaseContextActions {
  sync: () => Promise<void>;
  resync: (documents: string[]) => Promise<void>;
  create: (datas: BaseModels.Project.KnowledgeBaseDocument['data'][]) => Promise<{
    documents: BaseModels.Project.KnowledgeBaseDocument[];
    hasError: boolean;
  }>;
  upload: (files: FileList | File[]) => Promise<{ successes: string[]; hasFailures: boolean }>;
  download: (documentID: string) => Promise<any>;
  openPdfFile: (documentID: string) => Promise<void>;
  remove: (documentID: string) => Promise<boolean>;
  get: (documentID: string) => Promise<KnowledgeBaseEditorItem>;
  createDocument: (text: string) => Promise<{
    documents: BaseModels.Project.KnowledgeBaseDocument[];
    hasError: boolean;
  }>;
  setActiveDocumentID: React.Dispatch<React.SetStateAction<string | null>>;
  setEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CMSKnowledgeBaseContextStructure {
  state: CMSKnowledgeBaseContextState;
  actions: CMSKnowledgeBaseContextActions;
  table: ReturnType<typeof useTable>;
  filter: ReturnType<typeof useFilter>;
}

const defaultKnowledgeBaseContext: CMSKnowledgeBaseContextStructure = {
  state: {
    updatedAt: null,
    documents: [],
    processingDocumentIds: [],
    finishedProcessingDocumentIds: [],
    activeDocumentID: null,
    editorOpen: false,
  },
  actions: {
    sync: async () => {},
    resync: async () => {},
    create: async () => {
      return { documents: [] as BaseModels.Project.KnowledgeBaseDocument[], hasError: false };
    },
    upload: async () => {
      return { successes: [] as string[], hasFailures: false };
    },
    download: async () => {},
    openPdfFile: async () => {},
    remove: async () => {
      return true;
    },
    get: async () => {
      return {} as KnowledgeBaseEditorItem;
    },
    createDocument: async () => {
      return { documents: [] as BaseModels.Project.KnowledgeBaseDocument[], hasError: false };
    },
    setActiveDocumentID: () => {},
    setEditorOpen: () => {},
  },
  table: {} as any,
  filter: {} as any,
};

export const CMSKnowledgeBaseContext = React.createContext(defaultKnowledgeBaseContext);
export const { Consumer: CMSKnowledgeBaseConsumer } = CMSKnowledgeBaseContext;

const isDocumentValid = (document: Partial<BaseModels.Project.KnowledgeBaseDocument>): document is BaseModels.Project.KnowledgeBaseDocument => {
  return !!document.data;
};

export const CMSKnowledgeBaseProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const projectID = useSelector(Session.activeProjectIDSelector);

  const [documents, setDocuments] = React.useState<KnowledgeBaseTableItem[]>([]);
  const [processingDocumentIds, setProcessingDocumentIds] = React.useState<string[]>([]);
  const [finsihedDocumentIds, setFinishedDocumentIds] = React.useState<(string | KnowledgeBaseTableItem)[]>([]);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);
  const [activeDocumentID, setActiveDocumentID] = React.useState<string | null>(null);
  const [editorOpen, setEditorOpen] = React.useState<boolean>(false);
  const table = useTable(null);
  const filter = useFilter();

  const addDocuments = React.useCallback((documents: BaseModels.Project.KnowledgeBaseDocument[]) => {
    setDocuments((prevDocuments) => {
      const documentMap = Object.fromEntries(prevDocuments.map((document) => [document.documentID, document]));
      documents.forEach((document) => {
        documentMap[document.documentID] = {
          ...document,
          id: document.documentID,
          updatedAt: new Date(document.updatedAt),
        };
      });
      return Object.values(documentMap);
    });
  }, []);

  const sync = React.useCallback(async () => {
    try {
      const { data: documents } = await client.apiV3.fetch.get<BaseModels.Project.KnowledgeBaseDocument[]>(
        `/projects/${projectID}/knowledge-base/documents`
      );
      addDocuments(documents.filter(isDocumentValid));
    } catch (error) {
      logger.error(error);
      toast.error('Unable to fetch knowledge base');
    } finally {
      setUpdatedAt(new Date());
    }
  }, []);

  const resync = React.useCallback(async (documentsToProcess: string[]) => {
    setProcessingDocumentIds(documentsToProcess);
    await Utils.promise.delay(5000);
    setProcessingDocumentIds([]);
    setFinishedDocumentIds(documentsToProcess);
    await Utils.promise.delay(2000);
    setFinishedDocumentIds([]);
  }, []);

  const process = React.useCallback(async (request: () => Promise<BaseModels.Project.KnowledgeBaseDocument[]>) => {
    let documents: BaseModels.Project.KnowledgeBaseDocument[] = [];
    let hasError = false;
    try {
      documents = await request();
      addDocuments(documents);
    } catch (error: any) {
      hasError = true;
    }
    return { documents, hasError };
  }, []);

  const upload = React.useCallback(async (files: FileList | File[]) => {
    const results = await Promise.allSettled(
      [...files].map((file) => {
        const formData = new FormData();
        formData.append('file', file);

        return process(async () => {
          const { data: document } = await client.apiV3.fetch.post<BaseModels.Project.KnowledgeBaseDocument>(
            `/projects/${projectID}/knowledge-base/documents/file`,
            formData
          );
          return [document];
        });
      })
    );

    const successes = results
      .filter(
        (x): x is PromiseFulfilledResult<{ documents: BaseModels.Project.KnowledgeBaseDocument[]; hasError: boolean }> => x.status === 'fulfilled'
      )
      .flatMap((x) => x.value.documents.flatMap((document) => document.documentID));

    const hasFailures =
      results.filter((x): x is PromiseRejectedResult => x.status === 'rejected').map((x) => x.reason).length === 0 ||
      results
        .filter(
          (x): x is PromiseFulfilledResult<{ documents: BaseModels.Project.KnowledgeBaseDocument[]; hasError: boolean }> => x.status === 'fulfilled'
        )
        .flatMap((x) => x.value.hasError).length > 0;

    return { successes, hasFailures };
  }, []);

  const download = React.useCallback(async (documentID: string) => {
    const { data } = await client.apiV3.fetch.get<{ data: Buffer }>(`/projects/${projectID}/knowledge-base/documents/${documentID}/download`);
    const { data: doc } = await client.apiV3.fetch.get<BaseModels.Project.KnowledgeBaseDocument>(
      `/projects/${projectID}/knowledge-base/documents/${documentID}`
    );

    const bytes = new Uint8Array(data.data);
    const blob = new Blob([bytes], { type: MIME_FILE_TYPE[doc.data.type as downloadFileType] });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    window.open(link.href);
    const fileName = doc.data.name;
    link.download = fileName;
    link.click();
  }, []);

  const openPdfFile = React.useCallback(async (documentID: string) => {
    const { data } = await client.apiV3.fetch.get<{ data: Buffer }>(`/projects/${projectID}/knowledge-base/documents/${documentID}/download`);
    const { data: doc } = await client.apiV3.fetch.get<BaseModels.Project.KnowledgeBaseDocument>(
      `/projects/${projectID}/knowledge-base/documents/${documentID}`
    );

    const bytes = new Uint8Array(data.data);
    const blob = new Blob([bytes], { type: MIME_FILE_TYPE[doc.data.type as downloadFileType] });

    const link = window.URL.createObjectURL(blob);
    window.open(link);
  }, []);

  const createDocument = React.useCallback((text: string) => {
    const name = text.slice(0, 50);
    const file = new Blob([text], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file, name);
    formData.append('canEdit', 'true');
    return process(async () => {
      const { data: document } = await client.apiV3.fetch.post<BaseModels.Project.KnowledgeBaseDocument>(
        `/projects/${projectID}/knowledge-base/documents/file`,
        formData
      );
      return [document];
    });
  }, []);

  const create = React.useCallback(
    (datas: BaseModels.Project.KnowledgeBaseDocument['data'][]) =>
      process(async () => {
        return Promise.all(
          datas.map(async (data) => {
            const { data: document } = await client.apiV3.fetch.post<BaseModels.Project.KnowledgeBaseDocument>(
              `/projects/${projectID}/knowledge-base/documents`,
              { data }
            );
            return document;
          })
        );
      }),
    []
  );

  const remove = React.useCallback(async (documentID: string) => {
    let currentDocuments: KnowledgeBaseTableItem[] = [];
    setDocuments((documents) => {
      currentDocuments = documents;
      return documents.filter((document) => document.documentID !== documentID);
    });

    let isSuccess = true;
    await client.apiV3.fetch.delete(`/projects/${projectID}/knowledge-base/documents/${documentID}`).catch(() => {
      setDocuments(currentDocuments);
      isSuccess = false;
    });
    return isSuccess;
  }, []);

  const get = React.useCallback(async (documentID: string) => {
    const { data: document } = await client.apiV3.fetch.get<KnowledgeBaseEditorItem>(`/projects/${projectID}/knowledge-base/documents/${documentID}`);

    return document;
  }, []);

  const state = useContextApi<CMSKnowledgeBaseContextState>({
    updatedAt,
    documents,
    processingDocumentIds,
    finishedProcessingDocumentIds: finsihedDocumentIds,
    activeDocumentID,
    editorOpen,
  });

  const actions = useContextApi<CMSKnowledgeBaseContextActions>({
    sync,
    resync,
    create,
    upload,
    download,
    openPdfFile,
    remove,
    get,
    createDocument,
    setActiveDocumentID,
    setEditorOpen,
  });

  const api = useContextApi({
    state,
    actions,
    table,
    filter,
  });

  return <CMSKnowledgeBaseContext.Provider value={api}>{children}</CMSKnowledgeBaseContext.Provider>;
};

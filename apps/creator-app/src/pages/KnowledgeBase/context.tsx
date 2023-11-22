import { BaseModels } from '@voiceflow/base-types';
import { logger, toast, useContextApi } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import useFilter from '@/pages/NLUManager/hooks/useFilter';
import useTable from '@/pages/NLUManager/hooks/useTable';

import { downloadFileType, MIME_FILE_TYPE } from './constant';

export type KnowledgeBaseTableItem = BaseModels.Project.KnowledgeBaseDocument & { id: string };

export interface KnowledgeBaseContextState {
  updatedAt: Date | null;
  documents: KnowledgeBaseTableItem[];
  activeDocumentID: string | null;
}

export interface KnowledgeBaseContextActions {
  sync: () => Promise<void>;
  create: (datas: BaseModels.Project.KnowledgeBaseDocument['data'][]) => Promise<void>;
  upload: (files: FileList | File[]) => Promise<void>;
  download: (documentID: string) => Promise<any>;
  remove: (documentID: string) => Promise<void>;
  createDocument: (text: string) => Promise<void>;
  setActiveDocumentID: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface KnowledgeBaseContextStructure {
  state: KnowledgeBaseContextState;
  actions: KnowledgeBaseContextActions;
  table: ReturnType<typeof useTable>;
  filter: ReturnType<typeof useFilter>;
}

const defaultKnowledgeBaseContext: KnowledgeBaseContextStructure = {
  state: {
    updatedAt: null,
    documents: [],
    activeDocumentID: null,
  },
  actions: {
    sync: async () => {},
    create: async () => {},
    upload: async () => {},
    download: async () => {},
    remove: async () => {},
    createDocument: async () => {},
    setActiveDocumentID: () => {},
  },
  table: {} as any,
  filter: {} as any,
};

export const KnowledgeBaseContext = React.createContext(defaultKnowledgeBaseContext);
export const { Consumer: KnowledgeBaseConsumer } = KnowledgeBaseContext;

const isDocumentValid = (document: Partial<BaseModels.Project.KnowledgeBaseDocument>): document is BaseModels.Project.KnowledgeBaseDocument => {
  return !!document.data;
};

export const KnowledgeBaseProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const projectID = useSelector(Session.activeProjectIDSelector);

  const [documents, setDocuments] = React.useState<KnowledgeBaseTableItem[]>([]);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);
  const [activeDocumentID, setActiveDocumentID] = React.useState<string | null>(null);
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

  const process = React.useCallback(async (name: string, request: () => Promise<BaseModels.Project.KnowledgeBaseDocument[]>, info = true) => {
    try {
      const documents = await request();
      addDocuments(documents);
      if (info) {
        toast.info(
          <>
            Processing <b>{name}</b>
          </>
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error;
      toast.error(
        <>
          <b>{name}</b> failed to process
          {errorMessage && <>: {errorMessage}</>}
        </>,
        { autoClose: false }
      );
    }
  }, []);

  const upload = React.useCallback(async (files: FileList | File[]) => {
    await Promise.allSettled(
      [...files].map((file) => {
        const formData = new FormData();
        formData.append('file', file);

        return process(file.name, async () => {
          const { data: document } = await client.apiV3.fetch.post<BaseModels.Project.KnowledgeBaseDocument>(
            `/projects/${projectID}/knowledge-base/documents/file`,
            formData
          );
          return [document];
        });
      })
    );
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
    const fileName = doc.data.name;
    link.download = fileName;
    link.click();
  }, []);

  const createDocument = React.useCallback((text: string) => {
    const name = text.slice(0, 50);
    const file = new Blob([text], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file, name);
    formData.append('canEdit', 'true');
    return process(name, async () => {
      const { data: document } = await client.apiV3.fetch.post<BaseModels.Project.KnowledgeBaseDocument>(
        `/projects/${projectID}/knowledge-base/documents/file`,
        formData
      );
      return [document];
    });
  }, []);

  const create = React.useCallback(
    (datas: BaseModels.Project.KnowledgeBaseDocument['data'][]) =>
      process(
        datas
          .slice(0, 5)
          .map((data) => data.name)
          .join(', ')
          .concat(datas.length > 5 ? '...' : ''),
        async () => {
          return Promise.all(
            datas.map(async (data) => {
              const { data: document } = await client.apiV3.fetch.post<BaseModels.Project.KnowledgeBaseDocument>(
                `/projects/${projectID}/knowledge-base/documents`,
                { data }
              );
              return document;
            })
          );
        },
        false
      ),
    []
  );

  const remove = React.useCallback(async (documentID: string) => {
    let currentDocuments: KnowledgeBaseTableItem[] = [];
    setDocuments((documents) => {
      currentDocuments = documents;
      return documents.filter((document) => document.documentID !== documentID);
    });

    await client.apiV3.fetch.delete(`/projects/${projectID}/knowledge-base/documents/${documentID}`).catch(() => {
      setDocuments(currentDocuments);
      toast.error('Unable to remove document');
    });
  }, []);

  const state = useContextApi<KnowledgeBaseContextState>({
    updatedAt,
    documents,
    activeDocumentID,
  });

  const actions = useContextApi<KnowledgeBaseContextActions>({
    sync,
    create,
    upload,
    download,
    remove,
    createDocument,
    setActiveDocumentID,
  });

  const api = useContextApi({
    state,
    actions,
    table,
    filter,
  });

  return <KnowledgeBaseContext.Provider value={api}>{children}</KnowledgeBaseContext.Provider>;
};

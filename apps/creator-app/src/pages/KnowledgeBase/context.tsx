import { BaseModels } from '@voiceflow/base-types';
import { logger, toast, useContextApi } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import useTable from '@/pages/NLUManager/hooks/useTable';

export type KnowledgeBaseTableItem = BaseModels.Project.KnowledgeBaseDocument & { id: string };

export interface KnowledgeBaseContextState {
  updatedAt: Date | null;
  documents: KnowledgeBaseTableItem[];
}

export interface KnowledgeBaseContextActions {
  sync: () => Promise<void>;
  create: (datas: BaseModels.Project.KnowledgeBaseDocument['data'][]) => Promise<void>;
  upload: (files: FileList) => Promise<void>;
  remove: (documentID: string) => Promise<void>;
}

export interface KnowledgeBaseContextStructure {
  state: KnowledgeBaseContextState;
  actions: KnowledgeBaseContextActions;
  table: ReturnType<typeof useTable>;
}

const defaultKnowledgeBaseContext: KnowledgeBaseContextStructure = {
  state: {
    updatedAt: null,
    documents: [],
  },
  actions: {
    sync: async () => {},
    create: async () => {},
    upload: async () => {},
    remove: async () => {},
  },
  table: {} as any,
};

export const KnowledgeBaseContext = React.createContext(defaultKnowledgeBaseContext);
export const { Consumer: KnowledgeBaseConsumer } = KnowledgeBaseContext;

export const KnowledgeBaseProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const projectID = useSelector(Session.activeProjectIDSelector);

  const [documents, setDocuments] = React.useState<KnowledgeBaseTableItem[]>([]);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);
  const table = useTable(null);

  const addDocuments = React.useCallback((documents: BaseModels.Project.KnowledgeBaseDocument[]) => {
    setDocuments((prevDocuments) => {
      const documentMap = Object.fromEntries(prevDocuments.map((document) => [document.documentID, document]));
      documents.forEach((document) => {
        documentMap[document.documentID] = { ...document, id: document.documentID, updatedAt: new Date(document.updatedAt) };
      });
      return Object.values(documentMap);
    });
  }, []);

  const sync = React.useCallback(async () => {
    try {
      const { data: documents } = await client.apiV3.fetch.get<BaseModels.Project.KnowledgeBaseDocument[]>(
        `/projects/${projectID}/knowledge-base/documents`
      );
      addDocuments(documents);
    } catch (error) {
      logger.error(error);
      toast.error('Unable to fetch knowledge base');
    } finally {
      setUpdatedAt(new Date());
    }
  }, []);

  const process = React.useCallback(async (name: string, request: () => Promise<BaseModels.Project.KnowledgeBaseDocument[]>) => {
    try {
      const documents = await request();
      addDocuments(documents);
      toast.info(
        <>
          Processing <b>{name}</b>
        </>
      );
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

  const upload = React.useCallback((files: FileList) => {
    const formData = new FormData();
    formData.append('file', files[0]);
    const fileName = files[0].name;

    return process(fileName, async () => {
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
        }
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
  });

  const actions = useContextApi<KnowledgeBaseContextActions>({
    sync,
    create,
    upload,
    remove,
  });

  const api = useContextApi({
    state,
    actions,
    table,
  });

  return <KnowledgeBaseContext.Provider value={api}>{children}</KnowledgeBaseContext.Provider>;
};

import { BaseModels } from '@voiceflow/base-types';
import { notify, useCreateConst } from '@voiceflow/ui-next';
import { useEffect, useMemo, useRef } from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

import { useCMSManager } from '../../contexts/CMSManager';
import { CMSKnowledgeBase } from '../../contexts/CMSManager/CMSManager.interface';

export const useKnowledgeBaseCMSManager = useCMSManager<CMSKnowledgeBase>;

export const useKBDocumentSync = () => {
  const showSyncedToast = useRef(false);
  const syncingToastID = useRef<any | null>(null);

  const documents = useSelector(Designer.KnowledgeBase.Document.selectors.all);
  const processingDocumentIDs = useSelector(Designer.KnowledgeBase.Document.selectors.processingDocumentIDs);

  const getAll = useDispatch(Designer.KnowledgeBase.Document.effect.getAll);
  const getAllPendingDocuments = useDispatch(Designer.KnowledgeBase.Document.effect.getAllPendingDocuments);

  const processingDocumentIDsMap = useMemo<Record<string, KnowledgeBaseDocument>>(
    () => processingDocumentIDs.reduce((acc, documentID) => ({ ...acc, [documentID]: documents.find((d) => d.id === documentID) }), {}),
    [processingDocumentIDs, documents]
  );

  const finishedStatusSet = useCreateConst(
    () => new Set([BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR])
  );

  const getAllProcessingDocumentsSucceed = () =>
    processingDocumentIDs.every(
      (documentID) => processingDocumentIDsMap[documentID].status === BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS
    );

  const processing = useMemo(() => documents.some((document) => !finishedStatusSet.has(document.status)), [documents]);

  useEffect(() => {
    getAll().catch(() => {});
  }, []);

  useEffect(() => {
    if (processing) {
      const toastID = notify.short.info('Syncing', { isLoading: true, autoClose: false, toastId: 'KB_SYNCING_ID' });
      syncingToastID.current = toastID;
    }

    if (!processing) {
      if (syncingToastID.current) {
        notify.short.dismiss(syncingToastID.current);
        syncingToastID.current = null;
        showSyncedToast.current = false;

        const allDocumentsSucceed = getAllProcessingDocumentsSucceed();

        if (allDocumentsSucceed) {
          notify.short.success('Synced');
        } else {
          notify.short.info('All data sources processed', { showIcon: false });
        }
      }

      return undefined;
    }

    let timeout: number;
    let cancelled = false;

    const sync = async () => {
      if (cancelled) return;

      await getAllPendingDocuments().catch(() => {});

      if (cancelled) return;

      timeout = window.setTimeout(sync, 5000);
    };

    sync();

    showSyncedToast.current = true;

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [processing]);
};

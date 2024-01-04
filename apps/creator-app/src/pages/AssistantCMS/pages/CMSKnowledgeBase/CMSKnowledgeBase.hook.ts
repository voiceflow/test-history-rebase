import { BaseModels } from '@voiceflow/base-types';
import { toast, useCreateConst } from '@voiceflow/ui-next';
import { useEffect, useMemo, useRef } from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import { CMSKnowledgeBase } from '../../contexts/CMSManager/CMSManager.interface';

export const useKnowledgeBaseCMSManager = useCMSManager<CMSKnowledgeBase>;

export const useKBDocumentSync = () => {
  const showSyncedToast = useRef(false);

  const documents = useSelector(Designer.KnowledgeBase.Document.selectors.all);

  const getAll = useDispatch(Designer.KnowledgeBase.Document.effect.getAll);
  const getAllPendingDocuments = useDispatch(Designer.KnowledgeBase.Document.effect.getAllPendingDocuments);

  const finishedStatusSet = useCreateConst(
    () => new Set([BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR])
  );

  const processing = useMemo(() => documents.some((document) => !finishedStatusSet.has(document.status)), [documents]);

  useEffect(() => {
    getAll().catch(() => {});
  }, []);

  useEffect(() => {
    if (!processing) {
      if (showSyncedToast.current) {
        showSyncedToast.current = false;
        toast.success('Synced');
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

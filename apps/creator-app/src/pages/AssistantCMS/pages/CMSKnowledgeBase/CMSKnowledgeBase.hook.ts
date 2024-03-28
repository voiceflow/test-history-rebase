import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { notify, useCreateConst } from '@voiceflow/ui-next';
import { useEffect, useMemo, useRef } from 'react';

import { Designer } from '@/ducks';
import { useNotificationDismiss } from '@/hooks/notify.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import { CMSKnowledgeBase } from '../../contexts/CMSManager/CMSManager.interface';

export const useKnowledgeBaseCMSManager = useCMSManager<CMSKnowledgeBase>;

export const useKBDocumentSync = () => {
  const showSyncedToast = useRef(false);
  const syncNotification = useNotificationDismiss();

  const documents = useSelector(Designer.KnowledgeBase.Document.selectors.all);
  const getOneByID = useSelector(Designer.KnowledgeBase.Document.selectors.getOneByID);
  const processingIDs = useSelector(Designer.KnowledgeBase.Document.selectors.processingIDs);

  const getAll = useDispatch(Designer.KnowledgeBase.Document.effect.getAll);
  const getAllPending = useDispatch(Designer.KnowledgeBase.Document.effect.getAllPending);

  const processingMap = useMemo(() => Object.fromEntries(processingIDs.map((id) => [id, getOneByID({ id })])), [processingIDs, getOneByID]);

  const finishedStatusSet = useCreateConst(
    () => new Set([BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR])
  );

  const getAllProcessingDocumentsSucceed = () =>
    processingIDs.every((documentID) => processingMap[documentID]?.status === BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS);

  const processing = useMemo(() => documents.some((document) => !finishedStatusSet.has(document.status)), [documents]);

  useEffect(() => {
    getAll().catch(() => {});
  }, []);

  useEffect(() => {
    if (processing) {
      const toastID = Utils.id.cuid.slug();

      notify.short.info('Syncing', { isLoading: true, autoClose: false, toastId: toastID });
      syncNotification.set(toastID);
    } else {
      if (syncNotification.dismiss()) {
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

      await getAllPending().catch(() => {});

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

export const useKBIntegrationSync = () => {
  const integrations = useSelector(Designer.KnowledgeBase.Integration.selectors.all);

  const getAll = useDispatch(Designer.KnowledgeBase.Integration.effect.getAll);

  const hasIntegrations = useMemo(() => integrations.length > 0, [integrations]);

  useEffect(() => {
    getAll().catch(() => {});
  }, []);

  return hasIntegrations;
};

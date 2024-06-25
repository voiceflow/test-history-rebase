/* eslint-disable no-await-in-loop */
/* eslint-disable sonarjs/no-duplicate-string */
import { BaseModels } from '@voiceflow/base-types';
import { notify } from '@voiceflow/ui-next';
import pluralize from 'pluralize';

import { designerClient } from '@/client/designer';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import type { KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';
import { pendingStatusSet } from '@/pages/AssistantCMS/pages/CMSKnowledgeBase/CMSKnowledgeBase.constants';
import type { Thunk } from '@/store/types';
import { downloadBlob } from '@/utils/download.util';

import * as Actions from './document.action';
import { documentAdapterRealtime } from './document.adapter';
import { DOCUMENT_TYPE_MIME_FILE_TYPE_MAP } from './document.constant';
import * as Selectors from './document.select';

export const patchOne =
  (_documentID: string, _data: Partial<KnowledgeBaseDocument>): Thunk =>
  async () => {
    throw new Error('unsupported');
  };

export const patchMany =
  (_documentIDs: string[], _data: Partial<KnowledgeBaseDocument>): Thunk =>
  async () => {
    throw new Error('unsupported');
  };

export const replaceTextDocument =
  (documentID: string, fileContent: string): Thunk<void> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    const file = new Blob([fileContent], { type: 'text/plain' });

    const formData = new FormData();

    formData.append('file', file, fileContent.slice(0, 200));
    formData.append('canEdit', 'true');

    Errors.assertProjectID(projectID);

    const formFile = formData.get('file');
    if (!(formFile instanceof Blob)) {
      throw new Error('unsupported');
    }
    const dbDocument = await designerClient.knowledgeBase.document.replaceOneFile(projectID, documentID, {
      file: formFile,
      canEdit: true,
    });
    const document = documentAdapterRealtime.fromDB(dbDocument);

    dispatch.local(Actions.SetProcessingIDs({ processingIDs: [documentID] }));

    Tracking.trackAiKnowledgeBaseSourceUpdated({ documentIDs: [documentID], Update_Type: 'Text' });

    dispatch.local(
      Actions.UpdateMany({
        update: [{ ...document, updatedAt: new Date().toJSON() }],
      })
    );
  };

export const patchManyRefreshRate =
  (documentIDs: string[], refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const documents = Selectors.allByIDs(state, { ids: documentIDs }).map((document) => ({
      id: document.id,
      data: { ...document.data, refreshRate } as BaseModels.Project.KnowledgeBaseURL,
    }));

    await designerClient.knowledgeBase.document.patchMany(projectID, {
      documentIDs,
      patch: { data: { refreshRate } },
    });

    Tracking.trackAiKnowledgeBaseSourceUpdated({ documentIDs, Update_Type: 'Refresh rate' });

    dispatch.local(
      Actions.UpdateMany({
        update: documents.map((document) => ({ ...document, updatedAt: new Date().toJSON() })),
      })
    );
  };

export const getAll = (): Thunk<KnowledgeBaseDocument[]> => async (dispatch, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  const response = await designerClient.knowledgeBase.document.getMany(projectID, {});
  const documents = documentAdapterRealtime.mapFromDB(response.documents);

  dispatch.local(Actions.AddMany({ data: documents }));

  return documents;
};

export const getAllPending = (): Thunk<KnowledgeBaseDocument[]> => async (dispatch, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  const documentIDs = Selectors.all(state)
    .filter((document) => pendingStatusSet.has(document.status))
    .map((doc) => doc.id);

  if (documentIDs.length === 0) return [];

  const response = await designerClient.knowledgeBase.document.retrieveMany(projectID, { documentIDs });

  const documents = documentAdapterRealtime.mapFromDB(response.documents);

  dispatch.local(Actions.AddMany({ data: documents }));

  return documents;
};

export const loadAll = (): Thunk => async (dispatch) => {
  try {
    dispatch.local(Actions.SetFetchStatus({ status: 'loading' }));

    await dispatch(getAll());

    dispatch.local(Actions.SetFetchStatus({ status: 'success' }));
  } catch (error) {
    dispatch.local(Actions.SetFetchStatus({ status: 'error' }));
    Tracking.trackAiKnowledgeBaseError({ ErrorType: 'Load' });
    const systemMessageID = notify.long.warning('An error was encountered when fetching knowledge base data.', {
      pauseOnHover: true,
      autoClose: false,
      actionButtonProps: { label: 'Reload', onClick: () => window.location.reload() },
      secondaryButtonProps: { label: 'Dismiss', onClick: () => notify.long.dismiss(systemMessageID) },
    });
  }
};

export const resyncMany =
  (documentIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const documents = Selectors.allByIDs(getState(), { ids: documentIDs }).filter(
      (doc) => !pendingStatusSet.has(doc.status) && doc.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL
    );

    if (!documents.length) return;

    dispatch.local(Actions.SetProcessingIDs({ processingIDs: documentIDs }));

    try {
      const projectID = Session.activeProjectIDSelector(getState());

      Errors.assertProjectID(projectID);

      await designerClient.knowledgeBase.document.refreshManyURLs(projectID, { documentIDs });

      Tracking.trackAiKnowledgeBaseSourceResync({ documentIDs });

      dispatch.local(
        Actions.PatchMany({
          ids: documents.map((doc) => doc.id),
          patch: { status: BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING, updatedAt: new Date().toJSON() },
        })
      );
    } catch {
      notify.short.error('Failed to sync data source');
    }
  };

export const retryOne =
  (documentID: string): Thunk =>
  async (dispatch, getState) => {
    dispatch.local(Actions.SetProcessingIDs({ processingIDs: [documentID] }));

    dispatch.local(
      Actions.PatchOne({
        id: documentID,
        patch: { status: BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING, updatedAt: new Date().toJSON() },
      })
    );

    Tracking.trackAiKnowledgeBaseSourceStatusUpdated({ documentID });

    try {
      const projectID = Session.activeProjectIDSelector(getState());

      Errors.assertProjectID(projectID);

      await designerClient.knowledgeBase.document.retryOne(projectID, documentID);
    } catch {
      notify.short.error('Failed to retry data source');
    }
  };

const createManyFromFormData =
  (manyFormData: FormData[]): Thunk<KnowledgeBaseDocument[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const result = await Promise.allSettled(
      manyFormData.map((data) => {
        const file = data.get('file');
        const canEdit = data.get('canEdit') === 'true';

        if (file instanceof Blob) {
          return designerClient.knowledgeBase.document.createOneFile(projectID, { file, canEdit });
        }

        throw new Error('Invalid file data');
      })
    );

    const documents = documentAdapterRealtime.mapFromDB(
      result.filter((res): res is PromiseFulfilledResult<any> => res.status === 'fulfilled').map((res) => res.value)
    );

    dispatch.local(Actions.SetProcessingIDs({ processingIDs: documents.map((d) => d.id) }));

    dispatch.local(Actions.AddMany({ data: documents }));

    if (manyFormData.length !== documents.length) {
      const error = result
        .filter((res): res is PromiseRejectedResult => res.status === 'rejected')
        .filter((res) => res.reason.response?.status === 406)
        .map((res) => {
          return res.reason;
        })[0];
      if (error) throw error;

      const erroredCount = manyFormData.length - documents.length;

      Tracking.trackAiKnowledgeBaseError({ ErrorType: 'Import' });

      notify.short.warning(`Couldn't import ${pluralize('data source', erroredCount, true)}`);
    }

    if (documents.length) {
      Tracking.trackAiKnowledgeBaseSourceAdded({
        Type: documents[0].data?.type ?? BaseModels.Project.KnowledgeBaseDocumentType.TEXT,
        numberOfDocuments: documents.length,
      });
    }

    return documents;
  };

export const createManyFromFile =
  (files: FileList | File[]): Thunk<KnowledgeBaseDocument[]> =>
  async (dispatch) => {
    const manyFormData = Array.from(files).map((file) => {
      const formData = new FormData();

      formData.append('file', file);

      return formData;
    });

    return dispatch(createManyFromFormData(manyFormData));
  };

export const createManyFromText =
  (texts: string[]): Thunk<KnowledgeBaseDocument[]> =>
  async (dispatch) => {
    const manyFormData = texts.map((text) => {
      const file = new Blob([text], { type: 'text/plain' });

      const formData = new FormData();

      formData.append('file', file, text.slice(0, 200));
      formData.append('canEdit', 'true');

      return formData;
    });

    return dispatch(createManyFromFormData(manyFormData));
  };

export const createManyFromData =
  (data: BaseModels.Project.KnowledgeBaseDocument['data'][]): Thunk<KnowledgeBaseDocument[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const dataUrls = data as BaseModels.Project.KnowledgeBaseURL[];
    const response = await Promise.resolve(
      designerClient.knowledgeBase.document.createManyURLs(projectID, { data: dataUrls })
    ).catch((error) => {
      const err = error.response?.status === 406 ? error : null;
      if (err) throw err;
    });

    const documents = documentAdapterRealtime.mapFromDB(response?.map((res: any) => res) || []);

    if (!documents || data.length !== documents.length) {
      const erroredCount = data.length - documents.length;

      Tracking.trackAiKnowledgeBaseError({ ErrorType: 'Import' });

      notify.short.warning(`Couldn't import ${pluralize('data source', erroredCount, true)}`);
    } else {
      dispatch.local(Actions.SetProcessingIDs({ processingIDs: documents.map((d) => d.id) }));

      dispatch.local(Actions.AddMany({ data: documents }));

      if (documents.length) {
        Tracking.trackAiKnowledgeBaseSourceAdded({
          Type: documents[0].data?.type ?? BaseModels.Project.KnowledgeBaseDocumentType.URL,
          refreshRate: (data[0] as BaseModels.Project.KnowledgeBaseURL)?.refreshRate,
          numberOfDocuments: documents.length,
        });
      }
    }

    return documents;
  };

export const getOne =
  (documentID: string): Thunk<KnowledgeBaseDocument> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const dbDocument = await designerClient.knowledgeBase.document.getOne(projectID, documentID);
    const document = documentAdapterRealtime.fromDB(dbDocument);

    dispatch.local(Actions.AddOne({ data: document }));

    return document;
  };

export const getOneBlobData =
  (documentID: string): Thunk<{ blob: Blob; document: KnowledgeBaseDocument }> =>
  async (_dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const document = Selectors.oneByID(state, { id: documentID });

    if (!document?.data) {
      throw new Error('unknown data source type');
    }

    const data = await designerClient.knowledgeBase.document.download(projectID, documentID);
    const mappedData = Object.values(data ?? {}) as number[];
    const blob = new Blob([new Uint8Array(mappedData)], { type: DOCUMENT_TYPE_MIME_FILE_TYPE_MAP[document.data.type] });

    return {
      blob,
      document,
    };
  };

export const downloadOne =
  (documentID: string): Thunk =>
  async (dispatch) => {
    const { blob, document } = await dispatch(getOneBlobData(documentID));

    downloadBlob(document.data?.name ?? 'kb-document', blob);
  };

export const previewOne =
  (documentID: string): Thunk =>
  async (dispatch) => {
    const { blob } = await dispatch(getOneBlobData(documentID));

    const link = window.URL.createObjectURL(blob);

    const instance = window.open(link, '_blank');

    if (instance) {
      instance.onbeforeunload = () => {
        window.URL.revokeObjectURL(link);
      };
    } else {
      window.URL.revokeObjectURL(link);
    }
  };

export const deleteOne =
  (documentID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    await designerClient.knowledgeBase.document.deleteOne(projectID, documentID);

    Tracking.trackAiKnowledgeBaseSourceDeleted({ documentIDs: [documentID] });

    dispatch.local(Actions.DeleteOne({ id: documentID }));
  };

export const deleteMany =
  (documentIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const data = await designerClient.knowledgeBase.document.deleteMany(projectID, { documentIDs });

    Tracking.trackAiKnowledgeBaseSourceDeleted({ documentIDs: data.deletedDocumentIDs });

    dispatch.local(Actions.DeleteMany({ ids: data.deletedDocumentIDs }));

    if (data.deletedDocumentIDs.length !== documentIDs.length) {
      const erroredCount = documentIDs.length - data.deletedDocumentIDs.length;

      notify.short.warning(`${pluralize('data source', erroredCount, true)} could not be deleted`);
    }
  };

export const getURLsFromSitemap =
  (sitemapURL: string): Thunk<string[]> =>
  async (_dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    // always try the original url
    const urlsToTry: string[] = [sitemapURL];

    if (!sitemapURL.endsWith('.xml')) {
      const url = sitemapURL.endsWith('/') ? '' : '/';

      urlsToTry.push(`${url}sitemap.xml`);
      urlsToTry.push(`${url}sitemap_index.xml`);
      urlsToTry.push(`${url}sitemap/sitemap.xml`);
    }

    for (const url of urlsToTry) {
      const sites = await designerClient.knowledgeBase.document.sitemap(projectID, { sitemapURL: url });
      if (sites?.length) return sites;
    }

    return [];
  };

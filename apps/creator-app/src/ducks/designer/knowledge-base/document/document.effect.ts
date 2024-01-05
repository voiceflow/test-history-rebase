/* eslint-disable sonarjs/no-duplicate-string */
import { BaseModels } from '@voiceflow/base-types';
import { toast } from '@voiceflow/ui-next';
import pluralize from 'pluralize';

import { knowledgeBaseClient } from '@/client/knowledge-base';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import type { DBKnowledgeBaseDocument, KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';
import { pendingStatusSet } from '@/pages/AssistantCMS/pages/CMSKnowledgeBase/CMSKnowledgeBase.constants';
import type { Thunk } from '@/store/types';
import { downloadBlob } from '@/utils/download.util';

import * as Actions from './document.action';
import { documentAdapter } from './document.adapter';
import { DOCUMENT_TYPE_MIME_FILE_TYPE_MAP } from './document.constant';
import * as Selectors from './document.select';

export const patchOne =
  (_documentID: string, _data: Partial<KnowledgeBaseDocument>): Thunk =>
  async () => {
    throw new Error('unsupported');
  };

export const replaceTextDocument =
  (documentID: string, fileContent: string): Thunk<void> =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());
    const file = new Blob([fileContent], { type: 'text/plain' });

    const formData = new FormData();

    formData.append('file', file, fileContent.slice(0, 200));
    formData.append('canEdit', 'true');

    Errors.assertProjectID(projectID);

    const dbDocument = await knowledgeBaseClient.replaceDocument(projectID, documentID, formData);

    dispatch(
      Actions.UpdateMany({
        update: [{ ...documentAdapter.fromDB(dbDocument), updatedAt: new Date().toJSON() }],
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

    await knowledgeBaseClient.updateManyDocuments(
      projectID,
      documents.map((doc) => ({ data: doc.data, documentID: doc.id }))
    );

    dispatch(
      Actions.UpdateMany({
        update: documents.map((document) => ({ ...document, updatedAt: new Date().toJSON() })),
      })
    );
  };

export const getAll = (): Thunk<KnowledgeBaseDocument[]> => async (dispatch, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  const dbDocuments = await knowledgeBaseClient.getAllDocuments(projectID);
  const documents = documentAdapter.mapFromDB(dbDocuments);

  dispatch(Actions.AddMany({ data: documents }));

  return documents;
};

export const getAllPendingDocuments = (): Thunk<KnowledgeBaseDocument[]> => async (dispatch, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  const documentIDs = Selectors.all(state)
    .filter((document) => pendingStatusSet.has(document.status))
    .map((doc) => doc.id);

  if (documentIDs.length === 0) return [];

  const dbDocuments = await knowledgeBaseClient.getAllDocuments(projectID, documentIDs);
  const documents = documentAdapter.mapFromDB(dbDocuments);

  dispatch(Actions.AddMany({ data: documents }));

  return documents;
};

export const loadAll = (): Thunk => async (dispatch) => {
  try {
    dispatch(Actions.SetFetchStatus({ status: 'loading' }));

    await dispatch(getAll());

    dispatch(Actions.SetFetchStatus({ status: 'success' }));
  } catch (error) {
    dispatch(Actions.SetFetchStatus({ status: 'error' }));

    toast.error('Unable to fetch knowledge base');
  }
};

export const resyncMany =
  (documentIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const documents = Selectors.allByIDs(getState(), { ids: documentIDs }).filter(
      (doc) => !pendingStatusSet.has(doc.status) && doc.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL
    );

    if (!documents.length) return;

    toast.info('Syncing');

    try {
      const projectID = Session.activeProjectIDSelector(getState());

      Errors.assertProjectID(projectID);

      await knowledgeBaseClient.refreshDocuments(projectID, documentIDs);

      dispatch(
        Actions.PatchMany({
          ids: documents.map((doc) => doc.id),
          patch: { status: BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING, updatedAt: new Date().toJSON() },
        })
      );
    } catch {
      toast.error('Failed to sync data source');
    }
  };

export const retryOne =
  (documentID: string): Thunk =>
  async (dispatch, getState) => {
    toast.info('Retrying');

    dispatch(
      Actions.PatchOne({
        id: documentID,
        patch: { status: BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING, updatedAt: new Date().toJSON() },
      })
    );

    try {
      const projectID = Session.activeProjectIDSelector(getState());

      Errors.assertProjectID(projectID);

      await knowledgeBaseClient.retryDocument(projectID, documentID);
    } catch {
      toast.error('Failed to retry data source');
    }
  };

const createManyFromFormData =
  (manyFormData: FormData[]): Thunk<KnowledgeBaseDocument[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const result = await Promise.allSettled(manyFormData.map((data) => knowledgeBaseClient.createOneDocumentFromFormFile(projectID, data)));

    const documents = result
      .filter((res): res is PromiseFulfilledResult<DBKnowledgeBaseDocument> => res.status === 'fulfilled')
      .map((res) => documentAdapter.fromDB(res.value));

    dispatch(Actions.AddMany({ data: documents }));

    if (manyFormData.length !== documents.length) {
      const erroredCount = manyFormData.length - documents.length;

      toast.warning(`Couldn't import ${pluralize('data source', erroredCount, true)}`);
    }

    if (documents.length) {
      toast.success(`${pluralize('data source', result.length, true)} imported`);

      Tracking.trackAiKnowledgeBaseSourceAdded({ Type: documents[0].data?.type ?? BaseModels.Project.KnowledgeBaseDocumentType.TEXT });
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

    const result = await Promise.allSettled(data.map((data) => knowledgeBaseClient.createOneDocument(projectID, data)));

    const documents = result
      .filter((res): res is PromiseFulfilledResult<DBKnowledgeBaseDocument> => res.status === 'fulfilled')
      .map((res) => documentAdapter.fromDB(res.value));

    dispatch(Actions.AddMany({ data: documents }));

    if (data.length !== documents.length) {
      const erroredCount = data.length - documents.length;

      toast.warning(`Couldn't import ${pluralize('data source', erroredCount, true)}`);
    }

    if (documents.length) {
      toast.success(`${pluralize('data source', result.length, true)} imported`);

      Tracking.trackAiKnowledgeBaseSourceAdded({ Type: documents[0].data?.type ?? BaseModels.Project.KnowledgeBaseDocumentType.URL });
    }

    return documents;
  };

export const getOne =
  (documentID: string): Thunk<KnowledgeBaseDocument> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const dbDocument = await knowledgeBaseClient.getOneDocument(projectID, documentID);
    const document = documentAdapter.fromDB(dbDocument);

    dispatch(Actions.AddOne({ data: document }));

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

    const data = await knowledgeBaseClient.getOneDocumentData(projectID, documentID);

    const blob = new Blob([new Uint8Array(data)], { type: DOCUMENT_TYPE_MIME_FILE_TYPE_MAP[document.data.type] });

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

    await knowledgeBaseClient.deleteOneDocument(projectID, documentID);

    dispatch(Actions.DeleteOne({ id: documentID }));
  };

export const deleteMany =
  (documentIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const result = await Promise.allSettled(documentIDs.map((id) => knowledgeBaseClient.deleteOneDocument(projectID, id)));

    const removed = documentIDs.filter((_, index) => result[index].status === 'fulfilled');

    dispatch(Actions.DeleteMany({ ids: removed }));

    if (removed.length !== documentIDs.length) {
      const erroredCount = documentIDs.length - removed.length;

      toast.warning(`${pluralize('data source', erroredCount, true)} could not be deleted`);
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
      // eslint-disable-next-line no-await-in-loop
      const sites = await knowledgeBaseClient.getURLsFromSitemap(projectID, url).catch<string[]>(() => []);

      if (sites?.length) return sites;
    }

    return [];
  };

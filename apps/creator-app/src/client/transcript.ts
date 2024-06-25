import { BaseNode } from '@voiceflow/base-types';
import { isIntentRequest } from '@voiceflow/utils-designer';

import type { AnyTranscriptMessage, TagType, Transcript } from '@/models';
import { FormatType } from '@/models';
import type { Message } from '@/pages/Prototype/types';

import dialogAdapter from './adapters/transcripts/dialogs';
import transcriptAdapter from './adapters/transcripts/transcripts';
import { apiV2 } from './fetch';

export const TRANSCRIPT_PATH = 'transcripts';

export enum TranscriptExportFormat {
  CSV = 'csv',
}

const ADDED_UTTERANCES_PATH = 'addedUtterances';

const UTTERANCE_ANNOTATION = 'annotation/utteranceAddedTo';

const TRANSCRIPT_REPORT_TAG_PATH = 'report_tag';

const transcriptClient = {
  find: (projectID: string, queryParams?: string) =>
    apiV2.get<Transcript[]>(`${TRANSCRIPT_PATH}/${projectID}?${queryParams ?? ''}`).then(transcriptAdapter.mapFromDB),

  patchTranscript: (
    projectID: string,
    transcriptID: string,
    data: { notes?: string; tags?: TagType; unread?: boolean }
  ) => apiV2.patch<Transcript>(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`, { data }),

  deleteTranscript: (projectID: string, transcriptID: string) =>
    apiV2.delete(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`),

  createTranscript: (data: Partial<Transcript> & { versionID: string | null }) =>
    apiV2.put<{ _id: string }>(TRANSCRIPT_PATH, { ...data }),

  getTranscriptDialog: (projectID: string, transcriptID: string) =>
    apiV2.get<AnyTranscriptMessage[]>(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}`).then((dialogs) =>
      dialogs
        .filter(
          (message, i) =>
            !i ||
            !(
              dialogs[i - 1].type === BaseNode.Utils.TraceType.GOTO &&
              message.format === FormatType.Request &&
              isIntentRequest(message.payload)
            )
        )
        .map(dialogAdapter.fromDB)
        .filter((message): message is Message => Boolean(message))
    ),

  getHasUnreadTranscripts: (projectID: string) =>
    apiV2.get<boolean>(`${TRANSCRIPT_PATH}/${projectID}/hasUnreadTranscripts`).then((response) => response),

  exportTranscript: (projectID: string, transcriptID: string, params: { format: TranscriptExportFormat }) =>
    apiV2
      .get<Blob>(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}/export?${new URLSearchParams(params).toString()}`)
      .then((response) => response),

  setInteractUtteranceAddedTo: (transcriptID: string, projectID: string, intentID: string, turnID: string) =>
    apiV2.put(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}/${ADDED_UTTERANCES_PATH}`, {
      intentID,
      turnID,
    }),

  setTurnUtteranceAddedTo: (
    transcriptID: string,
    projectID: string,
    turnID: string,
    intentID: string,
    utterancesCount: number
  ) =>
    apiV2.put(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}/${UTTERANCE_ANNOTATION}`, {
      turnID,
      intentID,
      utterancesCount,
    }),

  addTag: (projectID: string, transcriptID: string, tagID: string) =>
    apiV2.put(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}/${TRANSCRIPT_REPORT_TAG_PATH}/${tagID}`),

  removeTag: (projectID: string, transcriptID: string, tagID: string) =>
    apiV2.delete(`${TRANSCRIPT_PATH}/${projectID}/${transcriptID}/${TRANSCRIPT_REPORT_TAG_PATH}/${tagID}`),
};

export default transcriptClient;

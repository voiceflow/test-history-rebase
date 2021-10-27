import { toast } from '@voiceflow/ui';
import fileSaver from 'file-saver';
import { Parser } from 'json2csv';

import client from '@/client';
import * as Errors from '@/config/errors';
import { ExportFormat, NLPProvider } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';
import { DataTypes, download, downloadFromURL } from '@/utils/dom';
import * as Sentry from '@/vendors/sentry';

export const exportCanvas =
  (type: ExportFormat): Thunk =>
  async (_, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);

    if (type === ExportFormat.DIALOGS) {
      const projectName = ProjectV2.active.nameSelector(state);
      const json2csvParser = new Parser();

      try {
        const data = await client.api.version.exportResponses(versionID);
        const csvData = json2csvParser.parse(data);
        download(`${projectName?.replace(/ /g, '_')}.csv`, csvData, DataTypes.CSV);
      } catch (error) {
        Sentry.error(error);
        toast.error('.csv export failed');
      }
      return;
    }

    if (type === ExportFormat.VF) {
      const projectName = ProjectV2.active.nameSelector(state);

      try {
        const data = await client.api.version.export(versionID);
        download(`${projectName?.replace(/ /g, '_')}.vf`, JSON.stringify(data, null, 2), DataTypes.JSON);
      } catch (error) {
        Sentry.error(error);
        toast.error('.VF export failed');
      }
      return;
    }

    const options = {
      token: Cookies.getAuthCookie(),
      canvasURL: `https://${window.location.host}/project/${versionID}/export/${diagramID}`,
      persistedTabID: Session.tabIDPersistor.getRaw()!,
      persistedBrowserID: Session.browserIDPersistor.getRaw()!,
    };

    try {
      let result: Blob;

      if (type === ExportFormat.PDF) {
        result = await client.canvasExport.toPDF(options);
      } else if (type === ExportFormat.PNG) {
        result = await client.canvasExport.toPNG(options);
      } else {
        throw new Error('Unknown export type');
      }

      fileSaver.saveAs(result, `voiceflow-export-${Date.now()}.${type}`);
    } catch {
      toast.genericError();
    }
  };

export const exportModel =
  (nlpProvider: NLPProvider, intents?: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    try {
      let data: string;
      const projectName = ProjectV2.active.nameSelector(state)?.replace(/ /g, '_');

      if (nlpProvider === NLPProvider.ALEXA) {
        data = await client.platform.alexa.modelExport.exportBlob(versionID, 'ask', intents);
        downloadFromURL(`${projectName}-alexa-model.json`, data);
        URL.revokeObjectURL(data);
      } else if (nlpProvider === NLPProvider.DIALOGFLOW_ES) {
        data = await client.platform.google.modelExport.exportBlob(versionID, 'dialogflow/es', intents);
        downloadFromURL(`${projectName}-dialogflow-es-model.zip`, data);
        URL.revokeObjectURL(data);
      } else if (nlpProvider === NLPProvider.RASA) {
        data = await client.platform.general.modelExport.exportBlob(versionID, 'rasa', intents);
        downloadFromURL(`${projectName}-rasa-model.zip`, data);
        URL.revokeObjectURL(data);
      } else if (nlpProvider === NLPProvider.LUIS) {
        data = await client.platform.general.modelExport.exportBlob(versionID, 'luis', intents);
        downloadFromURL(`${projectName}-general-model.json`, data);
        URL.revokeObjectURL(data);
      } else {
        throw new Error(`no provider matched: ${nlpProvider}`);
      }

      dispatch(Tracking.trackActiveProjectExportInteractionModel({ nlpProvider }));
    } catch (error) {
      Sentry.error(error);
      toast.error('Model export failed');
    }
  };

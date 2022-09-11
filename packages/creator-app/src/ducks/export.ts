import { DataTypes, download, downloadFromURL, toast } from '@voiceflow/ui';
import fileSaver from 'file-saver';
import _orderBy from 'lodash/orderBy';

import client from '@/client';
import * as Errors from '@/config/errors';
import { ExportFormat, NLPProvider } from '@/constants';
import { PrototypeRenderSyncOptions } from '@/constants/prototype';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';
import { jsonToCSV } from '@/utils/files';
import * as Sentry from '@/vendors/sentry';

export const exportCanvas =
  (type: ExportFormat): Thunk =>
  async (_, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = CreatorV2.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);

    if (type === ExportFormat.DIALOGS) {
      const projectName = ProjectV2.active.nameSelector(state);

      try {
        const data = await client.api.version.exportResponses(versionID);

        if (!data.length) {
          toast.error('No responses to export');

          return;
        }

        const jsonToExport = _orderBy(data, ['diagramID', 'blockID']).map(
          ({ blockID, blockName, diagramID, blockColor, diagramName, blockContent }) => ({
            'canvas id': diagramID,
            'canvas name': diagramName,
            'block id': blockID,
            'block name': blockName,
            'block content': blockContent,
            'block color': blockColor || 'gray',
          })
        );

        download(`${projectName?.replace(/ /g, '_')}.csv`, jsonToCSV(jsonToExport), DataTypes.CSV);
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
  (nlpProvider: NLPProvider, intents?: string[], compilerOptions?: PrototypeRenderSyncOptions): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    try {
      let data: string;
      const projectName = ProjectV2.active.nameSelector(state)?.replace(/ /g, '_');

      await dispatch(Prototype.compilePrototype(compilerOptions));

      switch (nlpProvider) {
        case NLPProvider.ALEXA:
          data = await client.platform.alexa.modelExport.exportBlob(versionID, 'ask', intents);
          downloadFromURL(`${projectName}-alexa-model.json`, data);
          URL.revokeObjectURL(data);
          break;
        case NLPProvider.DIALOGFLOW_ES:
          data = await client.platform.google.modelExport.exportBlob(versionID, 'dialogflow/es', intents);
          downloadFromURL(`${projectName}-dialogflow-es-model.zip`, data);
          URL.revokeObjectURL(data);
          break;
        case NLPProvider.RASA:
          data = await client.platform.general.modelExport.exportBlob(versionID, 'rasa', intents);
          downloadFromURL(`${projectName}-rasa-model.zip`, data);
          URL.revokeObjectURL(data);
          break;
        case NLPProvider.LUIS:
          data = await client.platform.general.modelExport.exportBlob(versionID, 'luis', intents);
          downloadFromURL(`${projectName}-general-model.json`, data);
          URL.revokeObjectURL(data);
          break;
        case NLPProvider.WATSON:
          // TODO: This is missing a file extension
          data = await client.platform.general.modelExport.exportBlob(versionID, 'watson', intents);
          downloadFromURL(`${projectName}-watson-model`, data);
          URL.revokeObjectURL(data);
          break;
        case NLPProvider.EINSTEIN:
          // TODO: This is missing a file extension
          data = await client.platform.general.modelExport.exportBlob(versionID, 'einstein', intents);
          downloadFromURL(`${projectName}-einstein-model`, data);
          URL.revokeObjectURL(data);
          break;
        case NLPProvider.LEX_V1:
          // TODO: This is missing a file extension
          data = await client.platform.general.modelExport.exportBlob(versionID, 'lexV1', intents);
          downloadFromURL(`${projectName}-lex-model`, data);
          URL.revokeObjectURL(data);
          break;
        case NLPProvider.VF_CSV:
          data = await client.platform.general.modelExport.exportBlob(versionID, 'csv', intents);
          downloadFromURL(`${projectName}.vf.csv`, data);
          break;
        case NLPProvider.NUANCE_MIX:
          data = await client.platform.general.modelExport.exportBlob(versionID, 'nuanceMix', intents);
          downloadFromURL(`${projectName}-nuance-mix-model.trsx.xml`, data);
          URL.revokeObjectURL(data);
          break;
        default:
          throw new Error(`no provider matched: ${nlpProvider}`);
      }

      dispatch(Tracking.trackActiveProjectExportInteractionModel({ nlpProvider }));
    } catch (error) {
      Sentry.error(error);
      toast.error('Model export failed');
    }
  };

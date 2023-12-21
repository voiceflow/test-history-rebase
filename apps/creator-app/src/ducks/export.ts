import { datadogRum } from '@datadog/browser-rum';
import { DataTypes, download, downloadFromURL, toast } from '@voiceflow/ui';
import fileSaver from 'file-saver';
import _orderBy from 'lodash/orderBy';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as NLP from '@/config/nlp';
import { ExportFormat } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';
import { jsonToCSV } from '@/utils/files';
import { downloadVF } from '@/utils/vf';

export const exportCanvas =
  (type: ExportFormat, version?: string, projectId?: string | null): Thunk =>
  async (_, getState) => {
    const state = getState();
    const versionID = version || Session.activeVersionIDSelector(state);
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
        datadogRum.addError(error);
        toast.error('.csv export failed');
      }
      return;
    }

    if (type === ExportFormat.VF) {
      const getProjectById = ProjectV2.getProjectByIDSelector(state);
      const projectName = ProjectV2.active.nameSelector(state) || getProjectById({ id: projectId })?.name;

      await downloadVF({
        name: projectName,
        versionID,
      });

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
  ({ origin, nlpType, intents }: { origin: Tracking.ModelExportOriginType; nlpType: NLP.Constants.NLPType; intents?: string[] }): Thunk =>
  async (dispatch, getState) => {
    const nlpConfig = NLP.Config.get(nlpType);

    if (!nlpConfig.export) return;

    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    try {
      const projectName = ProjectV2.active.nameSelector(state)?.replace(/ /g, '_');

      // DO NOT REMOVE: We want to render all intents before exporting model. Exported model should include all intents whatever is used on canvas or not.
      await dispatch(Prototype.compilePrototype({ renderUnusedIntents: true }));

      const data = await nlpConfig.export.method(versionID, intents?.length ? intents : undefined);

      const extension = intents?.length ? nlpConfig.export.intentsExtension : nlpConfig.export.defaultExtension;

      downloadFromURL(`${projectName}${nlpConfig.export.fileSuffix}${extension}`, data);

      URL.revokeObjectURL(data);

      dispatch(Tracking.trackActiveProjectExportInteractionModel({ origin, nlpType }));
    } catch (error) {
      datadogRum.addError(error);
      toast.error('Model export failed');
    }
  };

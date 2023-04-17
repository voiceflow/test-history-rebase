import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { useContextApi } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import * as NLP from '@/config/nlp';
import { ExportFormat as CanvasExportFormat, ExportType } from '@/constants';
import * as Export from '@/ducks/export';
import * as Tracking from '@/ducks/tracking';
import { useActiveProjectNLUConfig, useActiveProjectPlatformConfig, useDispatch, useTrackingEvents } from '@/hooks';

interface ContextValue {
  onExport: (origin: Tracking.ModelExportOriginType) => void;
  nlpTypes: NLP.Constants.NLPType[];
  exportType: ExportType;
  isExporting: boolean;
  exportIntents: string[];
  exportNLPType: NLP.Constants.NLPType | null;
  setExportType: (exportType: ExportType) => void;
  setExportNLPType: (provider: NLP.Constants.NLPType) => void;
  setExportIntents: (intents: string[]) => void;
  canvasExportFormat: CanvasExportFormat;
  checkedExportIntents: string[];
  setCanvasExportFormat: (format: CanvasExportFormat) => void;
  setCheckedExportIntents: (intents: string[]) => void;
}

export const Context = React.createContext<Nullable<ContextValue>>(null);

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const nluConfig = useActiveProjectNLUConfig();
  const platformConfig = useActiveProjectPlatformConfig();

  const exportModel = useDispatch(Export.exportModel);
  const exportCanvas = useDispatch(Export.exportCanvas);

  const [trackingEvents] = useTrackingEvents();
  const [exportType, setExportType] = React.useState<ExportType>(ExportType.MODEL);
  const [isExporting, setExporting] = React.useState(false);
  const [canvasExportFormat, setCanvasExportFormat] = React.useState(CanvasExportFormat.PNG);

  const nlpTypes = React.useMemo(() => _sortBy(nluConfig.nlps, (nlp) => nlp.name).map((nlp) => nlp.type), [nluConfig]);

  const [exportNLPType, setExportNLPType] = React.useState<NLP.Constants.NLPType | null>(
    !platformConfig.is(Platform.Constants.PlatformType.VOICEFLOW) ? nlpTypes[0] : null
  );
  const [exportIntents, setExportIntents] = React.useState<string[]>([]);
  const [checkedExportIntents, setCheckedExportIntents] = React.useState<string[]>([]);

  const onExport = React.useCallback(
    async (origin: Tracking.ModelExportOriginType) => {
      trackingEvents.trackExportButtonClick({ format: canvasExportFormat });
      setExporting(true);

      if (exportType === ExportType.CANVAS) {
        await exportCanvas(canvasExportFormat);
      } else if (exportNLPType) {
        await exportModel({
          origin,
          nlpType: exportNLPType,
          intents: exportIntents,
        });
      }

      trackingEvents.trackProjectExported({ exportType, exportFormat: canvasExportFormat });

      setExporting(false);
    },
    [nluConfig, exportType, exportNLPType, exportIntents, canvasExportFormat]
  );

  const api = useContextApi({
    nlpTypes,
    onExport,
    exportType,
    isExporting,
    setExportType,
    exportIntents,
    exportNLPType,
    setExportIntents,
    setExportNLPType,
    canvasExportFormat,
    checkedExportIntents,
    setCanvasExportFormat,
    setCheckedExportIntents,
  });

  return <Context.Provider value={api}>{children}</Context.Provider>;
};

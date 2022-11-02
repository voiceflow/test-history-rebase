import { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import * as NLP from '@/config/nlp';
import * as NLU from '@/config/nlu';
import { Permission } from '@/config/permissions';
import { GATED_EXPORT_TYPES } from '@/config/planLimits/canvasExport';
import { ExportFormat as CanvasExportFormat, ExportType } from '@/constants';
import * as Export from '@/ducks/export';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, usePermission, useTrackingEvents } from '@/hooks';
import { PlatformContext } from '@/pages/Project/contexts';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

interface ExportValue {
  onExport: (origin: Tracking.ModelExportOriginType) => void;
  nlpTypes: NLP.Constants.NLPType[];
  canExport: boolean;
  exportType: ExportType;
  isExporting: boolean;
  setCanExport: (canExport: boolean) => void;
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

export const ExportContext = React.createContext<Nullable<ExportValue>>(null);

export const { Consumer: ExportConsumer } = ExportContext;

export const ExportProvider: React.FC = ({ children }) => {
  const exportModel = useDispatch(Export.exportModel);
  const exportCanvas = useDispatch(Export.exportCanvas);
  const [permissionToExport] = usePermission(Permission.MODEL_EXPORT);

  const [trackingEvents] = useTrackingEvents();
  const platform = React.useContext(PlatformContext)!;
  const [exportType, setExportType] = React.useState<ExportType>(ExportType.MODEL);
  const [isExporting, setExporting] = React.useState(false);
  const [canvasExportFormat, setCanvasExportFormat] = React.useState(CanvasExportFormat.PNG);
  const [canExport, setCanExport] = React.useState(permissionToExport || !GATED_EXPORT_TYPES.has(canvasExportFormat));

  const nlpTypes = React.useMemo(() => _sortBy(NLU.Config.get(platform).nlps, (nlp) => nlp.name).map((nlp) => nlp.type), [platform]);

  const [exportNLPType, setExportNLPType] = React.useState<NLP.Constants.NLPType | null>(!isVoiceflowPlatform(platform) ? nlpTypes[0] : null);
  const [exportIntents, setExportIntents] = React.useState<string[]>([]);
  const [checkedExportIntents, setCheckedExportIntents] = React.useState<string[]>([]);

  const onExport = React.useCallback(
    async (origin) => {
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

      trackingEvents.trackProjectExported({
        platform,
        exportType,
        exportFormat: canvasExportFormat,
      });

      setExporting(false);
    },
    [exportType, exportNLPType, exportIntents, canvasExportFormat]
  );

  const api = useContextApi({
    nlpTypes,
    onExport,
    canExport,
    exportType,
    isExporting,
    setCanExport,
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

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
};

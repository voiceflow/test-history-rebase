import { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { Permission } from '@/config/permissions';
import { GATED_EXPORT_TYPES } from '@/config/planLimits/canvasExport';
import { ExportFormat as CanvasExportFormat, ExportType, NLPProvider, NLPProviderLabels } from '@/constants';
import * as Export from '@/ducks/export';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, usePermission, useTrackingEvents } from '@/hooks';
import { PlatformContext } from '@/pages/Project/contexts';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

import { getNlpModelProvider } from './constants';

interface ExportValue {
  onExport: (origin: Tracking.ModelExportOriginType) => void;
  exportType: ExportType;
  isExporting: boolean;
  canExport: boolean;
  setExportType: (exportType: ExportType) => void;
  setCanExport: (canExport: boolean) => void;
  nlpProviderOptions: NLPProvider[];
  checkedExportIntents: string[];
  modelExportIntents: string[];
  canvasExportFormat: CanvasExportFormat;
  modelExportProvider?: NLPProvider;
  setModelExportIntents: (intents: string[]) => void;
  setCheckedExportIntents: (intents: string[]) => void;
  setCanvasExportFormat: (format: CanvasExportFormat) => void;
  setModelExportProvider: (provider: NLPProvider) => void;
}

export const ExportContext = React.createContext<Nullable<ExportValue>>(null);

export const { Consumer: ExportConsumer } = ExportContext;

export const ExportProvider: React.FC = ({ children }) => {
  const exportCanvas = useDispatch(Export.exportCanvas);
  const exportModel = useDispatch(Export.exportModel);
  const [permissionToExport] = usePermission(Permission.MODEL_EXPORT);

  const [trackingEvents] = useTrackingEvents();
  const platform = React.useContext(PlatformContext)!;
  const [exportType, setExportType] = React.useState<ExportType>(ExportType.MODEL);
  const [isExporting, setExporting] = React.useState(false);
  const [canvasExportFormat, setCanvasExportFormat] = React.useState(CanvasExportFormat.PNG);
  const [canExport, setCanExport] = React.useState(permissionToExport || !GATED_EXPORT_TYPES.has(canvasExportFormat));

  const nlpProviderOptions = React.useMemo(() => {
    // order alphabetically by label
    return _sortBy(getNlpModelProvider(platform), (provider) => NLPProviderLabels[provider]);
  }, [platform]);

  const [modelExportProvider, setModelExportProvider] = React.useState<NLPProvider | undefined>(
    !isVoiceflowPlatform(platform) ? nlpProviderOptions[0] : undefined
  );
  const [modelExportIntents, setModelExportIntents] = React.useState<string[]>([]);
  const [checkedExportIntents, setCheckedExportIntents] = React.useState<string[]>([]);

  const onExport = React.useCallback(
    async (origin) => {
      trackingEvents.trackExportButtonClick({ format: canvasExportFormat });
      setExporting(true);

      if (exportType === ExportType.CANVAS) {
        await exportCanvas(canvasExportFormat);
      } else if (modelExportProvider) {
        await exportModel(modelExportProvider, origin, modelExportIntents);
      }

      trackingEvents.trackProjectExported({
        platform,
        exportType,
        exportFormat: canvasExportFormat,
      });

      setExporting(false);
    },
    [exportType, modelExportProvider, modelExportIntents, canvasExportFormat]
  );

  const api = useContextApi({
    onExport,
    exportType,
    isExporting,
    canExport,
    setExportType,
    setCanExport,
    nlpProviderOptions,
    canvasExportFormat,
    modelExportIntents,
    checkedExportIntents,
    modelExportProvider,
    setCanvasExportFormat,
    setModelExportIntents,
    setModelExportProvider,
    setCheckedExportIntents,
  });

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
};

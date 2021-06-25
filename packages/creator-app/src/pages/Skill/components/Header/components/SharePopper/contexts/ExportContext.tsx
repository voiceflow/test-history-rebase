import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { ExportFormat } from '@/constants';
import * as Export from '@/ducks/export';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { Nullable } from '@/types';

interface ExportValue {
  onExport: () => void;
  isExporting: boolean;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
}

export const ExportContext = React.createContext<Nullable<ExportValue>>(null);

export const { Consumer: ExportConsumer } = ExportContext;

export const ExportProvider: React.FC = ({ children }) => {
  const exportCanvas = useDispatch(Export.exportCanvas);

  const [trackingEvents] = useTrackingEvents();

  const [isExporting, setExporting] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState(ExportFormat.PNG);

  const onExport = React.useCallback(async () => {
    trackingEvents.trackExportButtonClick({ format: exportFormat });
    setExporting(true);

    await exportCanvas(exportFormat);

    setExporting(false);
  }, [exportFormat, exportCanvas]);

  const api = useContextApi({
    onExport,
    isExporting,
    exportFormat,
    setExportFormat,
  });

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
};

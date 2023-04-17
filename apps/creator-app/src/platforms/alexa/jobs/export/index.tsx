import { Button, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { AlexaStageType } from '@/constants/platforms';
import { ExportContext } from '@/contexts/ExportContext';

import { useAlexaExportStageContent } from './stages';

export { default as AlexaUploadLink } from './components/AlexaUploadLink';

const AlexaExport: React.FC = () => {
  const exportContext = React.useContext(ExportContext)!;
  const stageType = exportContext?.job?.stage?.type;
  const Content = useAlexaExportStageContent(stageType);

  const AlexaExportButton = React.useMemo(() => {
    switch (stageType) {
      case AlexaStageType.IDLE:
      case AlexaStageType.PROGRESS:
        return (
          <Button squareRadius disabled>
            Export <SvgIcon icon="loader" spin inline mb={-2} ml={6} />
          </Button>
        );
      default:
        return (
          <Button onClick={() => exportContext.start()} squareRadius>
            Export
          </Button>
        );
    }
  }, [stageType]);

  return (
    <JobInterface Content={Content} context={exportContext}>
      {AlexaExportButton}
    </JobInterface>
  );
};

export default AlexaExport;

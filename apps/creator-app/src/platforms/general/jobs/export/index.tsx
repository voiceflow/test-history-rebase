import { Button, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { GeneralStageType } from '@/constants/platforms';
import { ExportContext } from '@/contexts/ExportContext';

import { useGeneralExportStageContent } from './stages';

export { default as GeneralUploadLink } from './components/GeneralUploadLink';

const GeneralExport: React.FC = () => {
  const exportContext = React.useContext(ExportContext)!;
  const stageType = exportContext?.job?.stage?.type;
  const Content = useGeneralExportStageContent(stageType);

  const GeneralExportButton = React.useMemo(() => {
    switch (stageType) {
      case GeneralStageType.IDLE:
      case GeneralStageType.PROGRESS:
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
      {GeneralExportButton}
    </JobInterface>
  );
};

export default GeneralExport;

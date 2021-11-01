import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';

import { ExportType } from '../constants';
import { ExportContext } from '../contexts';

const ExportFooter: React.FC = () => {
  const { isExporting, onExport, exportType } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = exportType === ExportType.MODEL && intents.length === 0;

  return (
    <FlexApart fullWidth>
      <Link href={Documentation.PROJECT_EXPORT}>Learn More</Link>

      <PlatformUploadButton
        isActive={!!isExporting}
        disabled={noModelData}
        label="Export"
        icon="publishSpin"
        onClick={() => (isExporting ? undefined : onExport())}
      />
    </FlexApart>
  );
};

export default ExportFooter;

import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';

import { ExportContext } from '../contexts';

const ExportFooter: React.FC = () => {
  const { isExporting, onExport } = React.useContext(ExportContext)!;

  return (
    <FlexApart fullWidth>
      <Link href={Documentation.PROJECT_EXPORT}>Learn More</Link>

      <PlatformUploadButton isActive={!!isExporting} label="Export" icon="publishSpin" onClick={() => (isExporting ? undefined : onExport())} />
    </FlexApart>
  );
};

export default ExportFooter;

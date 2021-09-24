import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import UploadButton from '@/pages/Canvas/header/ActionGroup/components/UploadButton';

import { ExportContext } from '../contexts';

const ExportFooter: React.FC = () => {
  const { isExporting, onExport } = React.useContext(ExportContext)!;

  return (
    <FlexApart fullWidth>
      <Link href={Documentation.PROJECT_EXPORT}>Learn More</Link>

      <UploadButton isActive={!!isExporting} label="Export" icon="publishSpin" onClick={() => (isExporting ? undefined : onExport())} />
    </FlexApart>
  );
};

export default ExportFooter;

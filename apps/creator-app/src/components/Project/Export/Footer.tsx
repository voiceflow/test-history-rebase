import { tid } from '@voiceflow/style';
import { Box, System } from '@voiceflow/ui';
import type { BaseProps } from '@voiceflow/ui-next';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import { ExportType } from '@/constants';

import { Context } from './Context';

interface FooterProps extends BaseProps {
  origin?: string;
  linkURL?: string;
  withoutLink?: boolean;
  selectedItems?: string[];
}

export const Footer: React.FC<FooterProps> = ({ origin = 'Share Menu', linkURL, selectedItems, testID }) => {
  const { onExport, exportType, isExporting, exportIntents } = React.useContext(Context)!;

  const noModelData = exportType === ExportType.MODEL && exportIntents.length === 0 && !selectedItems?.length;

  const onExportClick = () => {
    if (isExporting) return;

    onExport(origin);
  };

  return (
    <Box.FlexApart fullWidth>
      <System.Link.Anchor href={linkURL || Documentation.PROJECT_EXPORT} data-testid={tid(testID, 'learn-more')}>
        Learn More
      </System.Link.Anchor>
      <PlatformUploadButton
        icon="arrowSpin"
        label="Export"
        onClick={onExportClick}
        isActive={!!isExporting}
        disabled={noModelData}
      />
    </Box.FlexApart>
  );
};

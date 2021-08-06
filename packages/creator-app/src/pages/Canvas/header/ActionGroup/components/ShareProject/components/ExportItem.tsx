import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Upgrade from '@/components/Upgrade';
import { Permission } from '@/config/permissions';
import { ExportFormat } from '@/constants';
import { usePermission } from '@/hooks';

import Description from './Description';
import Header from './Header';
import MenuItemContainer from './MenuItemContainer';

export const EXPORT_OPTIONS = [
  { id: ExportFormat.PNG, label: 'Image' },
  { id: ExportFormat.PDF, label: 'PDF' },
  { id: ExportFormat.VF, label: 'Local File (.vf)' },
];

export interface ExportItemProps {
  updateType: (type: ExportFormat) => void;
  exportType: ExportFormat;
}

const ExportItem: React.FC<ExportItemProps> = ({ updateType, exportType }) => {
  const [canExport] = usePermission(Permission.CANVAS_EXPORT);

  return (
    <>
      <MenuItemContainer onClick={stopImmediatePropagation()}>
        <div>
          <Header>
            <span>Export</span>
          </Header>

          <Description fontSize={15} mb={16}>
            <span>Export your project in a PNG, PDF or local file (.vf).</span>
          </Description>

          <Description fontSize={13} mb={8} fontWeight={600}>
            Content Format
          </Description>

          <RadioGroup isFlat options={EXPORT_OPTIONS} checked={exportType} onChange={updateType} />
        </div>
      </MenuItemContainer>

      {!canExport && <Upgrade>Remove branding from PNG & PDF exports.</Upgrade>}
    </>
  );
};

export default ExportItem;

import React from 'react';

import PlanBubble from '@/components/PlanBubble';
import RadioGroup from '@/components/RadioGroup';
import { Link } from '@/components/Text';
import { Permission } from '@/config/permissions';
import { ExportFormat, PlanType } from '@/constants';
import { usePermission } from '@/hooks';
import { stopImmediatePropagation } from '@/utils/dom';

import Description from '../Description';
import Header from '../Header';
import MenuItemContainer from '../MenuItemContainer';

export const EXPORT_OPTIONS = [
  { id: ExportFormat.PNG, label: 'Image' },
  { id: ExportFormat.PDF, label: 'PDF' },
  { id: ExportFormat.VF, label: 'Local File (.vf)' },
];

export type ExportItemProps = {
  updateType?: (type: ExportFormat) => void;
};

const ExportItem: React.FC<ExportItemProps> = ({ updateType }) => {
  const [selectedExportType, setSelectedExportType] = React.useState(ExportFormat.PNG);
  const [canExport] = usePermission(Permission.CANVAS_EXPORT);

  return (
    <MenuItemContainer onClick={stopImmediatePropagation()}>
      <div>
        <Header>
          <span>Export</span>
          {!canExport && <PlanBubble plan={PlanType.PRO} />}
        </Header>

        <Description fontSize={13} mb={16}>
          <span>Export your project as a PNG, PDF or local file. </span>
          <Link href="https://docs.voiceflow.com/#/features/sharing-features?id=export-your-canvas-as-pdfpng">Learn More</Link>
        </Description>

        <Description fontSize={13} mb={8} fontWeight={600}>
          Content Format
        </Description>

        <RadioGroup
          isFlat
          options={EXPORT_OPTIONS}
          checked={selectedExportType}
          onChange={(type) => {
            setSelectedExportType(type);
            updateType?.(type);
          }}
        />
      </div>
    </MenuItemContainer>
  );
};

export default ExportItem;

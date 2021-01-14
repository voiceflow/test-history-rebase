import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import SvgIcon from '@/components/SvgIcon';
import { ClickableText } from '@/components/Text';
import { Permission } from '@/config/permissions';
import { ExportFormat, ModalType } from '@/constants';
import { useModals, usePermission } from '@/hooks';
import { stopImmediatePropagation } from '@/utils/dom';

import Description from './Description';
import Header from './Header';
import MenuItemContainer from './MenuItemContainer';
import Upgrade from './Upgrade';

export const EXPORT_OPTIONS = [
  { id: ExportFormat.PNG, label: 'Image' },
  { id: ExportFormat.PDF, label: 'PDF' },
  { id: ExportFormat.VF, label: 'Local File (.vf)' },
];

export type ExportItemProps = {
  updateType: (type: ExportFormat) => void;
  exportType: ExportFormat;
};

const ExportItem: React.FC<ExportItemProps> = ({ updateType, exportType }) => {
  const { toggle: togglePayment } = useModals(ModalType.PAYMENT);
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

      {!canExport && (
        <Upgrade onClick={stopImmediatePropagation()}>
          <SvgIcon icon="upgrade" color="#279745" mr={16} />
          Remove branding from PNG & PDF exports.&nbsp;<ClickableText onClick={togglePayment}>Upgrade.</ClickableText>
        </Upgrade>
      )}
    </>
  );
};

export default ExportItem;

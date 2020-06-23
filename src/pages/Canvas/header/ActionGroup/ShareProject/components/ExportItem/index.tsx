import React from 'react';

import BubbleText from '@/components/BubbleText';
import Button, { ButtonVariant } from '@/components/Button';
import RadioGroup from '@/components/RadioGroup';
import { Link } from '@/components/Text';
import { ExportFormat, FEATURE_IDS, FEATURE_PLAN_PERMISSIONS, PlanType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { ConnectedProps } from '@/types';
import { stopImmediatePropagation } from '@/utils/dom';

import ButtonContainer from '../ButtonContainer';
import Description from '../Description';
import Header from '../Header';
import LoadingButton from '../LoadingButton';
import MenuItemContainer from '../MenuItemContainer';

export const EXPORT_OPTIONS = [
  { id: ExportFormat.PNG, label: 'Image' },
  { id: ExportFormat.PDF, label: 'PDF' },
];

export type ExportItemProps = {
  plan: PlanType | null;
  onRedirect: () => void;
};

const ExportItem: React.FC<ExportItemProps & ConnectedExportItemProps> = ({ plan, onRedirect, isExporting, exportCanvas }) => {
  const [selectedExportType, setSelectedExportType] = React.useState(ExportFormat.PNG);
  const [trackingEvents] = useTrackingEvents();

  const isEnabled = FEATURE_PLAN_PERMISSIONS[FEATURE_IDS.EXPORT].includes(plan!);

  const onClick = () => {
    trackingEvents.trackExportButtonClick({ format: selectedExportType });

    if (isEnabled) {
      exportCanvas(selectedExportType);
    } else {
      onRedirect();
    }
  };

  return (
    <MenuItemContainer onClick={stopImmediatePropagation()}>
      <div>
        <Header>
          <span>Export</span>
          {!isEnabled && <BubbleText color="green">Pro</BubbleText>}
        </Header>

        <Description mb={16}>
          <span>Export your projects content as an image or PDF file </span>
          <Link href="https://docs.voiceflow.com/#/features/sharing-features?id=export-your-canvas-as-pdfpng">Learn More</Link>
        </Description>

        <Description mb={8} fontWeight={600}>
          Content Format
        </Description>

        <RadioGroup isFlat options={EXPORT_OPTIONS} checked={selectedExportType} onChange={setSelectedExportType} />
      </div>

      <ButtonContainer>
        {isExporting ? (
          <LoadingButton iconProps={{ spin: true, size: 20 }} variant={ButtonVariant.SECONDARY} icon="publishSpin" square />
        ) : (
          <Button variant={ButtonVariant.SECONDARY} onClick={stopImmediatePropagation(onClick)}>
            Export
          </Button>
        )}
      </ButtonContainer>
    </MenuItemContainer>
  );
};

const mapStateToProps = {
  isExporting: Skill.isCanvasExportingSelector,
};

const mapDispatchToProps = {
  exportCanvas: Skill.exportCanvas,
};

type ConnectedExportItemProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ExportItem) as React.FC<ExportItemProps>;

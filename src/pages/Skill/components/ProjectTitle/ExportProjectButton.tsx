import React from 'react';

import Dropdown from '@/components/Dropdown';
import { FlexApart } from '@/components/Flex';
import { ModalFooter } from '@/components/LegacyModal';
import { MenuContainer } from '@/components/Menu';
import { Link } from '@/components/Text';
import Tooltip from '@/components/TippyTooltip';
import { ExportFormat } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { ExportItem } from '@/pages/Canvas/header/ActionGroup/components/ShareProject/components';
import UploadButton from '@/pages/Canvas/header/ActionGroup/components/UploadButton';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import { stopImmediatePropagation } from '@/utils/dom';

import { ExportIcon } from './components';

const EXPORT_HELP_LINK = 'https://docs.voiceflow.com/#/features/sharing-features?id=export-your-canvas-as-pdfpng';

const ExportProjectButton: React.FC<ConnectedExportProjectButtonProps> = ({ isExporting, exportCanvas }) => {
  const [trackingEvents] = useTrackingEvents();
  const [selectedExportType, setSelectedExportType] = React.useState(ExportFormat.PNG);

  const onClick = () => {
    trackingEvents.trackExportButtonClick({ format: selectedExportType });

    exportCanvas(selectedExportType);
  };

  return (
    <Dropdown
      placement="bottom"
      zIndex={999}
      preventOverflow={{ padding: 16, boundariesElement: document.body }}
      menu={() => (
        <MenuContainer fullWidth noBottomPadding>
          <FadeDownDelayedContainer>
            <ExportItem exportType={selectedExportType} updateType={setSelectedExportType} />
            <ModalFooter onClick={stopImmediatePropagation()}>
              <FlexApart fullWidth>
                <Link href={EXPORT_HELP_LINK}>Learn More</Link>
                <UploadButton isActive={!!isExporting} label="Export" icon="publishSpin" onClick={stopImmediatePropagation(onClick)} />
              </FlexApart>
            </ModalFooter>
          </FadeDownDelayedContainer>
        </MenuContainer>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <Tooltip title="Export">
          <ExportIcon isOpen={isOpen} ref={ref} icon="export" size="16" color={isOpen ? '#3D82E2' : '#BECEDC'} onClick={() => onToggle()} />
        </Tooltip>
      )}
    </Dropdown>
  );
};

const mapStateToProps = {
  isExporting: Skill.isCanvasExportingSelector,
};

const mapDispatchToProps = {
  exportCanvas: Skill.exportCanvas,
};

type ConnectedExportProjectButtonProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ExportProjectButton);

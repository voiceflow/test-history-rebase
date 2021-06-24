import { Dropdown, FlexApart, Link, MenuContainer, stopImmediatePropagation, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { ModalFooter } from '@/components/LegacyModal';
import * as Documentation from '@/config/documentation';
import { ExportFormat } from '@/constants';
import * as Export from '@/ducks/export';
import { connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { ExportItem } from '@/pages/Canvas/header/ActionGroup/components/ShareProject/components';
import UploadButton from '@/pages/Canvas/header/ActionGroup/components/UploadButton';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

import ExportIcon from './ExportIcon';

const ExportProjectButton: React.FC<ConnectedExportProjectButtonProps> = ({ exportCanvas }) => {
  const [isExporting, setExporting] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();
  const [selectedExportType, setSelectedExportType] = React.useState(ExportFormat.PNG);

  const onClick = async () => {
    trackingEvents.trackExportButtonClick({ format: selectedExportType });
    setExporting(true);

    await exportCanvas(selectedExportType);

    setExporting(false);
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
                <Link href={Documentation.PROJECT_EXPORT}>Learn More</Link>
                <UploadButton
                  isActive={!!isExporting}
                  label="Export"
                  icon="publishSpin"
                  onClick={stopImmediatePropagation(isExporting ? undefined : onClick)}
                />
              </FlexApart>
            </ModalFooter>
          </FadeDownDelayedContainer>
        </MenuContainer>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <TippyTooltip title="Export">
          <ExportIcon isOpen={isOpen} ref={ref} icon="export" size="16" color={isOpen ? '#3D82E2' : '#BECEDC'} onClick={() => onToggle()} />
        </TippyTooltip>
      )}
    </Dropdown>
  );
};

const mapDispatchToProps = {
  exportCanvas: Export.exportCanvas,
};

type ConnectedExportProjectButtonProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ExportProjectButton);

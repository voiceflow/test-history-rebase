import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { FlexApart } from '@/components/Flex';
import { ModalFooter } from '@/components/LegacyModal';
import { MenuContainer } from '@/components/Menu';
import { Link } from '@/components/Text';
import Tooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import { ExportFormat, ModalType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useModals, usePermission, useTrackingEvents } from '@/hooks';
import { ExportItem } from '@/pages/Canvas/header/ActionGroup/components/ShareProject/components';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import { stopImmediatePropagation } from '@/utils/dom';

import { ExportIcon } from './components';

const EXPORT_HELP_LINK = 'https://docs.voiceflow.com/#/features/sharing-features?id=export-your-canvas-as-pdfpng';

const ExportProjectButton: React.FC<ConnectedExportProjectButtonProps> = ({ isExporting, exportCanvas }) => {
  const { open: openCanvasExportModal } = useModals(ModalType.CANVAS_EXPORT);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);
  const [trackingEvents] = useTrackingEvents();
  const [canExport] = usePermission(Permission.CANVAS_EXPORT);
  const [selectedExportType, setSelectedExportType] = React.useState(ExportFormat.PNG);

  const onClick = () => {
    trackingEvents.trackExportButtonClick({ format: selectedExportType });

    if (canExport) {
      exportCanvas(selectedExportType);
    } else {
      openPaymentModal();
    }
  };

  return (
    <Dropdown
      placement="bottom"
      zIndex={999}
      preventOverflow={{ padding: 16, boundariesElement: document.body }}
      menu={() => (
        <MenuContainer noBottomPadding>
          <FadeDownDelayedContainer>
            <span>
              <ExportItem onRedirect={openCanvasExportModal} updateType={setSelectedExportType} />
            </span>
            <ModalFooter onClick={stopImmediatePropagation()}>
              <FlexApart fullWidth>
                <Link href={EXPORT_HELP_LINK}>Learn More</Link>

                {isExporting ? (
                  <Button variant={ButtonVariant.PRIMARY} icon="publishSpin" disabled>
                    Export
                  </Button>
                ) : (
                  <Button variant={ButtonVariant.PRIMARY} icon={canExport ? 'sync' : null} onClick={stopImmediatePropagation(onClick)}>
                    {canExport ? 'Export' : 'Upgrade'}
                  </Button>
                )}
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
  sharePrototype: Prototype.sharePrototype,
  renderPrototype: Prototype.renderPrototype,
  exportCanvas: Skill.exportCanvas,
};

type ConnectedExportProjectButtonProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ExportProjectButton);

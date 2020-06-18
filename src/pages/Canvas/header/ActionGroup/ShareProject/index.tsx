import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import BaseDropdown from '@/components/Dropdown';
import Tooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import { ModalType, PlanType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature, useModals, useTrackingEvents } from '@/hooks';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

import { ExportItem, MenuContainer, MenuItem } from './components';

const Dropdown: React.FC<any> = BaseDropdown;

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectProps> = ({
  meta,
  plan,
  getImportToken,
  sharePrototype,
  renderPrototype,
  render,
}) => {
  const { open: openProjectDownloadModal } = useModals(ModalType.PROJECT_DOWNLOAD);
  const { open: openTestableLinksModal } = useModals(ModalType.TESTABLE_LINKS);
  const { open: openCanvasExportModal } = useModals(ModalType.CANVAS_EXPORT);
  const [testableLink, setLink] = React.useState<string | boolean>(false);
  const canvasExportFeature = useFeature(FeatureFlag.CANVAS_EXPORT);
  const [trackingEvents] = useTrackingEvents();

  const makeConfig = async () => {
    if (render) {
      await renderPrototype();
    }
    setLink(`${window.location.origin}/demo/${await sharePrototype()}`);
  };

  React.useEffect(() => {
    if (plan !== PlanType.STARTER) {
      makeConfig();
    } else {
      setLink(false);
    }
    getImportToken();
  }, [getImportToken, plan]);

  return (
    <Dropdown
      placement="bottom"
      zIndex={999}
      menu={() => (
        <MenuContainer>
          <FadeDownDelayedContainer>
            <MenuItem
              plan={plan}
              title="Testable Link"
              description="Share your project with others for in browser prototyping."
              onRedirect={openTestableLinksModal}
              help="https://docs.voiceflow.com/#/quickstart/testable-links"
              link={testableLink}
              track={trackingEvents.trackActiveProjectTestableLinkShare}
            />
            <MenuItem
              plan={plan}
              title="Project Download"
              description="Allow other to download this project to their own Voiceflow account."
              onRedirect={openProjectDownloadModal}
              help="https://docs.voiceflow.com/#/quickstart/downloadable-links"
              link={`${window.location.origin}/dashboard?import=${meta?.importToken}`}
              track={trackingEvents.trackActiveProjectDownloadLinkShare}
            />

            {canvasExportFeature.isEnabled && <ExportItem plan={plan} onRedirect={openCanvasExportModal} />}
          </FadeDownDelayedContainer>
        </MenuContainer>
      )}
    >
      {(ref: React.Ref<HTMLElement>, onToggle: () => void, isOpen: boolean) => (
        <Tooltip title="Share Project">
          <Button ref={ref} variant={ButtonVariant.SECONDARY} onClick={onToggle} isActive={isOpen}>
            Share
          </Button>
        </Tooltip>
      )}
    </Dropdown>
  );
};

const mapStateToProps = {
  meta: Skill.skillMetaSelector,
  plan: Workspace.planTypeSelector,
};

const mapDispatchToProps = {
  getImportToken: Skill.getImportToken,
  sharePrototype: Prototype.sharePrototype,
  renderPrototype: Prototype.renderPrototype,
};

type ConnectedShareProjectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ShareProject) as React.FC<ShareProjectProps>;

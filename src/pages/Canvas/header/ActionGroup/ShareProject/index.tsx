import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import Tooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature, useModals, usePermission, useSmartReducerV2, useTrackingEvents } from '@/hooks';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps, Nullable } from '@/types';

import { ExportItem, MenuContainer, MenuItem } from './components';

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectProps> = ({
  meta,
  render,
  getImportToken,
  sharePrototype,
  renderPrototype,
}) => {
  const { open: openProjectDownloadModal } = useModals(ModalType.PROJECT_DOWNLOAD);
  const { open: openTestableLinksModal } = useModals(ModalType.TESTABLE_LINKS);
  const { open: openCanvasExportModal } = useModals(ModalType.CANVAS_EXPORT);

  const canvasExportFeature = useFeature(FeatureFlag.CANVAS_EXPORT);
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [trackingEvents] = useTrackingEvents();

  const [state, stateApi] = useSmartReducerV2({
    testableLink: null as Nullable<string>,
    loadingImportToken: false,
    loadingTestableLink: false,
  });

  const onClickPrototype = () => {
    if (render) {
      renderPrototype();
    }
  };

  const loadTestableLink = async () => {
    if (state.testableLink) {
      return;
    }

    stateApi.loadingTestableLink.set(true);

    const demoID = await sharePrototype();

    stateApi.update({
      testableLink: `${window.location.origin}/demo/${demoID}`,
      loadingTestableLink: false,
    });
  };

  const loadImportToken = async () => {
    if (meta?.importToken) {
      return;
    }

    stateApi.loadingImportToken.set(true);

    await getImportToken();

    stateApi.loadingImportToken.set(false);
  };

  const wrapToggleShare = (prevIsOpen: boolean, onToggle: () => void) => () => {
    if (!prevIsOpen && (canShareProject || canSharePrototype)) {
      loadImportToken();
      loadTestableLink();
    }

    onToggle();
  };

  return (
    <Dropdown
      placement="bottom"
      zIndex={999}
      menu={() => (
        <MenuContainer>
          <FadeDownDelayedContainer>
            <MenuItem
              isAllowed={canSharePrototype}
              loading={state.loadingTestableLink}
              title="Testable Link"
              description="Share your project with others for in browser prototyping."
              onRedirect={openTestableLinksModal}
              help="https://docs.voiceflow.com/#/quickstart/testable-links"
              link={state.testableLink}
              track={trackingEvents.trackActiveProjectTestableLinkShare}
              onClick={onClickPrototype}
            />

            <MenuItem
              isAllowed={canShareProject}
              loading={state.loadingImportToken}
              title="Project Download"
              description="Allow others to download this project to their own Voiceflow account."
              onRedirect={openProjectDownloadModal}
              help="https://docs.voiceflow.com/#/quickstart/downloadable-links"
              link={`${window.location.origin}/dashboard?import=${meta?.importToken}`}
              track={trackingEvents.trackActiveProjectDownloadLinkShare}
            />

            {canvasExportFeature.isEnabled && <ExportItem onRedirect={openCanvasExportModal} />}
          </FadeDownDelayedContainer>
        </MenuContainer>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <Tooltip title="Share Project">
          <Button ref={ref} variant={ButtonVariant.SECONDARY} onClick={wrapToggleShare(isOpen, onToggle)} isActive={isOpen}>
            Share
          </Button>
        </Tooltip>
      )}
    </Dropdown>
  );
};

const mapStateToProps = {
  meta: Skill.skillMetaSelector,
};

const mapDispatchToProps = {
  getImportToken: Skill.getImportToken,
  sharePrototype: Prototype.sharePrototype,
  renderPrototype: Prototype.renderPrototype,
};

type ConnectedShareProjectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ShareProject) as React.FC<ShareProjectProps>;

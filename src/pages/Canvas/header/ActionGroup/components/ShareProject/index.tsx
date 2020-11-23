import { ProjectPrivacy } from '@voiceflow/api-sdk';
import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { ModalFooter } from '@/components/LegacyModal';
import Tooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType, PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature, useModals, usePermission, useSmartReducerV2, useTrackingEvents } from '@/hooks';
import InviteByLink from '@/pages/Collaborators/components/InviteByLink';
import { useCanvasMode } from '@/pages/Skill/hooks';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps, Nullable } from '@/types';
import { stopImmediatePropagation } from '@/utils/dom';

import { ExportItem, MenuContainer, MenuItem, MenuItemV2, SharePrototype } from './components';

const Footer = ModalFooter as React.FC<any>;

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectProps> = ({
  render,
  sharePrototype,
  platform,
  projectID,
  renderPrototype,
  updateProjectPrivacy,
}) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const { open: openProjectDownloadModal } = useModals(ModalType.PROJECT_DOWNLOAD);
  const { open: openTestableLinksModal } = useModals(ModalType.TESTABLE_LINKS);
  const { open: openCanvasExportModal } = useModals(ModalType.CANVAS_EXPORT);

  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canInviteByLink] = usePermission(Permission.INVITE_BY_LINK);

  const [trackingEvents] = useTrackingEvents();

  const isCanvasMode = useCanvasMode();

  const [state, stateApi] = useSmartReducerV2({
    testableLink: null as Nullable<string>,
    loadingTestableLink: false,
  });

  const onClickPrototype = () => {
    if (render) {
      renderPrototype({ aborted: false });
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

  const onClickImport = () => {
    updateProjectPrivacy(projectID, ProjectPrivacy.PUBLIC);
  };

  const wrapToggleShare = (prevIsOpen: boolean, onToggle: () => void) => () => {
    if (!prevIsOpen && (canShareProject || canSharePrototype)) {
      loadTestableLink();
    }

    onToggle();
  };

  return (
    <Dropdown
      placement="bottom"
      zIndex={999}
      preventOverflow={{ padding: 10, boundariesElement: document.body }}
      menu={() => (
        <MenuContainer>
          <FadeDownDelayedContainer>
            {headerRedesign.isEnabled ? (
              <>
                <MenuItemV2
                  isAllowed={canSharePrototype}
                  title="Share Prototype"
                  description="Share a testable version of your project that can be prototyped using voice, chat, or chip input."
                />
                {canInviteByLink && (
                  <Footer onClick={stopImmediatePropagation()}>
                    <SharePrototype isAllowed={canSharePrototype} onClick={onClickPrototype} />
                  </Footer>
                )}
              </>
            ) : (
              <>
                <div>
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
                    title="Project Download"
                    description="Allow others to download this project to their own Voiceflow account."
                    onRedirect={openProjectDownloadModal}
                    help="https://docs.voiceflow.com/#/quickstart/downloadable-links"
                    link={`${window.location.origin}/dashboard?import=${projectID}`}
                    track={trackingEvents.trackActiveProjectDownloadLinkShare}
                    onClick={onClickImport}
                  />
                  <ExportItem onRedirect={openCanvasExportModal} />
                </div>
                {canInviteByLink && (
                  <Footer onClick={stopImmediatePropagation()}>
                    <InviteByLink noIcon />
                  </Footer>
                )}
              </>
            )}
          </FadeDownDelayedContainer>
        </MenuContainer>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <Tooltip title="Share Project">
          {headerRedesign.isEnabled && isCanvasMode ? (
            <Button
              ref={ref}
              preventFocusStyle
              variant={ButtonVariant.QUATERNARY}
              large
              onClick={wrapToggleShare(isOpen, onToggle)}
              isActive={isOpen}
            >
              Share
            </Button>
          ) : (
            <Button
              ref={ref}
              preventFocusStyle
              variant={platform === PlatformType.GENERAL ? ButtonVariant.PRIMARY : ButtonVariant.SECONDARY}
              large
              onClick={wrapToggleShare(isOpen, onToggle)}
              isActive={isOpen}
            >
              Share
            </Button>
          )}
        </Tooltip>
      )}
    </Dropdown>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  meta: Skill.skillMetaSelector,
  projectID: Skill.activeProjectIDSelector,
};

const mapDispatchToProps = {
  sharePrototype: Prototype.sharePrototype,
  renderPrototype: Prototype.renderPrototype,
  updateProjectPrivacy: Project.updateProjectPrivacy,
};

type ConnectedShareProjectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ShareProject) as React.FC<ShareProjectProps>;

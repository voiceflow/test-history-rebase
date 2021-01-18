import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { ModalFooter } from '@/components/LegacyModal';
import { toast } from '@/components/Toast';
import { Permission } from '@/config/permissions';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { usePermission, useSmartReducerV2 } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps, Nullable } from '@/types';
import { copy } from '@/utils/clipboard';
import { stopImmediatePropagation } from '@/utils/dom';

import { MenuContainer, MenuItemV2, SharePrototype } from './components';

const Footer = ModalFooter as React.FC<any>;

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectProps> = ({ render, versionID, renderPrototype }) => {
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canInviteByLink] = usePermission(Permission.INVITE_BY_LINK);

  const isPrototypingMode = usePrototypingMode();

  const [state, stateApi] = useSmartReducerV2({
    testableLink: null as Nullable<string>,
    loadingTestableLink: false,
  });

  const onClickPrototype = async () => {
    if (render && canSharePrototype) {
      renderPrototype({ aborted: false });

      await copyTestableLink();

      toast.success('Link copied to clipboard');
    } else if (!render) {
      toast.error('Unable to copy link to clipboard, please try again or contact support');
    }
  };

  const copyTestableLink = async () => {
    await loadTestableLink();

    copy(state.testableLink);
  };

  const loadTestableLink = async () => {
    if (!state.testableLink) {
      stateApi.update({ testableLink: `${window.location.origin}/prototype/${versionID}` });
    }
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
          </FadeDownDelayedContainer>
        </MenuContainer>
      )}
    >
      {(ref, onToggle, isOpen) =>
        isPrototypingMode ? (
          <Button
            ref={ref}
            variant={ButtonVariant.PRIMARY}
            icon="link"
            onClick={canSharePrototype ? onClickPrototype : wrapToggleShare(isOpen, onToggle)}
          >
            Share Prototype
          </Button>
        ) : (
          <Button ref={ref} preventFocusStyle variant={ButtonVariant.QUATERNARY} large onClick={wrapToggleShare(isOpen, onToggle)} isActive={isOpen}>
            Share
          </Button>
        )
      }
    </Dropdown>
  );
};

const mapStateToProps = {
  versionID: Skill.activeSkillIDSelector,
};

const mapDispatchToProps = {
  renderPrototype: Prototype.renderPrototype,
};

type ConnectedShareProjectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ShareProject) as React.FC<ShareProjectProps>;

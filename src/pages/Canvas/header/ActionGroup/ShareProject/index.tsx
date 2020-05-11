import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import BaseDropdown from '@/components/Dropdown';
import Tooltip from '@/components/TippyTooltip';
import { ModalType, PlanType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { FadeDownContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

import { MenuContainer, MenuItem } from './components';

const Dropdown: React.FC<any> = BaseDropdown;

type ShareProjectProps = {
  render: boolean;
};

const ShareProject: React.FC<ShareProjectProps & ConnectedShareProjectPropsProps> = ({
  meta,
  plan,
  getImportToken,
  sharePrototype,
  renderPrototype,
  render,
}) => {
  const { open: openProjectDownloadModal } = useModals(ModalType.PROJECT_DOWNLOAD);
  const { open: openTestableLinksModal } = useModals(ModalType.TESTABLE_LINKS);
  const [testableLink, setLink] = React.useState<string | boolean>(false);

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
          <FadeDownContainer>
            <MenuItem
              plan={plan}
              title="Testable Link"
              description="Share your project with others for in browser prototyping."
              onRedirect={openTestableLinksModal}
              help="https://docs.voiceflow.com/voiceflow-documentation/downloading-and-sharing-projects"
              link={testableLink}
            />
            <MenuItem
              plan={plan}
              title="Project Download"
              description="Allow other to download this project to their own Voiceflow account."
              onRedirect={openProjectDownloadModal}
              help="https://docs.voiceflow.com/voiceflow-documentation/downloading-and-sharing-projects"
              link={`${window.location.origin}/dashboard?import=${meta?.importToken}`}
            />
          </FadeDownContainer>
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

type ConnectedShareProjectPropsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ShareProject);

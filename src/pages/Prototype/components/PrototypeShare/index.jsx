import React, { useState } from 'react';
import { Tooltip } from 'react-tippy';

import Dropdown from '@/components/Dropdown';
import IconButton from '@/components/IconButton';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';

import ShareMenu from './components/ShareMenu';

const PrototypeShare = (props) => {
  const { sharePrototype, renderPrototype, render, user } = props;
  const { open: openCollaboratorsModal } = useModals(ModalType.COLLABORATORS);
  const [link, setLink] = useState(false);

  const makeConfig = async () => {
    setLink(false);
    if (render) await renderPrototype();
    setLink(`${window.location.origin}/demo/${await sharePrototype()}`);
  };

  const handleInviteClick = (toggle) => {
    openCollaboratorsModal();
    toggle();
  };

  return (
    <div>
      <Dropdown
        menu={(toggle) => <ShareMenu toggle={toggle} link={link} user={user} handleInviteClick={handleInviteClick} />}
        placement="bottom"
        selfDismiss
      >
        {(ref, onToggle, isOpen) => (
          <Tooltip title="Share Test" position="bottom">
            <IconButton
              active={isOpen}
              variant="action"
              color="#5b9dfa"
              icon="share"
              onClick={() => {
                if (!isOpen) {
                  makeConfig();
                }
                onToggle();
              }}
              size={16}
              ref={ref}
              large
            />
          </Tooltip>
        )}
      </Dropdown>
    </div>
  );
};

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  sharePrototype: Prototype.sharePrototype,
  renderPrototype: Prototype.renderPrototype,
  setConfirm: Modal.setConfirm,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeShare);

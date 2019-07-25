import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from 'reactstrap';

import { User } from '@/components/User/User';

const MemberRow = ({ member, admin, user, confirm, update, remove }) => {
  const IS_ADMIN = admin === user;

  let info;
  let type;
  let remove_action;
  if (member.creator_id) {
    type = 'FILLED';
    remove_action = () =>
      confirm({
        text: 'Are you sure you want to remove this member?',
        confirm: () => update({ creator_id: null, email: null, invite: '' }),
      });
    // HAS CREATOR ID ASSOCIATED: ACCEPTED INVITE FULL MEMBERSHIP
    info = (
      <>
        <User user={member} className="lg" />
        <div className="ml-3">
          <span>{member.name}</span>
          <br />
          <small className="text-muted">{member.email}</small>
        </div>
      </>
    );
  } else if (member.email) {
    type = 'INVITE';
    // ONLY HAS EMAIL: INVITE SENT OUT BUT NOT ACCEPTED
    remove_action = () =>
      confirm({
        text: 'Are you sure you want to cancel this invite?',
        confirm: () => update({ email: null, invite: '' }),
      });
    info = (
      <>
        <div className="member-icon lg solid">
          <img src="/pending.svg" width="17" style={{ marginTop: -5 }} alt="pending" />
        </div>
        <div className="ml-3">
          <span>{member.email}</span>
          <br />
          <small className="text-muted">Pending Confirmation</small>
        </div>
      </>
    );
  } else {
    if (!IS_ADMIN) return null;
    // NO INVITE: EMPTY SEAT
    type = 'EMPTY';
    remove_action = remove;
    info = (
      <>
        <div className="member-icon lg solid">
          <img src="/add-teammate.svg" width="18" style={{ marginTop: -4 }} alt="add" />
        </div>
        <div className="ml-3">
          <Input
            className="w-300 form-bg"
            placeholder="Email"
            value={member.invite || ''}
            type="email"
            onChange={(e) => update({ invite: e.target.value })}
          />
        </div>
      </>
    );
  }

  return (
    <div className="member-row">
      <div className="w-100 space-between">
        <div className="horizontal-center">{info}</div>
        {IS_ADMIN && user !== member.creator_id && (
          <UncontrolledDropdown inNavbar>
            <DropdownToggle tag="div" className="dropdown-button">
              <i className="far fa-ellipsis-h" />
            </DropdownToggle>
            <DropdownMenu right className="no-select py-1">
              {type === 'FILLED' && <DropdownItem onClick={remove_action}>Remove Member</DropdownItem>}
              {type === 'INVITE' && <DropdownItem onClick={remove_action}>Cancel Invite</DropdownItem>}
              {type === 'EMPTY' && <DropdownItem onClick={remove_action}>Remove Seat</DropdownItem>}
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
        {member.status === 100 && <label className="text-muted mr-2">OWNER</label>}
      </div>
    </div>
  );
};

export default MemberRow;

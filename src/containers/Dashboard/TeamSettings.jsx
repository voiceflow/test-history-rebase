import cn from 'classnames';
import update from 'immutability-helper';
import { cloneDeep } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, DropdownItem, DropdownMenu, DropdownToggle, Input, Modal, ModalBody, UncontrolledDropdown } from 'reactstrap';

import Button from '@/components/Button';
import CheckMark from '@/components/CheckMark';
import { ModalHeader } from '@/components/Modals/ModalHeader';
import { Spinner } from '@/components/Spinner';
import SvgIcon from '@/components/SvgIcon';
import Image from '@/components/Uploads/Image';
import { setConfirm, setError } from '@/ducks/modal';
import { deleteTeam, leaveTeam, removeTrial, updateCurrentTeamItem, updateMembers, updateTeamName } from '@/ducks/team';
import CogIcon from '@/svgs/cog.svg';

import Billing from './Billing';
import { PLANS_ID } from './PLANS';
import PricingCard from './PricingCard';
import SeatsCheckout from './SeatsCheckout';
import Contact from './components/Contact';
import MemberRow from './components/MemberRow';

// SETTING STATES: MEMBERS, SETTINGS, DELETE
/* eslint-disable sonarjs/no-duplicate-string */
const STAGES = {
  PLAN: { title: 'Board Plans', fullscreen: true },
  CHECKOUT: { title: 'Upgrade Board', fullscreen: true },
  'CHECKOUT:PROJECTS': { title: 'Upgrade Board', fullscreen: true },
  MEMBERS: { title: 'Manage Members' },
  UPDATING_MEMBERS: { title: 'Manage Members' },
  SETTINGS: { title: 'Board Settings' },
  DELETE: { title: 'Delete Board' },
  BILLING: { title: 'Billing' },
  SUCCESS: { title: 'Update Success' },
};

/* eslint-enable sonarjs/no-duplicate-string */

class TeamSettings extends Component {
  state = {
    stage: 'MEMBERS',
    input: '',
    name: '',
    members: [],
    diff: [],
    is_diff: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { open, team } = this.props;
    const { members, diff } = this.state;
    if (!prevProps.open && open && typeof open === 'string') {
      this.setState({
        name: team.name,
        stage: open,
        update_pay: false,
        is_diff: false,
        members: cloneDeep(team.members),
        diff: cloneDeep(team.members),
      });
    }

    if (prevState.members !== members && prevState.diff === diff) {
      this.checkDiff();
    }
  }

  checkDiff = () => {
    const { diff, members } = this.state;
    const empty = (m) => !m.creator_id && !m.email;

    const empty_diff = diff.filter(empty);
    const empty_members = members.filter(empty);

    // 3 conditions to check for: total length of members changed, number of invites changed, invites updated
    if (diff.length !== members.length || empty_diff.length !== empty_members.length || empty_members.filter((m) => !!m.invite).length !== 0) {
      this.setState({ is_diff: true });
    } else {
      this.setState({ is_diff: false });
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  deleteTeam = () => {
    const { deleteTeam, team, close } = this.props;
    this.setState({ stage: 'DELETING' });
    deleteTeam(team.team_id)
      .then(() => {
        close();
      })
      .catch(() => {
        close();
      });
  };

  addMember = () => {
    const { members } = this.state;
    this.setState({
      members: update(members, { $push: [{}] }),
    });
  };

  applyChanges = (e) => {
    const { members } = this.state;
    const { team, updateMembers } = this.props;

    e && e.preventDefault();
    if (!this.IS_ADMIN) return false;

    if (team.status === 0 && members.length > 2) {
      this.setState({ stage: 'CHECKOUT' });
    } else {
      this.setState({ stage: 'UPDATING_MEMBERS' });
      updateMembers(members)
        .then(this.teamUpdate)
        .catch(this.teamUpdate);
    }

    return false;
  };

  teamUpdate = () => {
    const { team } = this.props;
    this.setState({
      stage: 'MEMBERS',
      update_pay: true,
      is_diff: false,
      members: cloneDeep(team.members),
      diff: cloneDeep(team.members),
    });

    if (this.check) this.check();
  };

  upgrade = (plan) => {
    const { team } = this.props;
    if (plan <= team.status) return null;

    return () => {
      this.checkout_plan = plan;
      this.setState({ stage: 'CHECKOUT' });
    };
  };

  leaveTeam = () => {
    const { setConfirm, leaveTeam, team } = this.props;
    setConfirm({
      text: 'Are you sure you want to leave this team?',
      confirm: () => leaveTeam(team.team_id),
    });
  };

  downgrade = () => {
    const { removeTrial, team, close } = this.props;

    removeTrial(team.team_id)
      .then(() => close())
      .catch(() => close());
  };

  renderBody = () => {
    const { stage, name, members, is_diff, input } = this.state;
    const { team, user, setError, updateTeam, setConfirm, updateTeamName } = this.props;
    switch (stage) {
      case 'PLAN':
        if (!this.IS_ADMIN) return Contact;
        return (
          <div className="d-flex align-items-start justify-content-center mx--2 mt-5">
            {!team.expiry ? <PricingCard plan="HOBBY" delay={300} team={team} /> : ''}
            <PricingCard plan="PROFESSIONAL" delay={600} team={team} upgrade={this.upgrade(1)} downgrade={team.expiry && (() => this.downgrade())} />
            <PricingCard plan="BUSINESS" delay={900} team={team} upgrade={this.upgrade(2)} />
          </div>
        );
      case 'SUCCESS':
        return (
          <div className="py-5 my-5 text-center">
            <img src="/images/icons/reciept.svg" alt="reciept" width={80} />
            <br />
            <br />
            <span className="text-muted">
              Your subscription has been activated.
              <br />
              Thank you.
            </span>
          </div>
        );
      case 'CHECKOUT:PROJECTS':
      case 'CHECKOUT':
        if (!this.IS_ADMIN) return Contact;
        // eslint-disable-next-line no-case-declarations
        let plan;
        // reset the checkout plan when consumed
        if (this.checkout_plan) {
          plan = this.checkout_plan;
          this.checkout_plan = undefined;
        }
        return (
          <div className="my-5 pt-4 pb-5 text-center">
            {stage.endsWith('PROJECTS') && (
              <Alert color="danger" className="absolute-top">
                Project Limit Reached, upgrade to create more projects
              </Alert>
            )}
            <div className="uppercase text-muted">Upgrade Board</div>
            <div className="super-center mt-4">
              <SeatsCheckout
                prompt="Upgrade"
                members={members}
                team={team}
                next={() => this.setState({ stage: 'SUCCESS' })}
                user={user}
                plan={plan}
                collab={() => this.setState({ stage: 'MEMBERS' })}
                modify={() => this.setState({ stage: 'BILLING' })}
                width={400}
              />
            </div>
          </div>
        );
      case 'DELETING':
        return <Spinner message="Deleting Board" />;
      case 'DELETE':
        // eslint-disable-next-line no-case-declarations
        const equal = input.trim().toLowerCase() === team.name.trim().toLowerCase();

        return (
          <div>
            <Alert color="danger" className="mt-2">
              <b>Are you sure you want to delete this?</b>
              <br />
              Deleting a Board will Permenantly Delete all of its Projects and Live Voice Applications
            </Alert>
            <label>Enter this board's name to confirm</label>
            <Input name="input" onChange={this.handleChange} value={input} placeholder="Board Name" />
            <div className="my-3 text-center">
              <Button isBtn isWarning disabled={!equal} onClick={this.deleteTeam}>
                Delete Board
              </Button>
            </div>
          </div>
        );
      case 'BILLING':
        if (!this.IS_ADMIN) return Contact;
        return (
          <Billing
            stage={stage}
            setError={setError}
            user={user}
            team={team}
            update_pay={() => this.setState({ update_pay: true })}
            update={(stage) => this.setState({ stage })}
          />
        );
      case 'SETTINGS':
        if (!this.IS_ADMIN) break;
        return (
          <div className="mb-3">
            <label>Board Icon</label>
            {team.status === 0 ? (
              <div className="mb-3">
                <img src="/images/icons/vf_logo.png" alt="Voiceflow" width={80} className="py-2 mb-1 no-select" />
                <br />
                <small className="text-muted">Upgrade this board under billing to add a custom image</small>
              </div>
            ) : (
              <Image
                tiny
                className="icon-image icon-image-sm icon-image-square mb-3"
                path={`/team/${team.team_id}/picture`}
                image={team.image}
                update={(url) => updateTeam({ image: url })}
                replace
              />
            )}
            <label>Name</label>
            <Input
              name="name"
              placeholder="Board Name"
              onChange={(e) => {
                updateTeamName(e.target.value);
                this.handleChange(e);
              }}
              value={name}
              disabled={team.creator_id !== user.creator_id}
            />
            <hr />
            <label>Billing</label>
            <Button isBtn isLinkLarge onClick={() => this.setState({ stage: 'BILLING' })}>
              Invoices
            </Button>
            <br />
            <small className="text-muted">View invoices, update your payment options</small>
            <hr />
            <label>Privacy</label>
            <Button isBtn isLinkLarge onClick={() => this.setState({ stage: 'DELETE', input: '' })}>
              Delete Board
            </Button>
            <br />
            <small className="text-muted">This action is irreversible. All team and project data will be removed</small>
          </div>
        );
      default:
        /* eslint-disable no-case-declarations */
        const UPDATING = stage === 'UPDATING_MEMBERS';
        const DISABLED = UPDATING || !is_diff;
        /* eslint-enable no-case-declarations */

        return (
          <div className={UPDATING ? 'disabled' : ''}>
            {this.IS_ADMIN && (
              <small className="d-flex text-muted mt-2 mb-2">
                <span className="badge mr-2">{team.seats}</span> current seats
              </small>
            )}
            {members.map((m, i) => {
              return (
                <MemberRow
                  key={i}
                  user={user.creator_id}
                  admin={team.creator_id}
                  member={m}
                  update={(payload) => {
                    this.setState(
                      {
                        members: update(members, {
                          [i]: { $merge: payload },
                        }),
                      },
                      () => {
                        if (payload.email === null && payload.invite === '') {
                          this.applyChanges();
                        }
                      }
                    );
                  }}
                  remove={() =>
                    this.setState({
                      members: update(members, {
                        $splice: [[i, 1]],
                      }),
                    })
                  }
                  confirm={setConfirm}
                />
              );
            })}
            {this.IS_ADMIN && (
              <div className="my-3">
                <div className="text-center mb-3">
                  <Button isBtn isLinkLarge className="pointer mt-4" onClick={this.addMember}>
                    Add teammates
                  </Button>
                </div>
                <div className="text-center mt-3 position-relative">
                  <Button isBtn isPrimary type="submit" disabled={DISABLED} style={{ width: 150 }} onClick={this.applyChanges}>
                    {UPDATING ? <Spinner isEmpty /> : 'Apply Changes'}
                  </Button>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '69%',
                    }}
                  >
                    <CheckMark
                      show={(show) => {
                        this.check = show;
                      }}
                      timeout={1500}
                    />
                  </div>
                </div>
                {team.status > 0 && this.priceEstimate()}
              </div>
            )}
          </div>
        );
    }
  };

  priceEstimate = () => {
    const { members } = this.state;
    const { team } = this.props;
    if (team.seats < members.length) {
      const rate = PLANS_ID[team.status] ? PLANS_ID[team.status].rate : 29;
      return <div className="text-center text-muted mt-2">+${(members.length - team.seats) * rate}/mo</div>;
    }
    if (team.seats > members.length) {
      return null;
    }
    return null;
  };

  render() {
    const { team, user, update, open, close, hideIcon } = this.props;
    const { update_pay, stage } = this.state;

    if (!team) return null;
    this.IS_ADMIN = user.creator_id === team.creator_id;

    const fullscreen = stage in STAGES && STAGES[stage].fullscreen;

    return (
      <div className="nav-child-item">
        {!hideIcon && (
          <UncontrolledDropdown inNavbar>
            <DropdownToggle tag="div" className="pointer team-setting-cog">
              <SvgIcon icon={CogIcon} />
            </DropdownToggle>
            <DropdownMenu right className="no-select">
              <DropdownItem onClick={() => update('MEMBERS')}>{this.IS_ADMIN ? 'Manage Members' : 'Team Members'}</DropdownItem>
              {this.IS_ADMIN ? (
                <>
                  <DropdownItem onClick={() => update('SETTINGS')}>Board Settings</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => update('PLAN')}>Board Plan</DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.leaveTeam}>Leave Board</DropdownItem>
                </>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
        <Modal
          isOpen={!!open}
          toggle={close}
          className={cn('upgrade-modal', {
            'modal-fullscreen': fullscreen,
          })}
        >
          <ModalHeader toggle={close} className="pb-2" header={(STAGES[stage] && STAGES[stage].title) || 'Board Settings'} />
          <ModalBody className="px-45 pt-0 overflow-hidden">
            {['WARNING', 'LOCKED'].includes(team.state) &&
              (update_pay ? (
                <Alert>Please refresh your page to see updates</Alert>
              ) : (
                <>
                  {team.state === 'WARNING' && (
                    <Alert color="danger" onClick={() => this.setState({ stage: 'BILLING' })}>
                      We were unable to charge your last invoice
                      <br />
                      <br />
                      If there is an issue with your current card please update your payment option
                    </Alert>
                  )}
                  {team.state === 'LOCKED' && (
                    <Alert color="danger" onClick={() => this.setState({ stage: 'BILLING' })}>
                      Your subscription failed
                      <br />
                      Please update your payment option to continue
                    </Alert>
                  )}
                </>
              ))}
            {this.renderBody()}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  team: state.team.byId[state.team.team_id],
});

const mapDispatchToProps = (dispatch) => {
  return {
    removeTrial: (team_id) => dispatch(removeTrial(team_id)),
    updateMembers: (members, options) => dispatch(updateMembers(members, options)),
    deleteTeam: (team_id) => dispatch(deleteTeam(team_id)),
    leaveTeam: (team_id) => dispatch(leaveTeam(team_id)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    updateTeam: (payload) => dispatch(updateCurrentTeamItem(payload)),
    updateTeamName: (name) => dispatch(updateTeamName(name)),
    setError: (error) => dispatch(setError(error)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamSettings);

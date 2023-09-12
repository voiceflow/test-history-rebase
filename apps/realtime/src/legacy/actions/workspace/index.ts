import { LoguxControlOptions } from '../../control';
import AddWorkspaceControl from './add';
import ChangeWorkspaceSeats from './changeSeats';
import CheckoutWorkspaceControl from './checkout';
import CreateWorkspaceControl from './create';
import DowngradeWorkspaceTrialControl from './downgradeTrial';
import LeaveWorkspaceControl from './leave';
import {
  AcceptInviteControl,
  AddWorkspaceMemberControl,
  CancelInviteControl,
  EjectWorkspaceMemberControl,
  PatchWorkspaceMemberControl,
  RemoveWorkspaceMemberControl,
  RenewWorkspaceInvite,
  ReplaceWorkspaceMembersControl,
  SendInviteControl,
  UpdateInviteControl,
} from './member';
import { LoadAllQuotasControl, RefreshQuotaDetails, ReplaceQuotaControl } from './quotas';
import RemoveWorkspaceControl from './remove';
import { PatchWorkspaceSettingsControl, ReplaceWorkspaceSettingsControl, ToggleDashboardKanbanControl } from './settings';
import UpdateWorkspaceImageControl from './updateImage';
import UpdateWorkspaceNameControl from './updateName';

const buildWorkspaceActionControls = (options: LoguxControlOptions) => ({
  addWorkspaceControl: new AddWorkspaceControl(options),
  changeWorkspaceSeats: new ChangeWorkspaceSeats(options),
  leaveWorkspaceControl: new LeaveWorkspaceControl(options),
  createWorkspaceControl: new CreateWorkspaceControl(options),
  removeWorkspaceControl: new RemoveWorkspaceControl(options),
  checkoutWorkspaceControl: new CheckoutWorkspaceControl(options),
  updateWorkspaceImageControl: new UpdateWorkspaceImageControl(options),
  updateWorkspaceNameControl: new UpdateWorkspaceNameControl(options),

  // workspace invite
  sendWorkspaceInviteControl: new SendInviteControl(options),
  renewWorkspaceInviteControl: new RenewWorkspaceInvite(options),
  updateWorkspaceInviteControl: new UpdateInviteControl(options),
  acceptWorkspaceInviteControl: new AcceptInviteControl(options),
  cancelWorkspaceInviteControl: new CancelInviteControl(options),

  // workspace member
  addWorkspaceMemberControl: new AddWorkspaceMemberControl(options),
  patchWorkspaceMemberControl: new PatchWorkspaceMemberControl(options),
  ejectWorkspaceMemberControl: new EjectWorkspaceMemberControl(options),
  removeWorkspaceMemberControl: new RemoveWorkspaceMemberControl(options),
  replaceWorkspaceMembersControl: new ReplaceWorkspaceMembersControl(options),

  // workspace trial
  downgradeTrialControl: new DowngradeWorkspaceTrialControl(options),

  // workspace quotas
  replaceQuotaControl: new ReplaceQuotaControl(options),
  loadAllQuotasControl: new LoadAllQuotasControl(options),

  // workspace settings
  toggleDashboardKanbanControl: new ToggleDashboardKanbanControl(options),
  patchWorkspaceSettingsControl: new PatchWorkspaceSettingsControl(options),
  replaceWorkspaceSettingsControl: new ReplaceWorkspaceSettingsControl(options),
  refreshWorkspaceQuotaDetailsControl: new RefreshQuotaDetails(options),
});

export default buildWorkspaceActionControls;

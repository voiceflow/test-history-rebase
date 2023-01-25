import { LoguxControlOptions } from '../../control';
import AddWorkspaceControl from './add';
import CheckoutWorkspaceControl from './checkout';
import CreateWorkspaceControl from './create';
import LeaveWorkspaceControl from './leave';
import {
  AcceptInviteControl,
  AddWorkspaceMemberControl,
  CancelInviteControl,
  EjectWorkspaceMemberControl,
  PatchWorkspaceMemberControl,
  RemoveWorkspaceMemberControl,
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
  createWorkspaceControl: new CreateWorkspaceControl(options),
  checkoutWorkspaceControl: new CheckoutWorkspaceControl(options),
  leaveWorkspaceControl: new LeaveWorkspaceControl(options),
  removeWorkspaceControl: new RemoveWorkspaceControl(options),
  updateWorkspaceImageControl: new UpdateWorkspaceImageControl(options),
  updateWorkspaceNameControl: new UpdateWorkspaceNameControl(options),

  // workspace invite
  sendWorkspaceInviteControl: new SendInviteControl(options),
  updateWorkspaceInviteControl: new UpdateInviteControl(options),
  acceptWorkspaceInviteControl: new AcceptInviteControl(options),
  cancelWorkspaceInviteControl: new CancelInviteControl(options),

  // workspace member
  addWorkspaceMemberControl: new AddWorkspaceMemberControl(options),
  patchWorkspaceMemberControl: new PatchWorkspaceMemberControl(options),
  ejectWorkspaceMemberControl: new EjectWorkspaceMemberControl(options),
  removeWorkspaceMemberControl: new RemoveWorkspaceMemberControl(options),
  replaceWorkspaceMembersControl: new ReplaceWorkspaceMembersControl(options),

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

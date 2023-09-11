import { CMSResourceActions as CMSResourceActionsComponent } from './CMSResourceActions.components';
import { cmsResourceActionsButtonFactory } from './CMSResourceActionsButton/CMSResourceActionsButton.factory';
import { CMSResourceActionsButtonDelete } from './CMSResourceActionsButtonDelete/CMSResourceActionsButtonDelete.component';

export const CMSResourceActions = Object.assign(CMSResourceActionsComponent, {
  Move: cmsResourceActionsButtonFactory({ label: 'Move...', iconName: 'MoveTo' }),
  Share: cmsResourceActionsButtonFactory({ label: 'Share...', iconName: 'Community' }),
  Export: cmsResourceActionsButtonFactory({ label: 'Export...', iconName: 'Export' }),
  Delete: CMSResourceActionsButtonDelete,
  CreateFolder: cmsResourceActionsButtonFactory({ label: 'Create folder', iconName: 'Folder' }),
});

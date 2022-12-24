import { Input } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export { default as AddCollaborators } from './AddCollaborators';
export { default as ButtonSquare } from './ButtonSquare';
export { default as ImportButton } from './ImportButton';
export { default as NotificationsButton } from './NotificationsButton';
export { default as ResourcesHeaderButton } from './ResourcesHeaderButton';
export { default as SettingsButton } from './SettingsButton';
export { default as WorkspacesDropdown } from './WorkspacesDropdown';

export const NavChildItem = styled.div`
  padding-left: 20px;
`;

export const NewWorkspaceTab = styled.span`
  display: flex;

  & > :first-child {
    margin-right: 10px;
  }
`;

export const SubHeaderItem = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-left: 24px;
`;

export const ProjectSearchContainer = styled.div`
  display: flex;
  height: inherit;
  padding-right: 24px;
`;

export const ProjectSearchInput = styled(Input)`
  border: none !important;
  background: transparent;
  font-size: 15px;
  box-shadow: none !important;
  padding: 10px 16px 10px 0px;

  input::placeholder {
    line-height: 20px;
  }
`;

export const WorkspaceItemNameWrapper = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 10px;
  line-height: 20px;
`;

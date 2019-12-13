import { styled } from '@/hocs';

export { default as AddCollaborators } from './AddCollaborators';
export { default as ButtonSquare } from './ButtonSquare';
export { default as Numbered } from './Numbered';
export { default as UpdateBubble } from './UpdateBubble';

export const NavChildItem = styled.div`
  padding-left: 22px;
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
  padding-left: 22px;
`;

export const TabsContainer = styled.div`
  display: flex;
  height: inherit;
  padding-right: 24px;
`;

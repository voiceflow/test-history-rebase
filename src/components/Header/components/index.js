import styled from 'styled-components';

export { default as UserMenu } from './UserMenu';

export const HeaderContainer = styled.header`
  position: relative;
  z-index: 10;
  width: 100%;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
`;

export const CenterGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
`;

export const PrimaryHeader = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 34px 0 40px;
  background-color: #fff;
`;

export const HeaderNavigation = styled.div`
  display: flex;
  flex-basis: calc(50% - 100px);
  align-items: center;
  height: inherit;
  overflow-x: hidden;
  white-space: nowrap;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-basis: calc(50% + 100px);
  align-items: center;
  justify-content: flex-end;
  height: inherit;
`;

export const JustifiedHeaderActions = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-end;
  height: inherit;
  white-space: nowrap;
`;

export const BackButton = styled.span`
  display: flex;
  align-items: center;
  height: inherit;
  margin-right: 12px;
  padding: 22px 22px 22px 36px;
  color: #8da2b5;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;

export const Logo = styled.img`
  border-radius: 50%;
  height: 42px;
  margin-right: 6px;
  cursor: ${({ disableLogoClick }) => (disableLogoClick ? 'initial' : 'pointer')};
`;

export const SecondaryNavWrapper = styled.div`
  top: 64px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 40px;
  white-space: nowrap;
  background-color: #f7f9fb;
  border-top: 1px solid #dce5e8;

  & > * {
    height: inherit;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  height: inherit;
  user-select: none;
`;

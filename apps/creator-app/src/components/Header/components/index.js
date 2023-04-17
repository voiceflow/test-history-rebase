import styled from 'styled-components';

export { default as UserMenu } from './UserMenu';

export const HeaderContainer = styled.header`
  position: relative;
  z-index: 10;
  width: 100%;
  border-bottom: 1px solid #dfe3ed;
`;

export const PrimaryHeader = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 32px;
  background-color: #fff;
`;

export const HeaderNavigation = styled.div`
  display: flex;
  flex: 1;
  flex-basis: calc(50%-100px);
  align-items: center;
  height: inherit;
  overflow-x: hidden;
  white-space: nowrap;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-basis: calc(50%+250px);
  align-items: center;
  justify-content: flex-end;
  height: inherit;
  flex: 1;
`;

export const CenterGroup = styled.div`
  display: flex;
  left: 40%;
  align-items: center;
  min-width: 200px;
`;

export const JustifiedHeaderActions = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-end;
  height: inherit;
  white-space: nowrap;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  height: inherit;
  user-select: none;
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
  border-right: ${({ hasBackText }) => (hasBackText ? 'solid 1px #eaeff4' : 'none')};
  pointer-events: all;

  &:hover {
    opacity: 1;
  }
`;

export const Logo = styled.img`
  height: 42px;
  width: 42px;
  margin-right: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
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
  padding: 0 32px;
  white-space: nowrap;
  background-color: #fff;
  background-image: linear-gradient(-180deg, rgba(246, 246, 246, 0.5) 0%, rgba(246, 246, 246, 0.65) 100%);
  border-top: 1px solid #dfe3ed;

  & > * {
    height: inherit;
  }
`;

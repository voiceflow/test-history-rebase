import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: relative;
  width: 100%;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  z-index: 10;
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
  background-color: #fff;
  padding-right: ${(props) => (props.isBackClick ? 40 : 28)}px
  padding-left: 28px;
  height: 64px;
`;

export const HeaderNavigation = styled.div`
  display: flex;
  flex-basis: calc(50% - 100px);
  white-space: nowrap;
  align-items: center;
  overflow-x: hidden;
  height: inherit;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-basis: calc(50% + 100px);
  justify-content: flex-end;
  align-items: center;
  height: inherit;
`;

export const JustifiedHeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  white-space: nowrap;
  height: inherit;
`;

export const BackButton = styled.span`
  padding: 20px 20px 20px 0;
  margin-right: 6px;
  cursor: pointer;
  height: inherit;
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;

export const Logo = styled.img`
  height: 26px;
  margin-right: 22px;
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

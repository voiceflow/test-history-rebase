import styled from 'styled-components';

export const CanvasHeaderContainer = styled.header`
  position: relative;
  width: 100%;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  z-index: 10;
`;

export const PrimaryCanvasHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 26px;
  background-color: #fff;
`;

export const HeaderNavigation = styled.div`
  flex-basis: calc(50% - 100px);
  white-space: nowrap;
  overflow-x: hidden;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-basis: calc(50% + 100px);
  justify-content: flex-end;
`;

export const JustifiedHeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  white-space: nowrap;
`;

export const ProjectTitleContainer = styled.div`
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
`;

export const BackButton = styled.span`
  position: relative;
  transition: right 0.2s ease;
  right: 0px;
  :hover {
    right: 5px;
  }
`;

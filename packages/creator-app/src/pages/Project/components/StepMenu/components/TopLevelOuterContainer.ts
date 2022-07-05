import { css, styled } from '@/hocs';

const TopLevelOuterContainer = styled.aside<{ isHovered: boolean }>`
  position: absolute;
  top: 16px;
  left: 100%;
  transform: translateX(12px);
  border-radius: 10px;
  background-color: #f4f4f4;
  padding: 4px 4px 0;
  z-index: 10;

  ${({ isHovered }) =>
    !isHovered &&
    css`
      padding-bottom: 4px;
    `}
`;

export default TopLevelOuterContainer;

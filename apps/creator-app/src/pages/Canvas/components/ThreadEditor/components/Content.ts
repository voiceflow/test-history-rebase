import { css, styled } from '@/hocs/styled';

const Content = styled.div<{ isActive?: boolean }>`
  padding: 20px 24px;
  border-top: 1px solid #eaeff4;

  &:first-child {
    border: none;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      background: rgba(238, 244, 246, 0.6);
    `}
`;

export default Content;

import { css, styled, transition } from '@/hocs/styled';

const linkActiveStyle = css`
  color: #3d82e2;
  background-color: rgba(61, 130, 226, 0.1);
`;

const Tab = styled.button<{ isActive?: boolean }>`
  ${transition('color', 'background-color')}

  background-color: transparent;
  height: 36px;
  color: #949db0;
  font-weight: 600;
  border: 0;
  padding: 8px 16px;
  border-radius: 8px;
  line-height: normal;

  &:hover {
    ${linkActiveStyle}
  }

  ${({ isActive }) => isActive && linkActiveStyle}
`;

export default Tab;

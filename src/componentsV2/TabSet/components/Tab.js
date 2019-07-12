import styled, { css } from 'styled-components';

import BaseButton from '@/componentsV2/Button/components/BaseButton';

const Tab = styled(BaseButton)`
  padding: 0 24px;
  border-bottom: 2px solid transparent;
  background: inherit;
  font-size: 15px;
  line-height: 18px;
  user-select: none;

  ${({ isActive }) =>
    isActive
      ? css`
          color: #5d9df5;
          border-bottom: 2px solid #5d9df5;
          cursor: initial;
        `
      : css`
          color: #949db0;
        `};
`;

export default Tab;

import { MenuItem } from '@/components/Menu';
import { css, styled } from '@/hocs';

const SelectItem = styled(MenuItem)`
  position: relative;

  ${({ isFocused }) =>
    isFocused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff !important;
    `}

  ${({ isGroup }) =>
    isGroup &&
    css`
      font-weight: bold;
      cursor: default;
    `}

  ${({ isNested }) =>
    isNested &&
    css`
      padding-left: 36px;
    `}

  ${({ withSubLevel }) =>
    withSubLevel &&
    css`
      padding-right: 80px;
    `}

  &:hover {
    background: none;
  }

  b {
    text-decoration: underline;
  }
`;

export default SelectItem;

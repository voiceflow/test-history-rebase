import { css, styled, units } from '@/hocs';

type Badge = { onClick?: any; slide?: boolean; marginLeft?: number; color?: string; isVisible?: boolean };

const Badge = styled.div<Badge>`
  ${({ marginLeft }) =>
    marginLeft &&
    css`
      margin-left: ${marginLeft}px;
    `}
  ${({ onClick }) =>
    !!onClick &&
    css`
      cursor: pointer;
    `}

  ${({ slide }) =>
    slide &&
    css`
      animation: fadein 0.15s ease, moveinleft 0.15s ease;
    `}

  min-width: 22px;
  display: inline-block;
  height: ${units(2.8)}px;
  margin-top: -4px;
  margin-bottom: -4px;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 6px;
  padding-right: 6px;

  font-weight: 600;
  font-size: 13px;
  line-height: 21px;
  text-align: center;

  ${({ color }) =>
    color
      ? css`
          background: ${color};
          border: 1px solid ${color};
          color: #fff;
        `
      : css`
          background: linear-gradient(180deg, #eff5f6a3 0%, #eef4f6 100%), #fff;
          box-shadow: 0px 1px 0px #d4d9e6;
          border: 1px solid #d4d9e6;
          color: #62778c;
        `}

  ${({ isVisible }) =>
    !isVisible &&
    css`
      display: none;
    `}
`;

export default Badge;

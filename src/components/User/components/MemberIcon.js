import { css, styled } from '@/hocs';

const MemberIcon = styled.div`
  width: 28px;
  height: 28px;
  font-size: 14px;
  line-height: 26px;
  font-size: 13px;
  text-align: center;
  color: #becedc;
  background-color: #fff;
  background-position: center center;
  background-size: contain;
  border: 1px solid rgba(17, 49, 96, 0.08);
  border-radius: 100%;
  box-shadow: inset 0 0 0 2px #fff;
  cursor: default;
  transition: all 0.25s ease;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;

  &:hover {
    border-color: rgba(17, 49, 96, 0.13);
  }

  ${({ large }) =>
    large &&
    css`
      width: 42px;
      height: 42px;
      font-size: 18px;
      line-height: 42px;
    `}

  ${({ solid }) =>
    solid &&
    css`
      border: 1px solid #dce5e8;
    `}
  
  & > * {
    display: inline-block;
  }
`;

export default MemberIcon;

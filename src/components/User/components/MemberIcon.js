import { css, styled } from '@/hocs';

const MemberIcon = styled.div`
  width: 32px;
  height: 32px;
  font-size: 14px;
  line-height: 30px;
  color: #8da2b5;
  font-size: 16px;
  text-align: center;
  background-color: #f7f9fb;
  background-position: center center;
  background-size: contain;
  border: 1px solid #fff;
  border-radius: 100%;
  box-shadow: 0 0 0 1px #fff, 0 0px 0px 2px rgba(17, 49, 96, 0.08);
  cursor: default;
  transition: all 0.25s ease;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;

  &:hover {
    box-shadow: 0 0 0 1px #fff, 0 0px 0px 2px rgba(17, 49, 96, 0.13);
  }

  ${({ large }) =>
    large &&
    css`
      width: 48px;
      height: 48px;
      font-size: 24px;
      line-height: 48px;
    `}

  ${({ solid }) =>
    solid &&
    css`
      background-color: #fff;
      border: 1px solid #dce5e8;
      box-shadow: none;
    `}
  
  & > * {
    display: inline-block;
  }
`;

export default MemberIcon;

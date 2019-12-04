import { css, styled } from '@/hocs';

const MemberIcon = styled.div`
  width: 26px;
  height: 26px;
  font-size: 14px;
  line-height: 25px;
  font-size: 13px;
  text-align: center;
  color: rgb(238, 240, 241);
  background-color: rgb(105, 121, 134);
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
      width: 42px;
      height: 42px;
      font-size: 18px;
      line-height: 42px;
      border: 1px solid;
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

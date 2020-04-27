import { css, styled, transition } from '@/hocs';

const MemberIcon = styled.div`
  ${transition('color', 'border')}
  width: 28px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  text-align: center;
  color: #becedc;
  position: relative;
  background-color: #fff;
  background-position: center center;
  background-size: contain;
  border-radius: 100%;
  box-shadow: inset 0 0 0 1px #fff, 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);
  cursor: default;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;

  &:before {
    ${transition('border')}

    display: block;
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 100%;

    content: '';
  }

  &:hover &:before {
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
      &:before {
        border: 1px solid #f6f6f6;
      }
    `}
  
  & > * {
    display: inline-block;
  }
`;

export default MemberIcon;

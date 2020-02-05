import { css, styled, transition } from '@/hocs';

const MemberIcon = styled.div`
  ${transition('color', 'border')}
  width: 26px;
  height: 26px;
  line-height: 22px;
  font-size: 13px;
  text-align: center;
  color: #becedc;
  position: relative;
  background-color: #fff;
  background-position: center center;
  background-size: contain;
  border-radius: 100%;
  border: 2px solid #fff;
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

    border: 1px solid rgba(17, 49, 96, 0.08);
    border-radius: 100%;

    content: '';
  }

  &:hover &:before {
    border-color: rgba(17, 49, 96, 0.13);
  }

  ${({ large }) =>
    large &&
    css`
      width: 40px;
      height: 40px;
      font-size: 18px;
      line-height: 36px;
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

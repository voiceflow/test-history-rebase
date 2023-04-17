import { styled } from '@/hocs/styled';

export const ImportTooltipTitle = styled.div`
  text-transform: capitalize;
`;

export const StatusBubble = styled.div`
  position: relative;
  right: 6px;

  &:after {
    position: absolute;
    left: 31px;
    bottom: 25px;
    display: block;
    width: 4px;
    height: 4px;
    outline: solid 1px #fff;
    border-radius: 50%;
    background-color: #3d82e2;
    content: '';
  }
`;

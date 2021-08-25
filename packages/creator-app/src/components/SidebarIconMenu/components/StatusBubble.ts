import { styled } from '@/hocs';

const StatusBubble = styled.div`
  position: relative;
  right: 6px;

  &:after {
    position: absolute;
    top: 50%;
    right: 50%;
    display: block;
    width: 6px;
    height: 6px;
    margin-top: -9px;
    margin-right: -10px;
    border: solid 1px #fff;
    border-radius: 6px;
    background-image: linear-gradient(to bottom, rgba(224, 79, 120, 0.85), #e04f78 99%);
    content: '';
  }
`;

export default StatusBubble;

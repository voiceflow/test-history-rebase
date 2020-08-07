import { styled } from '@/hocs';

const UnreadCommentsIndicator = styled.div`
  position: absolute;
  top: 7px;
  left: 19px;
  height: 7px;
  width: 7px;
  border: 1px solid #fff;
  border-radius: 50%;
  background-color: #e91e63;
  pointer-events: none;
`;

export default UnreadCommentsIndicator;

import { listDragPlaceholder } from '@/assets';
import { styled } from '@/hocs/styled';

const DragZone = styled.div`
  width: 384px;
  height: 100%;
  margin-top: -1px;
  background-color: #fff;
  background-image: url(${listDragPlaceholder}) !important;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border: 1px solid #eaeff4;
`;

export default DragZone;

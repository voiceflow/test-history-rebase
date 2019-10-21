import { styled, units } from '@/hocs';

const BlockTitle = styled.div`
  min-height: 2em;
  width: 100%;
  padding: 0 ${units(1.5)}px ${units()}px ${units(1.5)}px;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
`;

export default BlockTitle;

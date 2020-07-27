import { styled } from '@/hocs';

type RightColumnProps = {
  withTopPadding?: boolean;
};

const RightColumn = styled.div<RightColumnProps>`
  width: 490px;
  height: 100%;
  overflow-x: hidden;
`;

export default RightColumn;

import { styled } from '@/hocs';

const ExpandingListSectionIndicator = styled.span`
  border-radius: 50%;
  background-color: ${({ color }) => color};
  height: 6px;
  width: 6px;
`;

export default ExpandingListSectionIndicator;

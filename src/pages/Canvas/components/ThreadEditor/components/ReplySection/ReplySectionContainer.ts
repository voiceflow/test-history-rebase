import { flexApartStyles } from '@/components/Flex';
import { styled } from '@/hocs';

const ReplySectionContainer = styled.div`
  ${flexApartStyles}

  background-color: #fdfdfd;
  font-size: 15px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;

  &:hover {
    color: #6e849a;
  }
`;

export default ReplySectionContainer;

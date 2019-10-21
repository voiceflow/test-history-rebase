import { flexStyles } from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const ListManagerItem = styled.li`
  ${flexStyles}
  
  margin-bottom: ${units()}px;

  &:last-child {
    margin-bottom: 0;
  }

  & > :first-child {
    flex: 1;
  }

  & .fas,
  & .fab {
    color: #ccd5dc;

    &:hover {
      color: #8da2b5;
    }
  }

  & .trash-icon {
    padding: 0 ${units()}px;
    cursor: pointer;
  }
`;

export default ListManagerItem;

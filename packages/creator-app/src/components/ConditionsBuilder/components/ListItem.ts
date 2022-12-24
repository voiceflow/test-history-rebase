import { styled } from '@/hocs/styled';

const ListItem = styled.li`
  list-style-type: circle;
  margin-left: 14px;

  div {
    display: inline-block;
  }
  span {
    margin-right: 12px;
  }
`;

export default ListItem;

import { styled, transition } from '@/styles';

const MenuItemNote = styled.span`
  ${transition('color')};

  flex: 1;
  font-size: 13px;
  color: #8da2b5;
  text-align: right;

  &:hover {
    color: #62778c;
  }
`;

export default MenuItemNote;

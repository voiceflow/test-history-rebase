import { styled, transition } from '@/hocs/styled';

export const Tab = styled.div`
  ${transition('background')};
  display: block;
  padding: 10px 25px;
  font-size: 15px;
  color: #132144 !important;
  text-transform: capitalize;

  &.active {
    background: #eef4f6;
  }

  :hover {
    cursor: pointer;
    background: #eef4f6;
    text-decoration: none;
  }
`;

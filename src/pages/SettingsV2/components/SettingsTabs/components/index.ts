import { styled, transition } from '@/hocs';

export const SettingsTab = styled.div<{ selected: boolean }>`
  ${transition('background')};
  padding: 10px 25px;
  font-size: 15px;
  color: #132144;
  text-transform: capitalize;
  background: ${({ selected }) => (selected ? '#eef4f6' : 'white')};

  :hover {
    cursor: pointer;
    background: #eef4f6;
  }
`;

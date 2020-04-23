import { styled, units } from '@/hocs';

const PrefixContainer = styled.div`
  &:not(:last-child) {
    margin-right: ${units(2)}px;
  }
`;

export default PrefixContainer;

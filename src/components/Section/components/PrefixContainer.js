import { styled } from '@/hocs';

const PrefixContainer = styled.div`
  &:not(:last-child) {
    margin-right: 12px;
  }
`;

export default PrefixContainer;

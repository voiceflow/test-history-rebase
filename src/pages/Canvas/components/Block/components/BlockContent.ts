import { styled } from '@/hocs';

const BlockContent = styled.section`
  & > *:not(:last-of-type) {
    margin-bottom: 6px;
  }
`;

export default BlockContent;

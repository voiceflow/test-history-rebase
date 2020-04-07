import { styled } from '@/hocs';

const NewBlockContent = styled.section`
  & > *:not(:last-of-type) {
    margin-bottom: 6px;
  }
`;

export default NewBlockContent;

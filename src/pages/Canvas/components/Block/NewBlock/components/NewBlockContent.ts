import { styled, units } from '@/hocs';

const NewBlockContent = styled.section`
  & > *:not(:last-of-type) {
    margin-bottom: ${units()}px;
  }
`;

export default NewBlockContent;

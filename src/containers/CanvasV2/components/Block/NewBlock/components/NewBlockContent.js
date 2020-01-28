import { styled, units } from '@/hocs';

const NewBlockContent = styled.section`
  & > *:not(:last-child) {
    margin-bottom: ${units()}px;
  }
`;

export default NewBlockContent;

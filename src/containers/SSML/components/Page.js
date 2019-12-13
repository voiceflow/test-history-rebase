import { Container } from '@/components/SSMLEditor';
import { styled } from '@/hocs';

const Page = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 50px;

  ${Container} {
    width: 100%;
  }
`;

export default Page;

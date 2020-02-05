import { styled } from '@/hocs';

const ContentContainer = styled.div`
  padding: ${({ noHeader }) => (noHeader ? '20px 32px' : '0 32px')};
`;

export default ContentContainer;

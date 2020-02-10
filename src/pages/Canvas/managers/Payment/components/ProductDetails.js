import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

const ProductDetails = styled.div`
  ${flexStyles}

  flex-direction: column;
  align-items: flex-start;
  width: 300px;

  & > * {
    overflow: hidden;
    width: inherit;
  }
`;

export default ProductDetails;

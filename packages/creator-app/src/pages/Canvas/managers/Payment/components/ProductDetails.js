import { flexStyles } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

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

import { FlexCenter, FlexLabel } from '@voiceflow/ui';

import { css, styled, units } from '@/hocs/styled';

import ProductDetails from './ProductDetails';
import ProductTileContainer from './ProductTileContainer';

export { ProductDetails, ProductTileContainer };

export const fontStyles = css`
  font-size: 15px;
`;

export const PaymentContainer = styled(FlexCenter)`
  margin: ${units(12)}px 0;
`;

export const ProductsContainer = styled.div`
  padding-left: ${units(4)}px;
`;

export const ProductName = styled(FlexLabel)`
  ${fontStyles}
  color: #132144 !important;
  font-weight: 600 !important;
`;

export const ProductType = styled(FlexLabel)`
  font-weight: 400 !important;
  font-size: 13px !important;
  color: #8da2b5 !important;
`;

export const AllProductsLink = styled.button`
  ${fontStyles}
  color: #5d9df5;
  cursor: pointer;
  background: none;
  border: none;
`;

export const UpsellSection = styled.div`
  padding-bottom: ${units(2.5)}px;
`;

export const UpsellRequirementItem = styled.li`
  list-style-type: circle;
`;

export const UpsellSectionTitle = styled.div`
  ${fontStyles}

  color: ${({ color }) => color};
`;

export const NoProductLabel = styled.label`
  font-weight: 600;
  margin-top: ${units(2.5)}px;
  color: #132144 !important;
`;

export const NoProductMessage = styled.p`
  margin-bottom: ${units(2)}px;
  color: #62778c;
`;

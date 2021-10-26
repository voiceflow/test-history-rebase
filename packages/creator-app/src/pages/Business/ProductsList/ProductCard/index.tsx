import { Dropdown, IconButton, IconButtonVariant, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { Tooltip } from 'react-tippy';

import * as Product from '@/ducks/product';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';
import * as Models from '@/models';
import { PRODUCT_TYPES } from '@/pages/Business/Product/GuidedSteps/PricingModel';
import LocaleMap from '@/services/LocaleMap';
import { isProductComplete } from '@/utils/product';

import { Container, Description, Details, Icon, Status, StatusText, SubTitle, Title, TooltipInfo } from './components';

export interface ProductCardProps {
  product: Models.Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const { name, subscriptionFrequency, description, locales, type, smallIconUri } = product;

  const duplicateProduct = useDispatch(Product.duplicateProduct, product.id);
  const deleteProduct = useDispatch(Product.deleteProduct, product.id);
  const goToEditProduct = useDispatch(Router.goToEditProduct, versionID, product.id);

  const localeNames = LocaleMap.filter(({ value }) => locales.includes(value)).map(({ name }) => name);
  const { isComplete, missingInfo } = isProductComplete(product);

  const options = [
    {
      value: 'edit',
      label: 'Edit',
      onClick: goToEditProduct,
    },
    {
      value: 'duplicate',
      label: 'Copy Product',
      onClick: duplicateProduct,
    },
    {
      value: 'delete',
      label: 'Delete',
      onClick: deleteProduct,
    },
  ];

  return (
    <Container onClick={goToEditProduct}>
      <Icon background={smallIconUri}>{!smallIconUri && <SvgIcon icon="imageDropzone" size={42} />}</Icon>

      <Details>
        <Title>{name}</Title>
        <SubTitle>
          {PRODUCT_TYPES.find(({ value }) => value === type)?.label}
          {subscriptionFrequency && ` (${subscriptionFrequency})`} - {localeNames.join(', ')}
        </SubTitle>
        <Description>{description}</Description>
      </Details>

      <Dropdown options={options}>
        {(ref, onToggle, isOpen) => (
          <IconButton icon="ellipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={stopPropagation(onToggle)} ref={ref} />
        )}
      </Dropdown>

      <Status>
        <Tooltip
          position="top"
          html={
            <TooltipInfo>
              <StatusText>{isComplete ? 'Complete' : 'Incomplete product cannot be uploaded to Alexa'}</StatusText>
              {missingInfo.map((info, index) => (
                <div key={index}>{info}</div>
              ))}
            </TooltipInfo>
          }
          distance={10}
        >
          <SvgIcon
            icon={isComplete ? 'outlinedFilledCircle' : 'outlinedCircle'}
            color={isComplete ? '#43A047' : '#5D9DF5'}
            size={14}
            className="status-indicator"
          />
        </Tooltip>
      </Status>
    </Container>
  );
};

export default ProductCard;

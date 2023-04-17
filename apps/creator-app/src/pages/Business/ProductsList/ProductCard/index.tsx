import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Dropdown, stopPropagation, SvgIcon, System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Product from '@/ducks/product';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';
import { PRODUCT_TYPES } from '@/pages/Business/Product/GuidedSteps/PricingModel';
import { isProductComplete } from '@/utils/product';

import { Container, Description, Details, Icon, Status, StatusText, SubTitle, Title, TooltipInfo } from './components';

export interface ProductCardProps {
  product: Realtime.Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const { name, subscriptionFrequency, description, locales, type, smallIconUri } = product;

  const duplicateProduct = useDispatch(Product.duplicateProduct, product.id);
  const deleteProduct = useDispatch(Product.deleteProduct, product.id);
  const goToEditProduct = useDispatch(Router.goToEditProduct, versionID, product.id);

  const localeNames = React.useMemo(() => locales.map((locale) => Platform.Alexa.CONFIG.types.voice.project.locale.labelMap[locale]), [locales]);
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
        {({ ref, onToggle, isOpen }) => (
          <System.IconButtonsGroup.Base>
            <System.IconButton.Base ref={ref} icon="ellipsis" active={isOpen} onClick={stopPropagation(onToggle)} />
          </System.IconButtonsGroup.Base>
        )}
      </Dropdown>

      <Status>
        <TippyTooltip
          position="top"
          content={
            <TooltipInfo>
              <StatusText>{isComplete ? 'Complete' : 'Incomplete product cannot be uploaded to Alexa'}</StatusText>
              {missingInfo.map((info, index) => (
                <div key={index}>{info}</div>
              ))}
            </TooltipInfo>
          }
          offset={[0, 10]}
        >
          <SvgIcon
            icon={isComplete ? 'outlinedFilledCircle' : 'outlinedCircle'}
            color={isComplete ? '#43A047' : '#5D9DF5'}
            size={14}
            className="status-indicator"
          />
        </TippyTooltip>
      </Status>
    </Container>
  );
};

export default ProductCard;

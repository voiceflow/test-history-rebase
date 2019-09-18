import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import MenuIcon from '@/componentsV2/ActionMenuButton';
import DropdownMenu from '@/componentsV2/DropdownMenu';
import { copyProduct, deleteProduct } from '@/ducks/product';
import { isProductComplete } from '@/ducks/utils';
import LocaleMap from '@/services/LocaleMap';
import { stopPropagation } from '@/utils/dom';

import { Container, Description, Details, Icon, Status, StatusText, SubTitle, Title, TooltipInfo } from './styled';

export const TYPES = {
  ENTITLEMENT: 'One-Time Purchase',
  CONSUMABLE: 'Consumable',
  SUBSCRIPTION: 'Subscription',
};

function ProductCard({
  copyProduct,
  deleteProduct,
  editProduct,
  defaultLocale,
  product: { name, subscriptionFrequency, locales, type, ...restProduct },
}) {
  const localeNames = LocaleMap.filter(({ value }) => Object.keys(locales).includes(value)).map(({ name }) => name);
  const { isComplete, missingInfo } = isProductComplete({ ...restProduct, name, subscriptionFrequency, locales, type });

  const options = [
    {
      value: 'edit',
      label: 'Edit',
      onClick: editProduct,
    },
    {
      value: 'duplicate',
      label: 'Copy Product',
      onClick: copyProduct,
    },
    {
      value: 'delete',
      label: 'Delete',
      onClick: deleteProduct,
    },
  ];

  return (
    <Container onClick={editProduct}>
      <Icon background={locales[defaultLocale].smallIconUri || locales[defaultLocale].largeIconUri}>
        {!(locales[defaultLocale].smallIconUri || locales[defaultLocale].largeIconUri) && <SvgIcon icon="imageDropzone" size={80} />}
      </Icon>

      <Details>
        <Title>{name}</Title>
        <SubTitle>
          {TYPES[type]}
          {subscriptionFrequency && ` (${subscriptionFrequency})`} - {localeNames.join(', ')}
        </SubTitle>
        <Description>{locales[defaultLocale].description}</Description>
      </Details>

      <DropdownMenu autoWidth options={options}>
        {(ref, onToggle, isOpen) => (
          <MenuIcon ref={ref} onClick={stopPropagation(onToggle)} active={isOpen}>
            <SvgIcon icon="elipsis" />
          </MenuIcon>
        )}
      </DropdownMenu>

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
}

ProductCard.proptypes = {
  product: PropTypes.object,
  locale: PropTypes.string,
  copyProduct: PropTypes.func,
  deleteProduct: PropTypes.func,
  editProduct: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    copyProduct: (skillID, product_id) => dispatch(copyProduct(skillID, product_id)),
    deleteProduct: (skillID, product_id) => dispatch(deleteProduct(skillID, product_id)),
  };
};

const mergeProps = (_, { copyProduct, deleteProduct }, otherProps) => ({
  copyProduct: () => copyProduct(otherProps.skillID, otherProps.product.id),
  deleteProduct: () => deleteProduct(otherProps.skillID, otherProps.product.id),
  editProduct: () => otherProps.history.push(`/tools/${otherProps.skillID}/product/${otherProps.product.id}`),
  defaultLocale: Object.keys(otherProps.product.locales)[0],
  ...otherProps,
});

export default connect(
  null,
  mapDispatchToProps,
  mergeProps
)(ProductCard);

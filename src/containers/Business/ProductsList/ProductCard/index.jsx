/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import IconButton from '@/componentsV2/IconButton';
import { PRODUCT_TYPES } from '@/containers/Business/Product/GuidedSteps/PricingModel';
import { copyProduct, deleteProduct } from '@/ducks/product';
import { goToEditProduct } from '@/ducks/router';
import { activeSkillIDSelector } from '@/ducks/skill';
import { isProductComplete } from '@/ducks/utils/product';
import { connect } from '@/hocs';
import LocaleMap from '@/services/LocaleMap';
import { stopPropagation } from '@/utils/dom';

import { Container, Description, Details, Icon, Status, StatusText, SubTitle, Title, TooltipInfo } from './components';

function ProductCard({
  copyProduct,
  deleteProduct,
  goToEditProduct,
  product: { name, subscriptionFrequency, description, locales, type, smallIconUri, ...restProduct },
}) {
  const localeNames = LocaleMap.filter(({ value }) => locales.includes(value)).map(({ name }) => name);
  const { isComplete, missingInfo } = isProductComplete({
    name,
    subscriptionFrequency,
    description,
    locales,
    type,
    smallIconUri,
    ...restProduct,
  });

  const options = [
    {
      value: 'edit',
      label: 'Edit',
      onClick: goToEditProduct,
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
    <Container onClick={goToEditProduct}>
      <Icon background={smallIconUri}>{!smallIconUri && <SvgIcon icon="imageDropzone" size={80} />}</Icon>

      <Details>
        <Title>{name}</Title>
        <SubTitle>
          {PRODUCT_TYPES.find(({ value }) => value === type).label}
          {subscriptionFrequency && ` (${subscriptionFrequency})`} - {localeNames.join(', ')}
        </SubTitle>
        <Description>{description}</Description>
      </Details>

      <Dropdown options={options}>
        {(ref, onToggle, isOpen) => (
          <IconButton icon="elipsis" variant="flat" active={isOpen} size={15} onClick={stopPropagation(onToggle)} ref={ref} />
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
}

ProductCard.proptypes = {
  copyProduct: PropTypes.func,
  deleteProduct: PropTypes.func,
  editProduct: PropTypes.func,
  skillID: PropTypes.string,
  productID: PropTypes.string,
};

const mapStateToProps = {
  skillID: activeSkillIDSelector,
};

const mapDispatchToProps = {
  copyProduct,
  deleteProduct,
  goToEditProduct,
};

const mergeProps = ({ skillID }, { copyProduct, deleteProduct, goToEditProduct }, { productID }) => ({
  copyProduct: () => copyProduct(skillID, productID),
  deleteProduct: () => deleteProduct(skillID, productID),
  goToEditProduct: () => goToEditProduct(skillID, productID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProductCard);
